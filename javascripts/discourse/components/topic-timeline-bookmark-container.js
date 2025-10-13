// javascripts/discourse/components/topic-timeline-bookmark.js
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";
import { subscribe } from "discourse/lib/pub-sub";

export default class TopicTimelineBookmark extends Component {
  @service currentUser;
  @service store;

  @tracked topic = null;

  constructor() {
    super(...arguments);
    this.topic = this.args.outletArgs.topic;

    // 监听书签变更事件
    subscribe("bookmarks:changed", this, this._onBookmarksChanged);
  }

  _onBookmarksChanged() {
    this.topic = this.args.outletArgs.topic;
  }

  get bookmarkedPosts() {
    return this.topic?.bookmarkCount || 0;
  }

  get buttonClass() {
    let cls = "btn btn-default bookmark";
    if (this.bookmarkedPosts > 0) cls += " bookmarked";
    return cls;
  }

  get icon() {
    if (!this.topic) return "bookmark";
    if (this.topic.bookmarks?.some((b) => b.reminder_at)) {
      return "discourse-bookmark-clock";
    }
    return "bookmark";
  }

  get label() {
    const count = this.bookmarkedPosts;
    if (count === 0) return I18n.t("bookmarked.title");
    if (count === 1) return I18n.t("bookmarked.edit_bookmark");
    return I18n.t("bookmarked.clear_bookmarks");
  }

  get tooltip() {
    const { topic } = this;
    const count = this.bookmarkedPosts;
    if (!topic) return I18n.t("bookmarked.help.bookmark");

    if (count === 0) return I18n.t("bookmarked.help.bookmark");
    if (count === 1) {
      if (topic.bookmarks?.some((b) => b.for_topic)) {
        return I18n.t("bookmarked.help.edit_bookmark_for_topic");
      }
      return I18n.t("bookmarked.help.edit_bookmark");
    }
    if (topic.bookmarks?.some((b) => b.reminder_at)) {
      return I18n.t("bookmarked.help.unbookmark_with_reminder");
    }
    return I18n.t("bookmarked.help.unbookmark");
  }

  @action
  toggleBookmark() {
    const topicController = this.store.lookup("controller:topic");
    topicController.send("toggleBookmark");
  }
}

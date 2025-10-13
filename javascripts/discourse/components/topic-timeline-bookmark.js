// javascripts/discourse/components/topic-timeline-bookmark.js
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";
import { subscribe, unsubscribe } from "discourse/lib/pub-sub";
import { getOwner } from "discourse-common/lib/get-owner";

export default class TopicTimelineBookmark extends Component {
  @tracked topic = null;

  constructor() {
    super(...arguments);
    // outletArgs 在组件内通过 this.args.outletArgs 可用（topic timeline 会把 topic 放进去）
    this.topic = this.args.outletArgs?.topic || null;

    // 订阅全局事件以在书签变更时刷新
    subscribe("bookmarks:changed", this, this._onBookmarksChanged);
  }

  willDestroy() {
    super.willDestroy?.(...arguments);
    // 取消订阅，防止内存泄漏
    unsubscribe("bookmarks:changed", this, this._onBookmarksChanged);
  }

  _onBookmarksChanged = () => {
    // 重新读取 outletArgs.topic（它会在外部数据变更时更新）
    this.topic = this.args.outletArgs?.topic || this.topic;
  };

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
    const topic = this.topic;
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
    // 使用 getOwner 找到 topic controller 并触发 toggleBookmark action，
    // 这是对原先 getOwner(this).lookup('controller:topic') 的直接、兼容写法
    const owner = getOwner(this);
    try {
      const topicController = owner.lookup("controller:topic");
      if (topicController && topicController.send) {
        topicController.send("toggleBookmark");
        return;
      }
    } catch (e) {
      // fallback: 尝试通过全局事件触发（如果 controller 不可用）
    }

    // 作为最后的 fallback，可以触发一个公共事件让 core 去处理（core 通常监听 topic 的相关 action）
    // 这里我们触发一个自定义事件，core 或其它代码可以订阅
    const ev = new CustomEvent("toggleBookmark:requested", {
      bubbles: true,
      detail: { topicId: this.topic?.id },
    });
    document.dispatchEvent(ev);
  }
}

import Component from "@glimmer/component";
import TopicBookmarksMenu from "discourse/components/topic-bookmarks-menu";

export default class TopicTimelineBookmark extends Component {
  static shouldRender(_, { currentUser }) {
    return !!currentUser;
  }

  <template>
    <div class="discourse-bookmark-button-wrapper">
      <TopicBookmarksMenu
        @topic={{@model}}
        @showLabel={{true}}
        @buttonClasses="btn-default"
      />
    </div>
  </template>
}

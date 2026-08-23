// javascripts/discourse/initializers/topic-timeline-bookmark.js
import { apiInitializer } from "discourse/lib/api";
import TopicTimelineBookmark from "../components/topic-timeline-bookmark";

export default apiInitializer((api) => {
  // 使用 timeline-footer-controls-after outlet，这是新的 Glimmer post stream 系统中的正确 outlet
  api.renderInOutlet("timeline-footer-controls-after", TopicTimelineBookmark);
});

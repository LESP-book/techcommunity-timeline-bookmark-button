// javascripts/discourse/initializers/topic-timeline-bookmark.js
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.29.0", (api) => {
  const user = api.getCurrentUser();
  if (!user) {
    return;
  }

  // 在 topic timeline 区域插入我们新的 Glimmer 组件
  api.renderInOutlet("topic-timeline", "topic-timeline-bookmark");
});

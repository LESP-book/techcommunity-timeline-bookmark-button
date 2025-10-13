// javascripts/discourse/initializers/topic-timeline-bookmark.js
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.29.0", (api) => {
  const user = api.getCurrentUser();
  if (!user) return;

  // 注意：renderInOutlet 需要传入 Ember 的 <template> 语法片段，
  // 以便正确在目标 outlet 中渲染我们在 components/ 下注册的组件。
  api.renderInOutlet(
    "topic-timeline",
    <template>
      <TopicTimelineBookmark />
    </template>
  );
});

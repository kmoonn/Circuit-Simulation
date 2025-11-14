## 项目概览
- 技术栈: `Vue 3` + `Vite` + `@layui/layui-vue` UI
- 依赖: `docx`、`file-saver`、`mathjs`（当前未使用）；脚本: `dev/build/preview`
- 别名: `@` 指向 `src`

## 入口与路由
- 入口与插件: `src/main.js:1-12` 安装 `router` 与 `Layui`
- 根组件: `src/App.vue:1-8` 直接渲染 `HomeView`
- 路由配置: `src/router/index.js:4-13` 仅 `"/" → HomeView`，但未使用 `<RouterView />`

## 页面与组件
- 首页页面: `src/views/HomeView.vue:2-82` 布局；状态 `activeModule`（`src/views/HomeView.vue:94-95`）
- 仿真按钮: `simulate` 仅日志（`src/views/HomeView.vue:96-99`）
- 导出文档: `exportDoc` 生成 docx（`src/views/HomeView.vue:100-127`）
- 组件职责:
  - 列表: `src/components/CircuitList.vue:21-43` 发出选择事件
  - 参数: `src/components/ParameterPanel.vue:9-15` 修改 `component.value`
  - 图片: `src/components/CircuitImage.vue:3-10` 仅实现 `moduleId===1`
  - 输出: `src/components/ResultOutput.vue:1-18,21-32` 展示输出条目

## 数据与状态
- 数据源: 模块列表硬编码在 `CircuitList`；经 `emit` 提升为 `HomeView` 的 `activeModule`
- 状态修改: 通过子组件直接改父对象的属性（可行但不易追踪）

## 发现的可优化点
- 路由未生效: 安装了 `router` 但根组件未使用 `<RouterView />`
- 模块数据分散: 建议抽离到 `src/data/modules.js` 统一管理
- 仿真未接入: 有 `mathjs` 依赖但未用于计算
- 图片分支缺失: 仅支持 `mos`，其余模块待补充

## 拟实施步骤（确认后执行）
1. 启用路由视图: 在 `App.vue` 使用 `<RouterView />`，`HomeView` 通过路由渲染
2. 抽离模块数据: 新建 `src/data/modules.js`，`CircuitList` 与 `HomeView` 共享该数据
3. 接入基础仿真: 用 `mathjs` 在 `simulate` 中计算示例输出（如简单电压/功率关系），写回 `activeModule.outputs`
4. 完善图片显示: `CircuitImage` 支持更多 `moduleId` 的资源分支
5. 轻量校验: 防御 `activeModule` 为空的交互与导出场景

## 验证与交付
- 本地运行: `npm i` 或 `pnpm i`；`npm run dev`
- 手动验证: 选择模块 → 参数输入 → 点击仿真 → 查看输出与导出 docx
- 交付内容: 代码改动、运行与验证说明、关键文件路径说明
---
slug: changesets-introduction
title: Changesets 是什么？一篇讲明白 Monorepo 里的版本管理和发版流程
date: 2026-03-22
authors: default
tags: [Changesets, Monorepo, pnpm, 版本管理, 前端工程化]
keywords: [changesets, monorepo, versioning, changelog, semver, pnpm]
description: 用通俗的方式讲清 Changesets 是什么、为什么 Monorepo 需要它，以及它如何管理版本号、生成 CHANGELOG 并协助发版。
image: https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# Changesets 是什么？一篇讲明白 Monorepo 里的版本管理和发版流程

当项目开始走向 `Monorepo`，一个仓库里同时维护多个包时，很快就会遇到一个现实问题：

**代码能一起写了，那版本号、CHANGELOG、发版流程怎么一起管？**

这时候很多团队会用到一个工具：`Changesets`。

如果用一句最通俗的话解释它，可以这么理解：

**Changesets 就像 Monorepo 里的“发版记录单”系统。**

你每做完一次改动，就先记一张“这次改了什么、该升哪个版本”的单子；等准备发版时，再统一计算版本号、生成 CHANGELOG、执行发布。

它最适合的场景，就是：

- 一个仓库里有多个 npm 包
- 包和包之间有依赖关系
- 团队希望版本管理更清晰、发布流程更自动化

<!-- truncate -->

---

## 一、先说结论：Changesets 到底解决了什么问题？

如果项目里只有一个包，手动改版本号还不算特别痛苦。

但一旦到了 Monorepo，情况会立刻复杂很多。

比如你的仓库里有这些包：

```text
packages/
├── cli-devkit
├── cli-plugin-publish
└── cli-plugin-changeset
```

而且：

- `cli-plugin-publish` 依赖 `cli-devkit`
- `cli-plugin-changeset` 也依赖 `cli-devkit`

这时候你会遇到几个典型问题：

- 哪个包这次需要发版？
- 它应该升 `patch`、`minor` 还是 `major`？
- 如果底层包升级了，依赖它的其他包要不要一起变？
- CHANGELOG 谁来写？
- 多个人同时改包时，怎么避免版本管理混乱？

Changesets 就是专门解决这些问题的。

它最核心的能力有四个：

- 管理多个包的版本号
- 自动生成 CHANGELOG
- 协调内部依赖包的版本更新
- 协助完成发版流程

---

## 二、为什么 Monorepo 特别需要 Changesets？

可以先想象一下，如果**没有** Changesets，会发生什么。

### 1. 手动管理版本号很容易乱

你改了一个包，要自己判断：

- 这是 `patch` 还是 `minor`？
- 版本该从 `1.1.19` 改到多少？
- 改的是底层包，依赖它的上层包要不要一起动？

如果包只有一个，也许还能靠人脑记住。  
但当仓库里有 5 个、10 个、20 个包时，这件事就很容易失控。

### 2. CHANGELOG 很容易没人维护

理论上每次发版都应该有变更记录。  
但现实是，很多团队最后都会变成：

- 有人忘了写
- 有人随便写一句
- 有人直接不写

结果就是，版本发了，但过了几周大家都不记得这版到底改了什么。

### 3. 包之间有依赖关系，版本不是独立变化的

例如：

- `cli-devkit` 升级了
- `cli-plugin-publish` 依赖它
- `cli-plugin-changeset` 也依赖它

那你就不能只盯着一个包看，而要考虑整条依赖链。

这也是 Monorepo 发版麻烦的地方：

**问题不是“改哪个包版本”，而是“哪些包会被这次改动影响”。**

---

## 三、Changesets 的核心思路其实很简单

很多人第一次接触 Changesets，会觉得它像一个复杂的发版工具。  
其实它的思路非常朴素：

**先记录变更，再统一处理版本。**

也就是说，它不是要求你每改一次代码就立刻发版，而是分成两步：

1. 平时开发时，先记录“这次改动将来要怎么发”
2. 真正发版时，再统一计算版本、生成 CHANGELOG、执行发布

这也是它为什么特别适合团队协作。

因为每个开发者只需要对自己的改动负责，先写好“这次改了什么”；  
至于最后怎么批量升级版本，交给 Changesets 统一处理。

---

## 四、Changesets 是怎么工作的？

可以把它理解成 3 个阶段：

1. 记录变更
2. 计算版本
3. 执行发布

下面逐个看。

### 1. 第一步：记录变更

每次你完成一项功能或修复一个问题后，可以创建一个 changeset 文件：

```bash
npx @osl/cli changeset add
```

执行之后，它通常会生成一个文件，比如：

```text
.changeset/cool-cats.md
```

内容可能长这样：

```md
---
"@osl/tiny-plugin-publish": patch
---

修复了飞书文档标题包含分支名的问题
```

这个文件其实就是一张“发版记录单”，记录了三件事：

- 哪个包要更新：`@osl/tiny-plugin-publish`
- 更新类型：`patch`
- 这次改动的描述：修复了什么问题

所以 changeset 文件本质上不是代码，而是：

**一次改动对应的一份发布说明。**

### 2. 第二步：统一计算版本

等到准备发版时，再执行：

```bash
npx @osl/cli changeset version
```

这一步会做很多自动化工作：

- 读取所有未消费的 changeset 文件
- 计算每个包的新版本号
- 更新各个包的 `package.json`
- 生成或更新 `CHANGELOG.md`
- 根据配置同步处理内部依赖版本
- 删除已经处理过的 changeset 文件

版本号的计算遵循语义化版本（SemVer）：

- `patch`：小修复，向后兼容，例如 `1.1.19 -> 1.1.20`
- `minor`：新功能，向后兼容，例如 `1.1.19 -> 1.2.0`
- `major`：破坏性更新，不向后兼容，例如 `1.1.19 -> 2.0.0`

也就是说，`version` 这一步不是“发包”，而是：

**把之前记录好的变更，统一变成真正的版本号和 CHANGELOG。**

### 3. 第三步：执行发布

等版本和 changelog 都整理好之后，再进入发布阶段。

例如：

```bash
pnpm publish:local
# 或
pnpm publish:prod
```

具体命令会根据你的项目脚本不同而不同，但通常这一阶段会完成：

- 构建包
- 发布到 npm registry
- 创建 git tag
- 推送代码或发布结果

所以如果要一句话概括整个流程，就是：

**changeset add 负责记账，changeset version 负责结算，publish 负责真正发出去。**

---

## 五、把它放进真实工作流里，就很好理解了

假设你修复了一个 bug，比如：

`packages/cli-plugin-publish/src/lib/utils.ts`

那么一套典型流程会是这样：

```bash
# 1. 修改代码

# 2. 创建 changeset，记录这次改动
npx @osl/cli changeset add

# 3. 提交代码和 changeset 文件
git add .
git commit -m "fix: 修复飞书文档标题"
git push
```

这时候通常还**没有真正发版**，只是把“将来要怎么发”记录下来了。

等真正准备发布时，再执行：

```bash
# 4. 统一计算版本和 changelog
npx @osl/cli changeset version

# 5. 提交版本更新结果
git add .
git commit -m "chore: version bump"
git push

# 6. 正式发布
pnpm publish:local
```

这个流程的好处是：

- 平时开发时不用一边写代码一边手动改版本
- 多个改动可以先积累，等到合适时机统一发版
- 发版时不需要靠人肉统计“这次到底改了哪些包”

---

## 六、Changesets 为什么特别适合团队协作？

因为它把“写代码”和“决定怎么发版”拆开了。

在团队协作里，每个开发者可以这样做：

- 改自己的代码
- 给自己的改动补一个 changeset
- 把代码和 changeset 一起提交

这样等分支合并后，仓库里就自然积累了一批“待发布记录”。

等到发版时，Changesets 会把这些记录统一汇总起来。

这就比传统的人肉流程稳定很多：

- 不容易漏掉变更
- 不容易忘记写 CHANGELOG
- 不需要靠某个人临时整理版本影响范围

所以你完全可以把 Changesets 理解成：

**团队协作下的发版中间层。**

---

## 七、内部依赖版本是怎么联动的？

这是 Changesets 很有价值的一点。

比如你的配置里有这样一项：

```json
{
  "updateInternalDependencies": "patch"
}
```

它的意思是：

如果某个内部依赖包升级了，那么依赖它的其他包也会按规则自动更新版本。

例如：

- `cli-devkit` 从 `1.0.0` 升到 `1.1.0`
- `cli-plugin-publish` 依赖 `cli-devkit`

那么在配置允许的情况下，`cli-plugin-publish` 也可能自动补一次版本更新，比如：

- `1.1.19 -> 1.1.20`

为什么要这样做？

因为在 Monorepo 里，发版不是孤立事件。  
底层包一变，依赖它的上层包往往也受影响。

Changesets 能做的，就是把这种“依赖链上的版本联动”也纳入自动化流程里。

这样会带来几个好处：

- 保持依赖关系一致
- 减少版本冲突
- 避免漏改依赖链上的包

---

## 八、版本类型到底怎么选？

很多人刚用 Changesets 时，最容易纠结的就是：  
这次到底该选 `patch`、`minor` 还是 `major`？

你可以先用最简单的方式记：

- `patch`：修 bug，小修小补，不影响原有用法
- `minor`：加新功能，但旧用法还能继续用
- `major`：有破坏性变更，旧代码可能会失效

也可以直接对应成版本变化：

- `patch`：`1.1.19 -> 1.1.20`
- `minor`：`1.1.19 -> 1.2.0`
- `major`：`1.1.19 -> 2.0.0`

如果你不确定怎么选，可以问自己一个问题：

**“别人升级到我这个版本后，原来的代码会不会出问题？”**

如果不会，多半是 `patch` 或 `minor`；  
如果会，那大概率就是 `major`。

---

## 九、Changesets 的几个核心好处

### 1. 版本管理自动化

不用手动计算每个包该升到多少版本，工具会根据 changeset 统一处理。

### 2. CHANGELOG 更清晰

变更记录不是临时回忆出来的，而是每次改动时就顺手记下来的。

### 3. 发布时机更灵活

你可以积累多个 changeset，等到合适的时候一起发版，而不是每改一次就立刻发。

### 4. 团队协作更顺

每个人都只需要为自己的改动补一张“记录单”，发版时统一汇总，流程更清晰。

### 5. 更适合 Monorepo

因为它天然能处理多包版本、内部依赖和 changelog 这些 Monorepo 里的常见问题。

---

## 十、最后怎么记住 Changesets？

如果要把它压缩成一句最容易记住的话，那就是：

**Changesets = Monorepo 里的版本管理待办清单。**

你可以把整个流程理解成：

- 写代码：完成实际改动
- 创建 changeset：记录“这次改动将来要怎么发”
- 执行 `version`：统一计算版本号并生成 CHANGELOG
- 执行 `publish`：真正把包发出去

所以它最重要的价值，并不是“帮你多跑了几个命令”，而是让发版这件事从“人肉记忆 + 手工操作”，变成“有记录、有规则、可自动化”的流程。

对于 Monorepo 来说，这一点非常重要。

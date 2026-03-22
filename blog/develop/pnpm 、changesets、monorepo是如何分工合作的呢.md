---
slug: pnpm-changesets-monorepo-how-they-work-together
title: pnpm、Changesets、Monorepo 是怎么分工合作的？
date: 2026-03-22
authors: default
tags: [pnpm, Changesets, Monorepo, Workspace, 前端工程化]
keywords: [pnpm, changesets, monorepo, workspace, 发版流程, 前端工程化]
description: 用通俗的方式讲清 Monorepo、pnpm workspace 和 Changesets 分别负责什么，以及它们在开发和发版流程里是如何配合工作的。
image: https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# pnpm、Changesets、Monorepo 是怎么分工合作的？

很多人第一次接触前端工程化时，看到 `Monorepo`、`pnpm workspace`、`Changesets` 这几个词，经常会有点混：

- 它们是不是一回事？
- 为什么总是一起出现？
- 到底谁负责开发，谁负责发布？

其实它们不是同一种东西，而是处在**不同层级**。

如果只用一句话总结三者关系，可以这么理解：

**Monorepo 负责“组织方式”，pnpm workspace 负责“本地开发和依赖管理”，Changesets 负责“版本管理和发布”。**

也就是说：

- `Monorepo` 是一种架构思路
- `pnpm workspace` 是落地这套架构的开发工具
- `Changesets` 是给这套架构补上发版流程的工具

这篇文章就专门把这三者的分工讲清楚。

<!-- truncate -->

---

## 一、先说结论：三者不是同一个层面的东西

很多人会把这三个词放在一起理解，但其实它们并不在同一层。

你可以先看这张最简化关系图：

```text
Monorepo：决定“一个仓库放多个包”
    ↓
pnpm workspace：负责识别这些包、安装依赖、管理本地引用
    ↓
Changesets：负责这些包的版本号、CHANGELOG 和发布
```

所以最核心的区别是：

- `Monorepo` 是**架构模式**
- `pnpm workspace` 是**开发协作工具**
- `Changesets` 是**版本与发布工具**

如果你把它们混成一团，就很容易越学越乱。  
但一旦把“层级”分开，事情就会非常清楚。

---

## 二、Monorepo 是什么？它负责什么？

先从最上层说。

`Monorepo` 不是一个具体工具，而是一种项目组织方式。它表达的是：

**把多个相关项目或多个 npm 包，放进同一个仓库里统一管理。**

比如一个仓库可能长这样：

```text
fe-universal-repo/
├── apps/
├── packages/
└── ...
```

其中：

- `apps` 放应用
- `packages` 放可复用包

这就是 Monorepo 的典型结构。

### Monorepo 负责的事情

它本身只负责回答一个问题：

**“这个仓库是不是一个多包仓库？”**

也就是说，它决定的是架构方向：

- 一个仓库里能不能放多个包
- 这些包是不是要一起维护
- 应用和共享包是不是放在一起

但它**不负责具体实现**。

换句话说，Monorepo 更像一种理念，而不是命令行工具。

---

## 三、pnpm workspace 是什么？它负责什么？

如果说 Monorepo 是“设计图”，那 `pnpm workspace` 就是把这张设计图真正落地的工具。

因为光有“一个仓库放多个包”这个想法，还不够。  
你还需要解决很多实际问题：

- 哪些目录算包？
- 包和包之间怎么互相引用？
- 依赖怎么统一安装？
- 本地修改后怎么马上生效？

这些，都是 `pnpm workspace` 在做的事。

### 1. 它先告诉 pnpm：哪些目录是包

这通常通过根目录的 `pnpm-workspace.yaml` 来声明：

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

这段配置的意思很简单：

- `apps/*` 匹配到的目录，视为 workspace 包
- `packages/*` 匹配到的目录，也视为 workspace 包

比如：

- `apps/workbench`
- `packages/cli-devkit`
- `packages/cli-plugin-publish`

都会被 pnpm 当成同一个 workspace 里的成员。

### 2. 它负责包之间的本地依赖关系

假设 `cli-plugin-publish` 依赖 `cli-devkit`，那么可以在 `package.json` 里这样写：

```json
{
  "dependencies": {
    "@osl/cli-devkit": "workspace:*"
  }
}
```

这里的 `workspace:*` 非常关键，它的意思可以简单理解成：

**优先使用当前仓库里的本地包，而不是去 npm 上下载。**

这带来的效果是：

- 不需要先发布到 npm
- 包和包之间可以直接联调
- 改了底层包，上层包通常很快就能看到变化

### 3. 它负责统一安装依赖

在 workspace 根目录执行：

```bash
pnpm install
```

pnpm 会做的不只是当前目录安装，而是：

- 扫描整个 workspace
- 安装所有包的依赖
- 建立包之间的本地引用关系
- 尽量复用依赖，减少重复安装

所以 pnpm workspace 的核心职责，概括起来就是：

**让 Monorepo 里的多个包能在本地顺畅协作。**

---

## 四、Changesets 是什么？它负责什么？

当你已经用 Monorepo + workspace 把开发阶段跑顺之后，下一个问题就是：

**这些包要怎么发版？**

这时候 Changesets 就上场了。

它主要解决的不是“怎么开发”，而是：

- 哪个包要升级版本
- 升 `patch`、`minor` 还是 `major`
- CHANGELOG 怎么生成
- 内部依赖包版本怎么联动
- 最后怎么把这些包发布出去

### 1. 它先记录变更

每次完成一项改动后，可以创建一个 changeset：

```bash
npx @osl/cli changeset add
```

它会生成一个 `.changeset/xxx.md` 文件，用来记录：

- 哪个包要发版
- 版本类型是什么
- 这次改了什么

你可以把它理解成一张“发版记录单”。

### 2. 它统一计算版本号

准备发版时，再执行：

```bash
npx @osl/cli changeset version
```

这一步会：

- 读取所有 changeset 文件
- 计算每个包的新版本
- 更新 `package.json`
- 生成或更新 `CHANGELOG.md`
- 处理内部依赖包的版本联动

### 3. 它配合发布脚本完成真正的发布

例如：

```bash
pnpm publish:local
```

在项目配置好的前提下，这一步通常会：

- 构建包
- 发布到 npm registry
- 打 git tag

所以 Changesets 的职责很明确：

**它主要负责发版前后的版本管理，而不是取代 pnpm 来管理依赖。**

---

## 五、三者在开发阶段是怎么配合的？

先看开发阶段。

假设现在有两个包：

- `cli-devkit`
- `cli-plugin-publish`

其中 `cli-plugin-publish` 依赖 `cli-devkit`。

在开发阶段，三者分工可以这样理解：

### 1. Monorepo 提供整体结构

它决定了这两个包放在同一个仓库里维护。

### 2. pnpm workspace 负责本地协作

它让两个包可以通过 `workspace:*` 直接引用。

所以开发者在本地调试时会有一个非常明显的体验：

- 修改 `cli-devkit`
- `cli-plugin-publish` 很快就能用到新代码
- 不需要先发布到 npm
- 不需要来回安装远程依赖

### 3. Changesets 在这个阶段先不发版，只负责“记账”

也就是说，Changesets 在开发阶段不是主角。  
它做的是在你完成改动后，帮你把“将来这次要怎么发”先记录下来。

所以开发阶段最主要的配合关系是：

```text
Monorepo 决定把多个包放一起
    ↓
pnpm workspace 让这些包能本地协作
    ↓
Changesets 记录这次改动将来怎么发版
```

---

## 六、三者在发布阶段是怎么配合的？

到了发版阶段，主角就从 `pnpm workspace` 变成了 `Changesets`。

### 1. Changesets 先读取变更记录

它会把之前开发过程中积累的 `.changeset/*.md` 文件全部读出来。

### 2. 根据包结构判断影响范围

这一步并不是凭空算，而是结合 workspace 里的包关系来处理。

也就是说，Changesets 之所以知道“哪些包会受影响”，是因为仓库本来就已经通过 workspace 建立了多包结构和依赖关系。

### 3. 统一更新版本、CHANGELOG 和内部依赖

比如：

- `cli-devkit` 升级了
- `cli-plugin-publish` 依赖它

那 Changesets 就可以根据配置去联动更新上层包版本。

### 4. 最后交给发布命令真正发出去

这个阶段通常还是借助 `pnpm` 的脚本体系来执行构建和发布。

所以发布阶段可以总结成：

```text
Changesets 读取变更记录
    ↓
结合 workspace 里的包关系
    ↓
计算版本号和 changelog
    ↓
配合 pnpm 脚本完成发布
```

---

## 七、用一个完整例子串起来看

假设你修复了 `cli-plugin-publish` 的一个 bug。

那么整个流程大概是这样：

### 第一步：在 Monorepo 里开发

你在同一个仓库里修改代码，比如：

```text
packages/cli-plugin-publish/src/lib/utils.ts
```

如果这个包依赖了 `cli-devkit`，那么因为有 workspace，本地依赖关系已经打通，不需要先发 npm 包再测试。

### 第二步：用 Changesets 记录这次改动

```bash
npx @osl/cli changeset add
```

这一步会记录：

- 改的是哪个包
- 是 `patch`、`minor` 还是 `major`
- 这次改动的描述

### 第三步：准备发版时统一升级版本

```bash
npx @osl/cli changeset version
```

它会自动：

- 计算版本号
- 更新 `package.json`
- 更新 `CHANGELOG.md`

### 第四步：执行发布

```bash
pnpm publish:local
```

这一步把最终的构建和发包真正跑起来。

所以这个完整流程，其实就是：

```text
Monorepo 提供多包仓库结构
    ↓
pnpm workspace 负责本地开发协作
    ↓
Changesets 负责版本记录和发布准备
    ↓
pnpm 脚本执行最终发布
```

---

## 八、再用一个更容易记住的类比

如果还是觉得抽象，可以把它们类比成“建房子”：

- `Monorepo` = 房子的设计方案
- `pnpm workspace` = 施工和日常管理工具
- `Changesets` = 交房时的登记、编号和销售流程

这个类比不一定完全严谨，但对初学者很好记。

因为它刚好对应三者的职责：

- `Monorepo` 决定整体结构
- `pnpm workspace` 让结构真正运行起来
- `Changesets` 让最终版本和发布流程可控

---

## 九、最容易混淆的地方，我再帮你拆一下

### 1. Monorepo 不是 pnpm

Monorepo 是一种架构思路，不是某个命令行工具。

你可以用 pnpm 来做 Monorepo，也可以用其他工具链来做。

### 2. pnpm workspace 不负责版本发布策略

pnpm workspace 主要负责包管理、依赖安装、本地联动。  
它不是专门解决 CHANGELOG 和多包发版规则的工具。

### 3. Changesets 不负责创建 Monorepo

Changesets 假设你的多包结构已经存在，它是在这个基础上补上版本和发版管理。

所以更准确的理解是：

**Changesets 是建立在 Monorepo + workspace 之上的发版层。**

---

## 十、最后怎么记住三者的分工？

如果你只想记一句最重要的话，可以记这个版本：

**Monorepo 决定“把多个包放在一个仓库里”，pnpm workspace 解决“这些包怎么在本地协作”，Changesets 解决“这些包怎么统一发版”。**

再压缩一点就是：

- `Monorepo`：管结构
- `pnpm workspace`：管开发
- `Changesets`：管发布

这三者不是互相替代，而是刚好拼成了一套完整的多包工程化工作流。

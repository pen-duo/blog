---
slug: workspace-introduction
title: Workspace 是什么？一篇讲明白 Monorepo 里为什么要用它
date: 2026-03-22
authors: default
tags: [Workspace, pnpm, Monorepo, 前端工程化]
keywords: [workspace, pnpm workspace, monorepo, 包管理, 前端工程化]
description: 用通俗的方式讲清什么是 Workspace、它解决了什么问题，以及在 pnpm Monorepo 里它是如何让多个包互相引用的。
image: https://images.unsplash.com/photo-1516321310764-8d15b7a9f1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# Workspace 是什么？

很多人第一次接触 `pnpm workspace`、`yarn workspace` 或 `monorepo`，都会有点懵：

**为什么一个仓库里会有这么多包？它们又是怎么互相引用的？**

这时候你大概率会看到一个词：`Workspace`。

如果只用一句人话解释它，可以这么理解：

**Workspace 就是把一个仓库里的多个包组织起来，让它们既能一起管理，又能直接互相依赖。**

它最常见的使用场景，就是 `Monorepo`。

比如一个前端仓库里，可能同时有：

- 一个主应用
- 一个组件库
- 一个工具包
- 一个命令行脚手架

这些包都放在同一个仓库里，但又不是一坨代码混在一起。  
这时候，Workspace 就是把它们串起来的那套机制。

<!-- truncate -->

---

## 一、先说结论：Workspace 到底解决了什么问题？

你可以先记住这句话：

**没有 Workspace，多包之间协作很麻烦；有了 Workspace，同仓库里的包可以像“本地模块”一样直接互相使用。**

它主要解决的是这几个问题：

- 一个仓库里如何管理多个包
- 包与包之间如何直接引用
- 多个包的依赖如何统一安装
- 多个包的脚本如何统一执行

所以 Workspace 本质上不是“某个框架功能”，而是一种**多包协作机制**。

---

## 二、为什么会需要 Workspace？

先假设一个很常见的场景。

你有两个项目：

- `cli-plugin-publish`
- `cli-devkit`

其中 `cli-plugin-publish` 依赖 `cli-devkit`。

### 1. 没有 Workspace 的时候

如果这两个包是彼此独立的，那么开发流程通常会很别扭：

1. 先开发 `cli-devkit`
2. 把它发布到 npm
3. 再回到 `cli-plugin-publish` 里安装这个新版本
4. 如果 `cli-devkit` 改了，还得重新发布、重新安装

也就是说，你明明只是想在本地调试两个关联模块，却不得不走一遍“发布 -> 安装 -> 再测试”的流程。

这会带来几个问题：

- 开发效率低
- 调试成本高
- 版本切换麻烦
- 很容易出现“我本地改了，但另一个包还没用上”的情况

### 2. 有 Workspace 的时候

有了 Workspace 后，思路就完全不一样了：

**既然这些包都在同一个仓库里，那就直接让它们在本地互相引用。**

也就是说：

- 不需要先发 npm
- 不需要来回安装
- 一个包改完，另一个包可以马上感知到

这就是 Workspace 最核心的价值。

---

## 三、Workspace 最简单的人话定义

你可以把 Workspace 想成一个“包清单 + 协作规则”。

它主要做两件事：

1. 告诉包管理器：这个仓库里，哪些目录算是包
2. 告诉包管理器：这些包之间可以直接使用本地版本互相依赖

所以它不是单纯“多建几个文件夹”，而是让包管理器真正理解：

**这个仓库不是一个项目，而是一组有关联的项目。**

---

## 四、在 pnpm 里，Workspace 是怎么声明的？

在 `pnpm` 里，最常见的方式是根目录放一个 `pnpm-workspace.yaml`。

例如：

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

它表达的意思很简单：

- `apps` 目录下匹配到的子目录，都是一个包
- `packages` 目录下匹配到的子目录，也都是一个包

比如这几个目录，pnpm 就会把它们识别成 workspace 里的成员：

- `apps/workbench`
- `packages/cli-plugin-publish`
- `packages/cli-devkit`

也就是说，从这一刻开始，pnpm 不再只把它们看成普通文件夹，而是把它们当成一组能协作的包。

---

## 五、包和包之间是怎么互相引用的？

这也是很多人最关心的部分。

假设 `cli-plugin-publish` 依赖本地的 `cli-devkit`，在 `package.json` 里可能会这么写：

```json
{
  "dependencies": {
    "@osl/cli-devkit": "workspace:*",
    "inquirer": "^8.2.6"
  }
}
```

这里最关键的是：

```json
"@osl/cli-devkit": "workspace:*"
```

`workspace:*` 的意思可以简单理解成：

**优先使用当前 Workspace 里那个本地包，而不是去 npm 上下载一个远程版本。**

所以它带来的效果是：

- 直接使用本地 `packages/cli-devkit`
- 不需要先发布到 npm
- 修改 `cli-devkit` 后，`cli-plugin-publish` 很快就能用到新代码

如果你以前的认知是“依赖必须先发包才能给别人用”，那 Workspace 就是在告诉你：

**同一个仓库里的包，不需要绕远路走 npm，可以直接本地联动。**

---

## 六、统一管理依赖，这件事为什么很重要？

使用 Workspace 后，一个很明显的变化是：

**你通常只需要在仓库根目录执行一次安装命令。**

比如：

```bash
pnpm install
```

这条命令会做的事，不只是“安装当前目录依赖”，而是：

- 安装整个 workspace 里所有包的依赖
- 建立它们之间的本地链接关系
- 尽量复用依赖，减少重复安装

这就带来两个实际好处：

### 1. 依赖安装更统一

你不需要每进一个包都手动跑一遍安装命令。

### 2. 依赖复用更充分

多个包用到相同依赖时，pnpm 可以更高效地复用，节省空间。

当然，这里还有一个重要前提：

**虽然依赖可以统一安装，但每个包依然只能访问自己声明过的依赖。**

这也是 pnpm 在 workspace 场景里依然保持“严格依赖”的原因。

---

## 七、没有 Workspace 和有 Workspace，到底差在哪？

拿刚才那个例子继续看，会更直观。

### 没有 Workspace

```text
项目 A（cli-plugin-publish）
└── 依赖项目 B（cli-devkit）
    ├── 必须先把 B 发布到 npm
    ├── 然后 A 再安装 B
    └── B 改了以后，还要重新发布再安装
```

这种方式的问题是，明明只是本地两个项目协作，却被迫走成了“线上发包流程”。

### 有 Workspace

```text
fe-universal-repo
├── packages/cli-devkit
└── packages/cli-plugin-publish
    └── 直接依赖 "@osl/cli-devkit": "workspace:*"
```

这时候流程就变成：

- `cli-devkit` 改完
- `cli-plugin-publish` 可以直接使用
- 不需要发布
- 不需要额外安装远程版本

从开发体验上讲，这几乎就是“本地联调”的升级版。

---

## 八、Workspace 的几个核心好处

### 1. 开发效率更高

这是最直观的收益。

包和包之间的联动不需要经过发布流程，本地修改后很快就能验证。

特别适合这些场景：

- 一个应用依赖多个内部包
- 一个组件库被多个项目共同使用
- 一个工具包和多个插件一起开发

### 2. 依赖管理更统一

多个包都放在同一个仓库里，依赖安装、版本调整、脚本执行都会更集中。

这比“每个项目各自一套”更好维护。

### 3. 节省空间

多个包共享依赖安装体系，重复依赖可以更好地复用。

这在 `pnpm` 里会特别明显，因为它本身就很强调依赖复用。

### 4. 版本管理更简单

多个包在同一个仓库里，统一改版本、统一发布、统一维护会方便很多。

对于组件库、工具链、脚手架这类项目尤其明显。

### 5. 原子性提交更好

假设你同时修改了：

- `cli-devkit`
- `cli-plugin-publish`

那你完全可以在一个提交里把这两部分改动一起提交。

这样好处是：

- 改动关系清楚
- 依赖关系一致
- 不容易出现“这个包改了，但另一个包还没跟上”的问题

---

## 九、Workspace 适合哪些项目？

不是所有项目都一定要用 Workspace，但下面这些场景通常很适合：

- 一个仓库里有多个应用
- 一个仓库里有多个共享包
- 组件库 + 文档站 + 示例项目放在一起
- 工具链项目拆成多个子包维护
- Monorepo 项目

如果你的仓库里只有一个单独项目，没有本地多包协作需求，那 Workspace 的必要性就没那么强。

所以它不是“高级就一定要用”，而是：

**当你开始管理多个相互依赖的包时，Workspace 会非常顺手。**

---

## 十、几个常用命令

在实际使用里，下面几个命令最常见。

### 安装整个 Workspace 的依赖

```bash
pnpm install
```

### 只给某个包安装依赖

```bash
pnpm --filter @osl/tiny-plugin-publish add lodash
```

### 在某个包里执行脚本

```bash
pnpm --filter @osl/tiny-plugin-publish build
```

### 给所有包递归执行脚本

```bash
pnpm -r build
```

这里的 `-r` 是 `recursive`，意思是递归地对 workspace 中的多个包执行命令。

---

## 十一、最后怎么记住 Workspace？

如果要把 Workspace 压缩成一句最容易记住的话，那就是：

**Workspace = 把多个包放进同一个仓库里统一管理，并允许它们直接使用彼此的本地代码。**

所以它真正解决的，不只是“目录怎么放”，而是：

- 多包如何协作
- 本地包如何互相依赖
- 多个包如何统一安装和执行脚本

如果你把它想成“Monorepo 里的本地包协作机制”，基本就不会理解偏。

对于前端工程化来说，Workspace 几乎就是从“单项目开发”走向“多包协作开发”的第一步。

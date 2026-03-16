---
slug: nestjs-module-import
title: NestJS 模块引用说明
date: 2026-01-28
authors: default
tags: [NestJS, TypeScript, Node.js, 后端]
keywords: [NestJS, 模块, imports, exports, Global, DI]
description: 在 NestJS 里模块间如何互相引用？普通引用（imports + exports）与全局引用（@Global()）分别怎么用、适用什么场景。
image: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# NestJS 模块引用说明

在 NestJS 里，一个模块要用到另一个模块里的 **Provider**（如 Service），不能直接注入，必须先建立「谁导出、谁导入」的关系。下面先说**普通引用**怎么配，再说如何用 **@Global()** 做「全局引用」，最后对比两种方式。

<!-- truncate -->

---

## 一、模块间如何互相引用

一个模块要使用另一个模块里的 Provider（如 **AaaService**），必须满足两点：

1. **被用到的模块要「导出」这个 Provider**  
   在模块的 `@Module()` 里用 `exports: [AaaService]` 把要给别人用的服务列出来。
2. **使用方模块要「导入」那个模块**  
   在使用方模块的 `@Module()` 里用 `imports: [AaaModule]` 把提供该服务的模块引进来。

### 项目示例

**AaaModule** 提供并导出了 **AaaService**：

```ts
// aaa.module.ts
@Module({
  controllers: [AaaController],
  providers: [AaaService],
  exports: [AaaService],
})
export class AaaModule {}
```

**BbbService** 注入了 `AaaService`：

```ts
// bbb.service.ts
export class BbbService {
  constructor(private aaaService: AaaService) {}
}
```

按「普通引用」的写法，**BbbModule** 应这样写：

```ts
// bbb.module.ts
@Module({
  imports: [AaaModule],  // 显式导入 AaaModule，才能用 AaaService
  controllers: [BbbController],
  providers: [BbbService],
})
export class BbbModule {}
```

本项目中 **BbbModule** 的 `imports` 是空的，BbbService 仍能注入 AaaService，是因为使用了下面说的 **全局模块**。

---

## 二、如何实现「全局引用」：@Global() 模块

当某个模块被标记为**全局模块**后，它导出的 Provider 会在整个应用里可用，其它模块**不需要**再在 `imports` 里写这个模块。

### 项目中的用法

**AaaModule** 使用 `@Global()`：

```ts
// aaa.module.ts
import { Module, Global } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';

@Global()
@Module({
  controllers: [AaaController],
  providers: [AaaService],
  exports: [AaaService],
})
export class AaaModule {}
```

**要点：**

- **@Global()**：把该模块变成「全局模块」。
- **exports: [AaaService]**：只有被 `exports` 的 Provider 才会对外可见；全局模块只是让「这些已导出的」在所有地方可用。

因此：

- 在 **AppModule** 里只需 `imports: [AaaModule, BbbModule, ...]` 引入一次 AaaModule。
- BbbModule、CccModule、DddModule 等都不必再写 `imports: [AaaModule]`，也可直接注入 AaaService。

---

## 三、两种方式对比

| 方式     | 做法                                                                 | 使用场景                                                                 |
| -------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 普通引用 | 在需要用的模块里 `imports: [AaaModule]`，AaaModule 里 `exports: [AaaService]` | 依赖关系清晰、按需引用，适合大部分业务模块                               |
| 全局引用 | 在 AaaModule 上加 `@Global()`，并在根模块 `imports: [AaaModule]`，其它地方不用再 import | 像配置、数据库连接、日志等「到处都要用」的模块                           |

---

## 总结

- **模块间互相引用**：通过 **imports + exports** 建立「谁可以用谁」的关系。
- **全局引用**：在提供方模块上使用 **@Global()**，并在根模块引入一次，其 `exports` 的 Provider 即可在整个应用中注入使用。

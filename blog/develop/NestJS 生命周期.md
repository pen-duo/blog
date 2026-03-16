---
slug: nestjs-lifecycle
title: NestJS 生命周期
date: 2026-01-28
authors: default
tags: [NestJS, TypeScript, Node.js, 后端]
keywords: [NestJS, 生命周期, OnModuleInit, OnApplicationShutdown, ModuleRef]
description: NestJS 里谁可以有生命周期？五个钩子的触发时机与执行顺序，如何触发关闭流程，以及 ModuleRef 的用法。
image: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# NestJS 生命周期

NestJS 的**生命周期钩子**让你在应用启动、运行和关闭的不同阶段插入逻辑。下面先说明**谁**可以实现这些钩子，再按时间顺序介绍**五个钩子**、**执行顺序**、**如何触发关闭**，以及 **ModuleRef** 的典型用法。

<!-- truncate -->

---

## 一、谁可以有生命周期？

**Module、Controller、Provider（如 Service）** 都可以实现同一套生命周期接口，不是只有 Module 才有。

```ts
// 在 Module 上
@Module({...})
export class CccModule implements OnModuleInit { ... }

// 在 Controller 上
@Controller()
export class CccController implements OnModuleInit { ... }

// 在 Service 上
@Injectable()
export class CccService implements OnModuleInit { ... }
```

**注意**：**请求作用域（request-scoped）** 的类不会触发这些生命周期钩子，因为它们的生命周期和请求绑定，与应用启停无关。

---

## 二、五个生命周期钩子（按时间顺序）

| 阶段 | 钩子 | 触发时机 |
|------|------|----------|
| 启动 | `onModuleInit()` | 当前模块依赖都解析完后 |
| 启动 | `onApplicationBootstrap()` | 所有模块都初始化完，但还没开始监听端口 |
| 运行 | — | 应用正常处理请求 |
| 关闭 | `onModuleDestroy()` | 收到终止信号或调用了 `app.close()` 之后 |
| 关闭 | `beforeApplicationShutdown(signal?)` | 所有 `onModuleDestroy` 都执行完后，连接即将关闭前 |
| 关闭 | `onApplicationShutdown(signal?)` | 连接已关闭（`app.close()` 完成）之后 |

---

## 三、执行顺序与「优先级」

### 启动阶段

1. **模块顺序**：按模块依赖的拓扑顺序。例如 A 依赖 B，则先执行 B 的 `onModuleInit`，再执行 A 的。
2. **同一模块内**：先执行该模块类（Module）的 `onModuleInit`，再执行该模块下 Provider/Controller 的 `onModuleInit`（同模块内多个 Provider 之间是并发执行，无固定先后）。
3. **最后**：所有模块的 `onModuleInit` 都完成后，再按类似顺序执行各处的 `onApplicationBootstrap`。

可以简单记：**先模块，再模块内的 Provider/Controller；先 onModuleInit，再 onApplicationBootstrap**。

### 关闭阶段

顺序固定为：

1. 所有 `onModuleDestroy()`（顺序与启动时类似）
2. 所有 `beforeApplicationShutdown(signal?)`
3. 关闭连接（内部 `app.close()`）
4. 所有 `onApplicationShutdown(signal?)`

没有「Controller 优先于 Module」之类的特殊优先级，都是按「模块 + 类类型」的统一顺序执行。

---

## 四、如何触发「终止」？（beforeApplicationShutdown / onApplicationShutdown）

关闭阶段的三个钩子只有在应用**进入关闭流程**时才会被调用，有两种方式。

### 方式 1：主动调用 app.close()

```ts
// main.ts
const app = await NestFactory.create(AppModule);
await app.listen(3000);

// 例如 3 秒后主动关闭
setTimeout(() => {
  app.close();  // 会依次触发 onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown
}, 3000);
```

### 方式 2：进程收到系统信号（SIGTERM、SIGINT 等）

例如在终端按 **Ctrl+C**（SIGINT），或 Kubernetes 发 **SIGTERM**。前提是必须先开启关闭钩子：

```ts
// main.ts
const app = await NestFactory.create(AppModule);

app.enableShutdownHooks();  // 必须调用，否则收信号不会走关闭钩子

await app.listen(3000);
```

不调 `enableShutdownHooks()` 时，只有手动调用 `app.close()` 才会触发那三个关闭钩子。

---

## 五、ModuleRef 是什么？

**ModuleRef** 是 Nest 在 `@nestjs/core` 里提供的类，用来在**当前模块里**按需获取某个 Provider 的实例。

- **典型用法**：在 Module 的构造函数里注入 `ModuleRef`，在生命周期方法（如 `onApplicationShutdown`）里用 `this.moduleRef.get(SomeService)` 拿到该模块下的 SomeService 实例。
- **为什么有用**：Module 类本身一般不直接注入业务 Service，若需要在生命周期里调用某个 Service，就用 `ModuleRef.get(Service)` 按类取实例。
- **get()** 默认只查当前模块的 Provider；要拿其他模块的实例，需要用 `get(Service, { strict: false })` 或通过其他模块的 ModuleRef 取。

```ts
import { ModuleRef } from '@nestjs/core';

@Module({...})
export class CccModule implements OnApplicationShutdown {
  constructor(private moduleRef: ModuleRef) {}

  onApplicationShutdown() {
    const cccService = this.moduleRef.get<CccService>(CccService);
    console.log(cccService.findAll());
  }
}
```

---

## 六、常见使用场景速查

| 钩子 | 常见用途 |
|------|----------|
| `onModuleInit` | 建立 DB/Redis/消息队列连接、加载配置 |
| `onApplicationBootstrap` | 启动定时任务、注册全局逻辑 |
| `onModuleDestroy` | 断开连接、取消订阅、清缓存 |
| `beforeApplicationShutdown` | 优雅关闭、根据 signal 做不同处理 |
| `onApplicationShutdown` | 最后打点、写日志、清理资源 |

---

## 七、小结

- **谁有生命周期**：Module、Controller、Provider 都可以实现同一套钩子。
- **顺序**：启动时按模块依赖顺序，先 `onModuleInit` 再 `onApplicationBootstrap`；关闭时固定为 `onModuleDestroy` → `beforeApplicationShutdown` → `onApplicationShutdown`。
- **怎么触发关闭**：调用 `app.close()`，或开启 `enableShutdownHooks()` 后让进程收到 SIGTERM/SIGINT。
- **ModuleRef**：在当前模块内按类获取 Provider 实例，常用于在 Module 的生命周期里调用 Service。

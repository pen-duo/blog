---
slug: nestjs-aop
title: NestJS AOP 架构
date: 2026-01-28
authors: default
tags: [NestJS, TypeScript, Node.js, 后端]
keywords: [NestJS, AOP, Middleware, Guard, Interceptor, Pipe, ExceptionFilter]
description: NestJS 里 AOP 是什么？请求链路中 Middleware、Guard、Interceptor、Pipe、ExceptionFilter 的执行顺序、职责与使用方式。
image: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# NestJS AOP 架构

**AOP（面向切面编程）** 把与业务无关的通用逻辑（日志、鉴权、参数校验等）从业务代码里抽出来，在请求的固定阶段统一执行。NestJS 的 **Middleware、Guard、Interceptor、Pipe、ExceptionFilter** 就是这套思想的具体实现。下面先说明 AOP 是什么，再给出请求链路顺序、各组件的职责与用法，最后用表格做速查。

<!-- truncate -->

---

## 一、AOP 是什么？

**AOP（Aspect-Oriented Programming，面向切面编程）** 是一种编程思想：把与「业务逻辑」无关的通用逻辑（如日志、鉴权、计时、参数校验、异常格式化）从业务代码里抽出来，单独写成「**切面**」，在请求的某个阶段统一执行。

- **好处**：业务代码只关心「做什么」，通用逻辑集中维护、可复用、易测试。
- **在 NestJS 里**：Middleware、Guard、Interceptor、Pipe、ExceptionFilter 都是 AOP 的体现，它们在不同阶段介入请求，各管一类横切关注点。

---

## 二、请求链路骨架（执行顺序）

一个请求从进来到返回，大致经过下面的顺序（由外到内再往外）：

```
请求进入
    ↓
① Middleware（中间件）
    ↓
② Guard（守卫）
    ↓
③ Interceptor（拦截器）before
    ↓
④ Pipe（管道）— 校验/转换参数
    ↓
⑤ Controller 方法（业务逻辑）
    ↓
⑥ Interceptor（拦截器）after / 响应转换
    ↓
⑦ 若抛异常 → ExceptionFilter（异常过滤器）
    ↓
响应返回
```

可以简单记：**Middleware → Guard → Interceptor → Pipe → 业务 → Interceptor 收尾 →（有异常则）ExceptionFilter**。

---

## 三、各组件的职责与使用方式

### 1. Middleware（中间件）

- **是什么**：在「进入路由之前」对请求/响应做处理的函数，可访问 `req`、`res`、`next`。
- **执行时机**：最早，在 Guard 之前；且是 Node/Express 层概念，不区分具体是哪个 Controller 或哪个 Handler。
- **如何应用**：
  - 在某个模块里实现 `NestModule`，在 `configure(consumer: MiddlewareConsumer)` 里用 `consumer.apply(LogMiddleware).forRoutes('aaa*')` 绑定到满足条件的路由。
  - 不能直接注入 Nest 的 Provider（需通过 `req` 或把 Middleware 包在带 Module 的模块里用 `Inject` 等方式间接用）。
- **适用场景**：日志、请求 ID、CORS、body 解析、和「路径/前缀」相关的通用预处理（例如给 `/api/*` 打日志）。

**项目中的用法**：对 `aaa*` 路由打 before2 / after2 日志。

### 2. Guard（守卫）

- **是什么**：根据当前请求的上下文（如用户、角色、Token）判断「是否允许继续」；返回 `true` 放行，`false` 抛 403。
- **执行时机**：在 Middleware 之后、Interceptor 和 Pipe 之前；若 `canActivate` 为 `false`，后续的 Interceptor、Pipe、Controller 都不会执行。
- **如何应用**：
  - **全局**：在 AppModule 的 `providers` 里 `{ provide: APP_GUARD, useClass: LoginGuard }`。
  - **控制器/方法级**：在 Controller 或方法上 `@UseGuards(LoginGuard)`。
- **适用场景**：登录态校验、权限/角色校验、接口是否对外开放等。

**项目中的用法**：LoginGuard 在 aaa 接口上做登录检查（当前写死 `return false` 会拦掉请求）。

**全局 Guard 的两种注册方式**

全局 Guard 可以有两种写法，区别在于「谁创建实例、能不能用依赖注入」：

| 对比项 | 方式 1：`app.useGlobalGuards(new LoginGuard())`（main.ts） | 方式 2：`APP_GUARD` + `useClass: LoginGuard`（app.module.ts） |
|--------|------------------------------------------------------------|----------------------------------------------------------------|
| 创建方式 | 自己在 `main` 里 `new LoginGuard()`，**不经过 Nest 的 DI 容器** | 由 Nest 按 provider 创建实例，**走完整 DI 流程** |
| 依赖注入 | Guard 构造函数里**不能**通过 `@Injectable()` 注入其他服务，否则要自己传或拿不到 | 可以在 LoginGuard 构造函数里**注入任意 provider**（如 ConfigService、其他 Service），Nest 会自动注入 |
| 适用场景 | Guard 无依赖、或只做简单判断时可以用 | Guard 需要依赖其他服务、配置、数据库等时，用这种方式 |
| 注册时机 | 在 `bootstrap()` 里、应用创建之后立刻注册 | 在模块初始化时注册，和别的 provider 一起解析依赖 |

**对比小结**：需要依赖注入（例如 Guard 里要用别的 Service）→ 用 **APP_GUARD + useClass**。无依赖、简单逻辑 → 两种都行，但 APP_GUARD 更符合 Nest 的写法，也方便以后在 Guard 里加依赖。**若两种都写，同一个 Guard 会注册两次，请求时就会跑两遍**，所以只保留一种即可。

**通俗理解：providers 和 DI 的关系**

你理解得对，可以概括成两句话：

- **凡是在 `providers` 里注册的类（包括 `APP_GUARD`、`APP_PIPE` 等用的 `useClass: XxxGuard`），都会由 Nest 的 DI 容器来创建实例**，创建时会解析构造函数里的依赖，自动注入该模块能拿到的其他 provider。
- **「能拿到」的前提是：要么在同一个模块的 `providers` 里，要么在其它模块的 `exports` 里且当前模块已经 `imports` 了那个模块**。所以只要模块之间通过 `imports` / `exports` 建立好关系，Guard、Pipe、Interceptor 等都可以在构造函数里注入任意「已导出」的服务，互相引用。

因此：用 **APP_GUARD + useClass** 注册的 Guard，和普通 Service 一样会进 DI，可以放心在 Guard 里写 `constructor(private config: ConfigService)` 等，Nest 会自动注入；用 `main.ts` 里 `useGlobalGuards(new LoginGuard())` 时，Guard 是自己在外面 new 的，不经过 DI，就没办法自动注入其他服务。

### 3. Interceptor（拦截器）

- **是什么**：在「调用 Controller 方法前后」插入逻辑，可修改请求/响应、记录耗时、统一包装返回结构等；基于 RxJS，可写 `next.handle().pipe(...)`。
- **执行时机**：Guard 之后、Pipe 和 Controller 之前执行「before」；Controller 返回后、在响应发出前执行「after」。
- **如何应用**：
  - **全局**：`{ provide: APP_INTERCEPTOR, useClass: TimeInterceptor }`。
  - **控制器/方法级**：`@UseInterceptors(TimeInterceptor)`。
- **适用场景**：接口耗时统计、统一响应格式（如 `{ code, data, message }`）、缓存、日志、超时处理。

**项目中的用法**：TimeInterceptor 在 `next.handle()` 前后计时并打印。

### 4. Pipe（管道）

- **是什么**：只负责「对进入 Controller 的某个参数」做转换或校验；输入原始值，输出转换后的值，校验失败可抛异常（由 ExceptionFilter 处理）。
- **执行时机**：在 Interceptor 的「before」之后、真正执行 Controller 方法之前；只针对绑定了该 Pipe 的参数（或路由）。
- **如何应用**：
  - **全局**：`{ provide: APP_PIPE, useClass: ValidatePipe }`，会对所有满足 Pipe 使用条件的参数生效。
  - **控制器级**：`@UsePipes(ValidatePipe)`，对该 Controller 下所有参数生效。
  - **方法/参数级**：`@Query('num', ValidatePipe) num: number`，只对该参数生效。
- **适用场景**：参数类型转换（string→number）、校验（格式、范围）、默认值、清洗输入。

**项目中的用法**：ValidatePipe 对 `num` 做数字校验与转换（×10），非法时抛 `BadRequestException`。

### 5. ExceptionFilter（异常过滤器）

- **是什么**：捕获在 Guard、Interceptor、Pipe、Controller 中抛出的异常，转换成对客户端的 HTTP 响应（状态码、body 格式）。
- **执行时机**：不占「正常顺序」，只在有异常抛出时触发；可指定只捕获某类异常（如 `@Catch(BadRequestException)`）。
- **如何应用**：
  - **全局**：`{ provide: APP_FILTER, useClass: TestFilter }`。
  - **控制器/方法级**：`@UseFilters(TestFilter)`。
- **适用场景**：统一错误码、错误文案、日志上报、区分开发/生产环境的不同错误格式。

**项目中的用法**：TestFilter 只捕获 `BadRequestException`，返回 400 和 `test: ${message}` 的 JSON。

---

## 四、应用方式小结

| 组件 | 全局注册方式 | 控制器/方法级 |
|------|--------------|---------------|
| Middleware | 无「全局」token，需在模块 `configure` 里按路由绑定 | `consumer.apply(Middleware).forRoutes(...)` |
| Guard | `APP_GUARD` | `@UseGuards(Guard)` |
| Interceptor | `APP_INTERCEPTOR` | `@UseInterceptors(Interceptor)` |
| Pipe | `APP_PIPE` | `@UsePipes(Pipe)`、`@Param/Query/Body('key', Pipe)` |
| ExceptionFilter | `APP_FILTER` | `@UseFilters(Filter)` |

全局注册在 **AppModule** 的 `providers` 里写即可；控制器/方法级用装饰器，粒度更细。

---

## 五、场景速查

| 需求 | 更合适的组件 |
|------|--------------|
| 按路径/前缀做日志、限流、请求 ID | Middleware |
| 登录/权限判断，不放行就 403 | Guard |
| 统一响应格式、耗时、缓存、日志 | Interceptor |
| 参数校验、类型转换、默认值 | Pipe |
| 统一错误响应格式、错误码、错误日志 | ExceptionFilter |


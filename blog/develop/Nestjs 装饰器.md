---
slug: nestjs-decorators
title: NestJS 装饰器速查——作用与使用场景
date: 2026-01-28
authors: default
tags: [NestJS, TypeScript, Node.js, 后端]
keywords: [NestJS, 装饰器, 依赖注入, 路由, 参数]
description: 用通俗方式整理 NestJS 常用装饰器的作用与场景：模块与类声明、依赖注入、路由与取参、AOP、控制响应。
image: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# NestJS 装饰器速查——作用与使用场景

在 NestJS 里，**装饰器**就是给类、方法、参数「贴标签」：告诉框架这个类是模块还是控制器、这个方法处理哪种 HTTP 请求、这个参数从哪拿值。下面按**模块与类声明 → 依赖注入 → 路由与取参 → AOP 与元数据 → 控制响应**分块整理，每类说明**作用**和**典型场景**，方便查阅。

<!-- truncate -->

---

## 一、模块与类声明：告诉 Nest「这是什么」

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@Module()** | 声明这是一个 **Nest 模块**，在装饰器里配置 `controllers`、`providers`、`imports`、`exports` 等 | 每个功能一块（如 `UserModule`、`OrderModule`），在根模块里 `imports` 进来 |
| **@Controller()** | 声明这是模块里的**控制器**，可传路径前缀如 `@Controller('user')` | 处理 HTTP 请求的类，里面用 `@Get()`、`@Post()` 等定义接口 |
| **@Injectable()** | 声明这个类可以被 **DI 容器**创建、并注入到别的类里（即作为 provider） | Service、Guard、Pipe、Interceptor 等，凡是要被 `constructor` 注入的都要加 |
| **@Global()** | 声明这是**全局模块**，其 `exports` 的 provider 在整个应用里都可注入，不用在每个模块里 `imports` | 配置模块、数据库模块等「到处都要用」的模块 |

---

## 二、依赖注入：控制「注入谁、是否必填」

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@Inject(token)** | 用 **token** 明确指定要注入的 provider，token 可以是类或字符串 | 同一个接口有多个实现时要指定注入哪一个；或注入字符串/符号 token 的 provider |
| **@Optional()** | 声明这个依赖是**可选的**，没有对应 provider 时注入 `undefined`，不报错 | 某些配置或服务可能不存在，没有时逻辑走默认分支 |

---

## 三、路由与 HTTP 方法：声明「哪个路径、哪种请求」

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@Get()**、**@Post()**、**@Put()**、**@Delete()**、**@Patch()**、**@Options()**、**@Head()** | 声明该方法处理对应的 **HTTP 方法**，可传路径如 `@Get(':id')` | 定义 REST 接口：查用 Get、增用 Post、改用 Put、删用 Delete 等 |

路径可以写在方法上，如 `@Get('list')`，最终路径 = 控制器前缀 + 方法路径（如 `@Controller('user')` + `@Get('list')` → `/user/list`）。

---

## 四、取请求里的数据：参数从哪来

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@Param(key?)** | 取 **URL 路径参数**，如 `/user/:id` 里的 `id` | `@Param('id') id: string`，路径里带动态片段时用 |
| **@Query(key?)** | 取 **查询参数**，如 `/user?name=xx` 里的 `name` | `@Query('name') name: string` 或 `@Query() query: Record<string, string>` |
| **@Body()** | 取 **请求体**，一般用 DTO class 接收，做校验和类型约束 | `@Body() dto: CreateUserDto`，Post/Put 的 JSON 或表单 |
| **@Headers(key?)** | 取 **请求头**里某个字段或全部 | 取 `Authorization`、`User-Agent` 或做简单网关/审计 |
| **@Session()** | 取 **session 对象**（需配合 express-session 等中间件） | 传统 session 登录态、多步表单暂存等 |
| **@HostParam(key?)** | 取 **host 里的参数**（子域名等） | 多租户按子域名区分时用，相对少见 |
| **@Req()** / **@Request()** | 注入原生 **request 对象** | 需要拿到完整 req（如流、原始 body）时用，一般优先用上面几个专用装饰器 |
| **@Res()** / **@Response()** | 注入原生 **response 对象** | 需要自己调 `res.send()`、`res.json()` 时用；**注意**：一旦用了，Nest 默认不再把返回值当响应，除非用 `@Res({ passthrough: true })` |
| **@Next()** | 注入调用**下一个 handler** 的 `next` 方法 | 多个 handler 串起来、或与中间件风格混用时用，一般较少 |

---

## 五、AOP 与元数据：Guard / Pipe / Filter / Interceptor / 自定义 metadata

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@UseGuards(Guard)** | 在控制器或方法上使用**守卫**（鉴权、权限） | 某个接口要登录才访问：`@UseGuards(LoginGuard)` |
| **@UseFilters(Filter)** | 在控制器或方法上使用**异常过滤器** | 某几个接口想用自定义错误格式：`@UseFilters(MyExceptionFilter)` |
| **@UsePipes(Pipe)** | 在控制器或方法上使用**管道**（校验、转换参数） | 对某类接口统一做 DTO 校验或参数转换 |
| **@UseInterceptors(Interceptor)** | 在控制器或方法上使用**拦截器**（日志、包装响应等） | 对某类接口统一计时、改返回结构 |
| **@Catch(Exception)** | 声明该 **ExceptionFilter** 只处理哪一类异常 | `@Catch(HttpException)` 只处理 HTTP 异常，其它异常交给别的 Filter |
| **@SetMetadata(key, value)** | 在类或方法上**挂自定义元数据**，供 Guard 等读取 | 角色权限：`@SetMetadata('roles', ['admin'])`，Guard 里用 `Reflector` 读 |

---

## 六、控制响应：状态码、头、重定向、模板

| 装饰器 | 作用 | 典型场景 |
|--------|------|----------|
| **@HttpCode(code)** | 指定本次响应的 **HTTP 状态码** | 如 Post 成功默认 201，想改成 200：`@HttpCode(200)` |
| **@Header(name, value)** | 设置**响应头**里某个字段 | `@Header('Cache-Control', 'no-cache')`、自定义头等 |
| **@Redirect(url, statusCode?)** | 做 **HTTP 重定向** | 登录后跳转、旧 URL 迁到新地址 |
| **@Render(template)** | 指定用**服务端模板**渲染视图（需配视图引擎） | 传统服务端渲染页面，返回 HTML |

---

## 小结

- **模块与类**：`@Module`、`@Controller`、`@Injectable`、`@Global` 告诉 Nest 这是什么、怎么组织。
- **依赖注入**：`@Inject`、`@Optional` 控制「注入谁、是否必填」。
- **路由与取参**：`@Get`/`@Post` 等定路径和方法；`@Param`、`@Query`、`@Body`、`@Headers`、`@Req`/`@Res` 从请求里拿数据。
- **AOP**：`@UseGuards`、`@UseFilters`、`@UsePipes`、`@UseInterceptors`、`@Catch`、`@SetMetadata` 做鉴权、异常、参数处理和自定义元数据。
- **响应**：`@HttpCode`、`@Header`、`@Redirect`、`@Render` 控制状态码、头和重定向、模板。

用的时候先想「这是声明类、注入依赖、取参数、挂 AOP 还是改响应」，再对到上面对应块里的装饰器即可。

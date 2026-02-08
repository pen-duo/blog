---
slug: learn-nest-1
title: Nestjs快速上手系列一
date: 2026-02-08
authors: default
tags: [NestJS, TypeScript, Node.js, 后端]
keywords: [NestJS, CLI, IoC, DI, 装饰器]
description: NestJS 快速上手：CLI 常用命令、IoC/DI 思想与 TypeScript 装饰器入门。
image: https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80
---

本系列介绍 NestJS 入门必备：CLI 常用命令、IoC/DI 思想，以及 TypeScript 装饰器在 Nest 中的用法。

<!-- truncate -->

## 📝 概述

本文包含三部分：**Nest CLI 常用命令**（新建项目、生成模块/控制器/服务等）、**IoC 与 DI**（控制反转与依赖注入的概念与代码示例）、**装饰器**（方法/类/属性装饰器及在 Nest 中的对应关系）。掌握这些后，可以更顺畅地阅读和编写 Nest 代码。

---

## 💻 一、Nest CLI 常用命令

### 项目相关

| 命令 | 说明 |
| --- | --- |
| `nest new 项目名` | 新建项目 |
| `nest start` | 启动（开发模式，默认） |
| `nest start --watch` | 监听文件变化并自动重启 |
| `nest build` | 构建生产包 |

### 生成代码（最常用）

| 命令 | 说明 |
| --- | --- |
| `nest g resource 名称` | 生成完整 CRUD 模块（controller + service + module + dto） |
| `nest g module 名称` | 生成模块 |
| `nest g controller 名称` | 生成控制器 |
| `nest g service 名称` | 生成服务 |

示例：

```bash
nest g resource user          # 生成 user 模块，会问是否要 CRUD
nest g resource post --no-spec # 不生成测试文件
nest g module auth
nest g controller auth
nest g service auth
```bash

### 其他

| 命令 | 说明 |
| --- | --- |
| `nest g guard 名称` | 守卫 |
| `nest g pipe 名称` | 管道 |
| `nest g middleware 名称` | 中间件 |
| `nest info` | 查看 Nest 与依赖版本 |

---

## 二、IoC（控制反转）与 DI（依赖注入）

IoC 与 DI 本质是一体两面：**IoC 是一种思想**（控制权交给容器），**DI 是 IoC 的一种具体实现**（通过注入依赖）。

一句话：**DI 的作用是把依赖的创建和保管交给「容器」统一维护，从而让类与依赖解耦。**

### 没有 DI：自己创建依赖（紧耦合）

```typescript
// B 自己 new 了 A 和 C → 强依赖具体实现，难测试、难替换
class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class C {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class B_WithoutDI {
  a: A;
  c: C;
  constructor() {
    this.a = new A('1'); // 控制权在 B 内部
    this.c = new C('2');
  }
}
```bash

### 有 DI：依赖由外部注入（解耦）

```typescript
// 「容器」负责创建和保管实例，需要时再取出来 → 控制权在容器 = IoC
class Container {
  modules: Record<string, unknown>;

  constructor() {
    this.modules = {};
  }

  provide(key: string, instance: unknown) {
    this.modules[key] = instance;
  }

  get<T = unknown>(key: string): T {
    return this.modules[key] as T;
  }
}

// B 不再 new A/C，只声明「我需要 a 和 c」，由容器注入 → 这就是 DI
class B_WithDI {
  a: A;
  c: C;
  constructor(container: Container) {
    this.a = container.get<A>('a'); // 依赖从外部注入
    this.c = container.get<C>('c');
  }
}
```bash

**小结：**

- **DI 的好处**：解耦、易测、易扩展、职责更清晰。
- **前端类比**：不自己造依赖、也不靠一层层 props 传，而是像 Context / provide-inject 那样「声明需要什么，由外层/容器提供」；Nest 的 DI 是同一思想在后端：容器负责创建和注入，你只在构造函数里「声明要什么」。

---

## 三、装饰器

**装饰器（Decorator）** 是一个函数，用来「标注」类、方法、属性或参数，在**类定义时**执行，用于改变类或成员的行为。在 TypeScript 中有四种：**类装饰器、方法装饰器、属性装饰器、参数装饰器**。

### 方法装饰器（MethodDecorator）

签名：`(target, key, descriptor) => void | PropertyDescriptor`

- `target`：类的原型（实例方法）或构造函数（静态方法）
- `key`：方法名（string | symbol）
- `descriptor`：该方法的属性描述符（value、writable、enumerable 等）

```typescript
const currency: MethodDecorator = (
  target: object,
  key: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log('target（原型）:', target);
  console.log('key（方法名）:', key);
  console.log('descriptor（描述符）:', descriptor);
  return descriptor;
};

class Dog {
  public name: string;
  constructor() {
    this.name = '';
  }

  @currency
  getName(name: string, age: number): string {
    return `${this.name}-${name}-${age}`;
  }
}

const x = new Dog();
x.getName('a', 1);
```bash

### 方法装饰器常见用法：包装原方法

```typescript
function log(
  _target: object,
  key: string | symbol,
  descriptor: PropertyDescriptor,
): void {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    console.log(`调用 ${String(key)}`, args);
    return original.apply(this, args) as unknown;
  };
}

class Service {
  @log
  greet(msg: string) {
    return `Hello, ${msg}`;
  }
}

const s = new Service();
s.greet('Nest'); // 控制台: 调用 greet ['Nest']，返回值: 'Hello, Nest'
```bash

### 类装饰器（ClassDecorator）

参数只有一个：`target` 是构造函数本身。

```typescript
function Component(constructor: new (...args: unknown[]) => object) {
  console.log('类装饰器:', constructor.name);
}

@Component
class App {}
```bash

### 属性装饰器（PropertyDecorator）

参数：`(target 原型, key 属性名)`，没有 descriptor（需配合 reflect-metadata 等做更多事）。

```typescript
function Default(value: string) {
  return (target: object, key: string | symbol) => {
    (target as Record<string | symbol, string>)[key] = value;
  };
}

class Config {
  @Default('dev')
  env!: string;
}
```bash

### 和 Nest 的对应关系

Nest 里大量用装饰器做「声明式」配置，例如：

| 装饰器 | 类型 | 作用 |
| --- | --- | --- |
| `@Controller('user')` | 类装饰器 | 标记为控制器并指定路由前缀 |
| `@Get()` | 方法装饰器 | 标记为 GET 且绑定到对应路径 |
| `@Injectable()` | 类装饰器 | 标记可被 DI 注入 |
| `@Body()` / `@Query()` | 参数装饰器 | 标记参数从哪来（body/query） |

---

## 🎯 🎯 总结

- **Nest CLI**：`nest g resource/module/controller/service` 等可快速生成骨架代码。
- **IoC/DI**：把依赖的创建与保管交给容器，类只声明「需要什么」，实现解耦与易测。
- **装饰器**：TS 的类/方法/属性/参数装饰器在 Nest 中对应 `@Controller`、`@Get`、`@Injectable`、`@Body` 等，用于声明式配置。
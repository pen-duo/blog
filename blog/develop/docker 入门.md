---
slug: docker-common-commands
title: Docker 入门与常用命令：从为什么出现到真正上手
date: 2026-03-22
authors: default
tags: [Docker, 容器, 运维, 开发工具]
keywords: [docker, 容器, 镜像, image, container, dockerfile, 常用命令]
description: 参考 Docker 入门思路，系统整理 Docker 为什么会出现、解决了什么问题、核心概念有哪些，以及开发中最常用的 Docker 命令。
image: https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80
---

# Docker 入门与常用命令：从为什么出现到真正上手

很多人第一次接触 Docker，都会先记一堆命令：

- `docker pull`
- `docker run`
- `docker ps`
- `docker exec`

但如果你不知道 Docker 为什么会出现，这些命令很容易记了又忘。

所以这篇文章不只是整理命令，而是想先把最核心的问题讲清楚：

- Docker 是为了解决什么问题出现的？
- 它和虚拟机有什么区别？
- `image`、`container`、`Dockerfile` 分别是什么？
- 日常开发里最常用的命令有哪些？

如果你把这几个问题理解了，后面的命令就不再是死记硬背。

<!-- truncate -->

---

## 一、Docker 为什么会出现？

Docker 出现之前，软件开发里有一个非常经典、也非常头疼的问题：

**环境不一致。**

你在自己电脑上把项目跑起来了，但换到另一台机器，可能马上就报错。

最常见的场景就是：

- Node.js 版本不一样
- Python 版本不一样
- 系统库不一样
- 环境变量不一样
- 某些依赖在你机器上有，在别人机器上没有

于是开发里就常常会出现那句非常著名的话：

**“在我机器上是好的。”**

这句话翻译一下，其实就是：

**项目不是不能跑，而是它依赖的环境太难复制。**

所以 Docker 出现的根本背景，不是“大家想学个新工具”，而是：

**大家想把应用运行所需的环境，也一起打包带走。**

---

## 二、在 Docker 之前，为什么虚拟机不够好？

为了解决环境问题，最早大家常想到的方案是虚拟机。

虚拟机的思路是：

**直接在当前操作系统里，再跑一个完整的操作系统。**

比如：

- 在 macOS 里跑 Linux
- 在 Windows 里跑 Ubuntu

这样当然能解决环境问题，因为整个系统都被一起带过去了。

但虚拟机有几个明显缺点：

### 1. 太重

虚拟机里面是完整操作系统，所以会占用比较多的：

- 内存
- 磁盘
- CPU

哪怕你只是想跑一个很小的服务，也得先背一整个系统。

### 2. 启动慢

虚拟机启动，本质上是启动一个完整操作系统，所以速度通常不会太快。

### 3. 冗余多

很多时候你真正想运行的只是一个应用进程，但虚拟机给你的是整套系统级环境。

这就有点像：

- 你只是想煮一碗面
- 结果别人直接送你一整套厨房

所以后来大家就开始追求一种更轻量的方式。

---

## 三、Docker 到底是什么？

先说最通俗的理解：

**Docker 是一种更轻量的“带环境运行应用”的方式。**

它底层基于 Linux 容器技术，但对开发者来说，你可以先把它理解成：

**把应用和它依赖的环境一起打包，然后在任何支持 Docker 的机器上用同样的方式运行。**

也就是说，Docker 的核心目标是：

- 让环境更一致
- 让部署更简单
- 让应用更容易复制、迁移和发布

所以很多人会说：

**Docker 的价值，不是“让程序能跑”，而是“让程序在哪都能更稳定地跑”。**

---

## 四、Docker 解决了什么问题？

把它说得再直接一点，Docker 主要解决的是这几类问题。

### 1. 环境不一致

这是最核心的问题。

开发、测试、预发、生产，如果环境不一致，就很容易出现：

- 本地可以跑
- 测试环境不行
- 线上又出别的问题

Docker 通过镜像把运行环境固定下来，让这件事更可控。

### 2. 部署麻烦

以前部署一个应用，可能要做很多事：

- 安装运行时
- 安装依赖
- 配置环境变量
- 配置服务
- 处理版本兼容

有了 Docker 后，很多场景可以变成：

1. 拉镜像
2. 启动容器

部署心智会简单很多。

### 3. 迁移成本高

一个项目从开发机迁到测试机、再迁到生产机，过程里最怕的就是“环境差异导致结果不同”。

Docker 把环境和应用一起交付，所以迁移成本更低。

### 4. 微服务和隔离运行

如果一台机器上要跑多个服务，Docker 也很有优势：

- 每个服务一个容器
- 互相隔离
- 启停方便
- 适合扩容缩容

这也是它为什么在云原生和微服务里这么常见。

---

## 五、Docker 和虚拟机到底有什么区别？

这是新手最常问的问题之一。

你可以先记这个版本：

- **虚拟机**：模拟一整台机器，里面跑完整操作系统
- **Docker 容器**：不是模拟整台机器，而是隔离应用进程

所以两者的区别通常体现在：

| 维度 | 虚拟机 | Docker |
| --- | --- | --- |
| 隔离对象 | 完整操作系统 | 应用进程 |
| 启动速度 | 较慢 | 很快 |
| 资源占用 | 较高 | 较低 |
| 体积 | 较大 | 较小 |
| 适合场景 | 需要完整 OS 隔离 | 应用打包、部署、微服务 |

你可以把它理解成：

- 虚拟机更像“再搬来一整套房子”
- Docker 更像“在同一栋楼里隔出一个独立房间”

---

## 六、Docker 里最核心的几个概念

学 Docker，最重要的不是先记命令，而是先把下面几个概念分清楚。

### 1. Image：镜像文件

`image` 可以理解成：

**一个用来创建容器的模板。**

它里面通常包含：

- 应用代码
- 运行时环境
- 系统依赖
- 启动配置

比如一个 Node.js 项目的镜像，里面可能已经包含：

- Linux 基础环境
- Node.js
- 项目源码
- npm 依赖

所以镜像不是“正在运行的程序”，而更像是：

**一个可复制、可分发的运行快照。**

同一个镜像，可以启动多个容器。

### 2. Container：容器

`container` 可以理解成：

**镜像运行之后的实例。**

也就是说：

- `image` 是模板
- `container` 是模板跑起来后的实际对象

类比一下更好理解：

- 镜像像“类”
- 容器像“对象实例”

同一个镜像可以创建多个容器，它们彼此独立运行。

### 3. Dockerfile：镜像说明书

如果你想自己制作镜像，就需要 `Dockerfile`。

它本质上是一个文本文件，用来描述：

- 这个镜像基于什么基础镜像
- 要拷贝哪些文件
- 要执行哪些安装命令
- 容器启动后默认运行什么命令

比如一个很常见的 `Dockerfile`：

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

这段配置的意思就是：

- 基于 `node:20` 这个镜像
- 工作目录设为 `/app`
- 把当前目录文件复制进去
- 安装依赖
- 暴露 3000 端口
- 容器启动后执行 `npm start`

### 4. Docker Hub：镜像仓库

镜像做好以后，可以上传到仓库。

最常见的是 [Docker Hub](https://hub.docker.com/)。

你可以把它理解成 Docker 世界里的“npm / GitHub Releases”。

常见操作就是：

- 从仓库拉镜像
- 把自己的镜像推上去

---

## 七、Docker 的基本工作流程

如果用最简单的流程来理解 Docker，大概就是：

1. 写好 `Dockerfile`
2. 构建出 `image`
3. 用 `image` 运行 `container`
4. 容器里启动应用

所以链路其实很清楚：

```text
Dockerfile -> Image -> Container
```

这也是为什么很多命令都围绕这三件事展开：

- 管理镜像
- 管理容器
- 构建镜像

---

## 八、先安装 Docker

如果你是 macOS 用户，最简单的方式通常是安装 Docker Desktop。

### 1. 下载 Docker Desktop

- 打开 [Docker 官网](https://www.docker.com/products/docker-desktop)
- 下载适用于 macOS 的 Docker Desktop

### 2. 安装

安装方式和普通 macOS 应用差不多：

- 打开下载的 `.dmg`
- 将 Docker 拖到 `Applications`

### 3. 启动 Docker

可以直接从应用列表打开，也可以用命令：

```bash
open /Applications/Docker.app
```

### 4. 验证安装

```bash
docker version
docker info
```

如果能正常输出版本和系统信息，说明 Docker 基本已经装好了。

---

## 九、新手最该掌握的 Docker 核心命令

下面这部分，我按“日常使用频率”来整理。

## 1. 查看帮助和环境信息

```bash
docker version
docker info
docker --help
docker <命令> --help
```

这几个命令适合在你不确定当前 Docker 状态时先看一眼。

## 2. 镜像相关命令

### 查看本地镜像

```bash
docker image ls
```

常见简写也可以用：

```bash
docker images
```

常用参数：

```bash
docker image ls -a
docker image ls -q
```

### 搜索镜像

```bash
docker search nginx
docker search mysql --filter=STARS=3000
```

### 拉取镜像

```bash
docker image pull nginx
docker image pull mysql:8.0
```

很多时候也会直接简写成：

```bash
docker pull nginx
```

### 删除镜像

```bash
docker image rm 镜像ID
docker image rm nginx:latest
docker image rm -f 镜像ID
```

## 3. 容器相关命令

### 运行容器

这是最重要的命令之一：

```bash
docker container run 镜像名
```

常见写法：

```bash
docker run hello-world
docker run -it ubuntu bash
docker run -d -p 80:80 --name my-nginx nginx
docker run --rm -it ubuntu:22.04 bash
```

常用参数一定要记住：

| 参数 | 作用 | 常见场景 |
| --- | --- | --- |
| `-it` | 交互式进入容器 | 调试、进入 shell |
| `-d` | 后台运行 | 跑服务 |
| `--name` | 指定容器名 | 方便管理 |
| `-p 主机端口:容器端口` | 端口映射 | 对外暴露服务 |
| `-v` | 挂载数据卷 | 持久化数据 |
| `--rm` | 容器退出后自动删除 | 临时调试 |

### 查看容器

```bash
docker container ls
docker container ls --all
```

常见简写：

```bash
docker ps
docker ps -a
docker ps -q
docker ps -n 2
```

### 启动、停止、重启容器

```bash
docker container start 容器ID
docker container stop 容器ID
docker container restart 容器ID
docker container kill 容器ID
```

简单理解：

- `stop`：尽量优雅停止
- `kill`：强制立即停止

### 删除容器

```bash
docker container rm 容器ID
docker container rm -f 容器ID
```

批量删除：

```bash
docker rm $(docker ps -aq)
docker rm -f $(docker ps -aq)
```

## 4. 查看日志和容器信息

### 查看日志

```bash
docker logs 容器ID
docker logs -f 容器ID
docker logs --tail 50 容器ID
docker logs -t 容器ID
```

### 查看详细信息

```bash
docker top 容器ID
docker inspect 容器ID
docker stats 容器ID
```

这些命令很适合排查：

- 容器到底有没有启动
- 容器里跑了哪些进程
- 资源占用高不高
- 配置是否符合预期

## 5. 进入正在运行的容器

最推荐的方式是：

```bash
docker exec -it 容器ID /bin/bash
```

如果容器里没有 bash，也可以试：

```bash
docker exec -it 容器ID /bin/sh
```

另一个命令是：

```bash
docker attach 容器ID
```

两者区别可以简单记成：

- `docker exec`：开启一个新的终端，更常用
- `docker attach`：连接到当前主进程所在终端，容易互相影响

## 6. 文件复制

### 从容器复制到主机

```bash
docker cp 容器ID:/path/to/file .
```

### 从主机复制到容器

```bash
docker cp ./local.txt 容器ID:/app/local.txt
```

这个命令在临时排查问题时非常好用。

---

## 十、先用一个最简单的例子：hello-world

第一次接触 Docker，最适合先跑这个：

```bash
docker run hello-world
```

这个命令会做几件事：

1. 如果本地没有 `hello-world` 镜像，就先自动拉取
2. 基于这个镜像创建容器
3. 运行容器
4. 输出一段欢迎信息
5. 容器结束退出

这个例子最适合用来理解：

**镜像不是程序本身，镜像运行后才会变成容器。**

---

## 十一、学 Docker 一定要会 Dockerfile

如果只会 `docker run nginx`，那你只是会“用别人的镜像”。

真正进入日常开发，最重要的是：

**把你自己的项目做成镜像。**

这就离不开 `Dockerfile`。

### 一个最常见的 Node.js 示例

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

### 对应的构建命令

```bash
docker image build -t my-app .
```

也可以带版本号：

```bash
docker image build -t my-app:1.0.0 .
```

### 运行这个镜像

```bash
docker run -p 3000:3000 --name my-app-container my-app
```

所以最常见的一套动作就是：

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## 十二、`RUN` 和 `CMD` 有什么区别？

这是 Dockerfile 里最容易混淆的一组概念。

你可以这样记：

- `RUN`：**构建镜像时执行**
- `CMD`：**启动容器时执行**

例如：

```dockerfile
RUN npm install
CMD ["npm", "start"]
```

含义就是：

- 构建镜像时先安装依赖
- 容器启动后再运行应用

所以：

- `RUN` 更像“制作镜像过程中的步骤”
- `CMD` 更像“容器启动后的默认命令”

---

## 十三、一些非常实用的组合命令

下面这些在日常清理和排查里非常常见。

### 停止并删除所有容器

```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

### 清理未使用镜像

```bash
docker image prune -a
```

### 清理系统垃圾

```bash
docker system prune -a
```

### 限制容器资源

```bash
docker run -d --memory="500m" --cpus="1.0" nginx
docker run -d --memory="500m" --memory-swap="1g" nginx
```

---

## 十四、新手最容易踩的几个坑

### 1. 容器为什么一启动就退出？

因为 Docker 容器必须有前台进程在运行。

如果主进程结束，容器就结束。

比如这条命令：

```bash
docker run -d centos
```

很多情况下容器会立刻退出，因为它没有持续运行的前台任务。

### 2. 为什么访问不到服务？

通常先检查这几件事：

- 容器内服务是否真的启动了
- 是否做了端口映射
- 映射端口是否写反了
- 服务是否监听在正确地址

最常见的端口映射写法是：

```bash
docker run -p 8080:80 nginx
```

意思是：

- 主机访问 `8080`
- 转发到容器里的 `80`

### 3. 为什么改了代码，容器里没变化？

因为镜像不是自动更新的。

如果你改了源码，通常需要：

1. 重新构建镜像
2. 重新运行容器

或者直接通过挂载卷的方式在开发时同步代码。

---

## 十五、如果你只想先记住 Docker，记这几句话就够了

可以把 Docker 先理解成这样：

- **Docker 解决的是环境一致性问题**
- **Image 是模板，Container 是运行中的实例**
- **Dockerfile 是制作镜像的说明书**
- **最常用的命令就是 `pull`、`build`、`run`、`ps`、`logs`、`exec`**

如果再压缩成一条主线：

```text
写 Dockerfile -> build 成 image -> run 成 container
```

你只要把这条线记住，Docker 的学习就不会乱。

---

## 总结

Docker 真正重要的地方，不是让你多学了一堆命令，而是它改变了软件交付方式：

- 从“把代码给别人”变成“把运行环境和代码一起给别人”
- 从“这台机器能跑”变成“换台机器也尽量能跑”
- 从“手工部署一堆依赖”变成“通过镜像统一交付”

所以如果你是前端、后端、测试、运维，只要开始接触本地环境、部署、微服务或 CI/CD，Docker 基本都会变成绕不过去的工具。

如果后续你还想继续深入，一个很自然的学习顺序是：

1. 先熟悉本文这些核心命令
2. 再学 `Dockerfile`
3. 再学 `Docker Compose`
4. 最后再看容器编排和云原生相关内容
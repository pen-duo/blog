---
slug: docker-common-commands
title: Docker 常用命令大全
date: 2024-01-15
authors: default
tags: [docker, 容器化, 运维, 开发工具]
keywords: [docker, 容器, 镜像, 命令, 部署]
description: 详细介绍Docker的安装、配置和常用命令，包括镜像管理、容器操作等实用技巧。
image: https://images.unsplash.com/photo-1605745341112-85968b19335a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80
---

Docker 是现代软件开发中不可或缺的容器化平台。本文将详细介绍 Docker 的安装配置和常用命令，帮助你快速上手 Docker 容器技术。

<!-- truncate -->

## 🚀 🚀 🚀 🚀 安装 Docker

### 1. 下载 Docker Desktop

- 访问 [Docker 官网](https://www.docker.com/products/docker-desktop)
- 下载适用于 macOS 的 Docker Desktop 安装包

### 2. 安装 Docker

```bash
# 1. 打开下载的 .dmg 文件
# 2. 将 Docker 图标拖到 Applications 文件夹
```bash

### 3. 启动 Docker 

```bash
# 从 Applications 文件夹双击 Docker 图标启动
# 或通过命令行启动
open /Applications/Docker.app
```bash

### 4. 验证安装

```bash
docker --version
docker-compose --version
```bash

### 5. ⚡ 配置镜像加速

为了提高镜像下载速度，建议配置国内镜像源：

- 登录阿里云容器镜像服务控制台
- 进入"镜像工具" → "镜像加速器"
- 复制专属加速器地址（形如 `https://xxxxxx.mirror.aliyuncs.com`）

#### 方法一：通过 Docker Desktop 界面配置

1. 打开 Docker Desktop
2. 点击顶部菜单栏 Docker 图标 → Preferences → Docker Engine
3. 在配置文件中添加 `registry-mirrors` 项
4. 点击 Apply & Restart 按钮

#### 方法二：通过配置文件修改

```bash
# 编辑 Docker 配置文件
nano ~/.docker/daemon.json
```bash

添加以下内容：

```json
{
  "registry-mirrors": ["https://xxxxxx.mirror.aliyuncs.com"]
}
```bash

## 💻 💻 💻 📋 Docker 常用命令

### 🆘 帮助命令

```bash
docker version          # 显示docker的版本信息
docker info             # 显示docker的系统信息，包括镜像和容器的数量
docker 命令 --help       # 帮助命令
```bash

### 🖼️ 镜像命令

#### `docker images` - 查看本地镜像

```bash
docker images

# 输出示例
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
nginx         latest    124b44bfc9cc   7 weeks ago    279MB
hello-world   latest    7e1a4e2d11e2   2 months ago   20.4kB
centos        8         a27fd8080b51   3 years ago    340MB
```bash

**字段说明：**
- `REPOSITORY`: 镜像的仓库源
- `TAG`: 镜像的标签
- `IMAGE ID`: 镜像的id
- `CREATED`: 镜像的创建时间
- `SIZE`: 镜像的大小

**常用参数：**
```bash
docker images -a        # 显示所有镜像
docker images -q        # 仅显示镜像id
```bash

#### `docker search` - 搜索镜像

```bash
docker search mysql

# 输出示例
NAME                   DESCRIPTION                                      STARS     OFFICIAL
mysql                  MySQL is a widely used, open-source relation…   15709     [OK]
bitnami/mysql          Bitnami container image for MySQL                133
circleci/mysql         MySQL is a widely used, open-source relation…   31
```bash

**字段说明：**
- `NAME`: 镜像名称
- `DESCRIPTION`: 镜像描述
- `STARS`: star数量
- `OFFICIAL`: 是否为官方镜像

**常用参数：**
```bash
docker search mysql --filter=STARS=3000  # 搜索stars大于3000的镜像
```bash

#### `docker pull` - 下载镜像

```bash
# 下载最新版本
docker pull mysql

# 等价于
docker pull docker.io/library/mysql:latest

# 指定版本下载
docker pull mysql:5.7
```bash

#### `docker rmi` - 删除镜像

```bash
docker rmi -f 镜像id                      # 删除指定镜像
docker rmi -f 镜像id1 镜像id2 镜像id3       # 删除多个镜像
docker rmi -f $(docker images -aq)       # 删除全部镜像
```bash

### 📦 容器命令

> 💡 **提示**：有了镜像才可以创建容器，建议先下载一个 centos 镜像来测试学习。

```bash
docker pull centos
```bash

#### `docker run` - 新建并启动容器

```bash
docker run [可选参数] image

# 常用参数
--name="容器名"     # 为容器指定名称
-d                # 后台方式运行（detached模式）
-it               # 交互式运行，进入容器
-p 主机端口:容器端口  # 端口映射
-P                # 随机端口映射
-v 主机目录:容器目录  # 数据卷挂载
--rm              # 容器停止后自动删除
```bash

**参数详解：**

| 参数 | 说明 | 使用场景 |
|------|------|----------|
| `-d` | 后台运行，类似Linux的`&` | 运行后台服务（Nginx、MySQL等） |
| `-it` | 交互式终端 | 需要与容器交互时（调试、运行Shell） |
| `-p` | 端口映射 | 外部需要访问容器内服务时 |

**示例：**
```bash
# 交互式运行centos
docker run -it centos /bin/bash

# 后台运行nginx并映射端口
docker run -d -p 80:80 --name my-nginx nginx

# 运行完即删除的临时容器
docker run --rm -it ubuntu:20.04 /bin/bash
```bash

#### `docker ps` - 查看容器

```bash
docker ps           # 查看正在运行的容器
docker ps -a        # 查看所有容器（包括已停止的）
docker ps -n=2      # 显示最近创建的2个容器
docker ps -q        # 只显示容器ID
```bash

#### 退出容器

```bash
exit            # 停止容器并退出
Ctrl + P + Q    # 容器继续运行，仅退出交互
```bash

#### 容器生命周期管理

```bash
docker start 容器id      # 启动容器
docker restart 容器id    # 重启容器
docker stop 容器id       # 优雅停止容器
docker kill 容器id       # 强制停止容器
docker rm 容器id         # 删除容器
docker rm -f 容器id      # 强制删除容器
```bash

**批量操作：**
```bash
# 删除所有已停止的容器
docker rm $(docker ps -aq)

# 强制删除所有容器
docker rm -f $(docker ps -aq)

# 使用xargs删除所有容器
docker ps -a -q | xargs docker rm
```bash

### 🔧 实用命令

#### 查看日志

```bash
docker logs 容器id              # 查看容器日志
docker logs -f 容器id           # 实时跟踪日志
docker logs --tail 50 容器id    # 查看最后50行日志
docker logs -t 容器id           # 显示时间戳
```bash

#### 查看容器信息

```bash
docker top 容器id               # 查看容器内进程
docker inspect 容器id           # 查看容器详细信息
docker stats 容器id             # 查看容器资源使用情况
```bash

#### 进入运行中的容器

```bash
# 推荐方式：开启新终端
docker exec -it 容器id /bin/bash

# 进入容器正在执行的终端
docker attach 容器id
```bash

**区别：**
- `docker exec`: 开启新的终端，可以同时操作
- `docker attach`: 进入现有终端，共享输入输出

#### 文件操作

```bash
# 从容器复制文件到主机
docker cp 容器id:容器内路径 主机路径

# 从主机复制文件到容器
docker cp 主机路径 容器id:容器内路径
```bash

## 💡 💡 💡 💡 实用技巧

### 1. 容器后台运行的注意事项

```bash
# ❌ 错误示例：容器会立即停止
docker run -d centos

# ✅ 正确示例：保持容器运行
docker run -d centos /bin/sh -c "while true; do echo hello; sleep 1; done"
```bash

> **原因**：Docker容器必须有前台进程运行，否则会自动停止。

### 2. 常用组合命令

```bash
# 停止并删除所有容器
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

# 删除所有未使用的镜像
docker image prune -a

# 清理系统，删除未使用的容器、网络、镜像
docker system prune -a
```bash

### 3. 容器资源限制

```bash
# 限制内存和CPU
docker run -d --memory="500m" --cpus="1.0" nginx

# 限制内存交换
docker run -d --memory="500m" --memory-swap="1g" nginx
```bash

## 🎯 🎯 🎯 🎯 总结

本文介绍了Docker的基础安装配置和常用命令，掌握这些命令可以帮助你：

- ✅ 高效管理Docker镜像和容器
- ✅ 快速部署和调试应用
- ✅ 优化容器资源使用
- ✅ 排查容器运行问题

继续学习Docker Compose和Dockerfile，可以进一步提升容器化开发效率！

---

*希望这篇文章对你学习Docker有所帮助！如有疑问，欢迎在评论区交流。*
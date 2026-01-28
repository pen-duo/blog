---
slug: ai-timeline-generator-development
title: AI TimeLine Generator网站开发全流程分享
date: 2024-01-15
authors: default
tags: [next.js, ai, 产品开发, 全栈开发, 独立开发]
keywords: [AI, Timeline, Generator, Next.js, 产品开发, 独立开发者]
description: 分享AI Timeline Generator网站从需求分析到部署上线的完整开发流程，包括技术选型、UI设计、前后端实现等经验。
image: https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80
---

大家好！我很高兴向大家介绍我最新开发的项目 - AI Timeline Generator。

🌟 在线体验： [www.aitimeline.site](http://www.aitimeline.site)

🛠️ 技术栈：next.js+tailndcss+typescript++ shadcn ui+supabase+nextauth+ai

🧠 大模型: 通义千问qwen-turbo

<!-- truncate -->

✨ 主要特点：

*   一键生成精美时间轴
*   AI 智能分析关键事件
*   支持一键导出分享
*   简洁优雅的界面设计
*   支持中英双语

🔍 如何使用：

1.  输入你感兴趣的主题
2.  AI 自动生成相关时间轴
3.  一键导出分享

这个项目是我在看完next.js官方文档后做的第一个项目，接触到了很多之前在工作中没有涉及的领域，今天是第一天上线，目前pv有1.2k，是我真正意义上的第一个产品。

整个开发过程很有意思，大家一起来看下吧。

## 产品设计思路

![\_- visual selection.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2ce6e6b9fa2d4a7aa3bbb5c5de48894c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=ire5aknvj8EfC4WviYE1%2F4fobyw%3D)

这一步其实就是按照常规网站开发流程进行了整体的设计，包括需求分析、技术选型、ui设计、前后端编码、数据库设计、部署上线、运营技巧等。

tips: 不过作为独立开发者，我们的核心主题都是**干中学**，在ai时代下不要认为自己不懂设计、不懂前端或后端、不懂运营就做不出产品，每个人都有自己的长短板，发挥好自己的长板，让ai帮我们补充好短板，边做边学习，放弃完美主义，做产品没有那么难。

## 需求分析

需求分析在我看来核心就是一句话：**解决特定人群、特定场景的特定需求。**

上面这句话很关键，以我做的[AI Timeline Generator](https://www.aitimeline.site)网站举例子，它并不是我拿来练手随便做的，我是分析过这个产品的价值的，分析过程如下：

1.  市面上目前很少甚至没有同类似的产品、原因可能是因为这个功能太简单了，不值得一个公司去专门做个网站进行维护，但是作为独立开发者，我很清楚的知道，作为独立开发者，我们其实就是在捡那些大公司不要的剩饭吃，**小而美的产品才是我们追求的**。
2.  功能虽然简单，但是足够极致，目标人群是高校的学生、公司的白领，帮助他们在做汇报时能够快速去生成一份精美的时间轴内容，大模型也可以直接生成，但是不够定制化，而我做的就是帮助学生、白领，满足他们在汇报时需要一份精美的时间轴的需求，这就是解决特定人群、特定场景的特定需求。虽然这个网站还没有达到理想的效果，但是我在字节还学到了一个技巧叫做**小步快跑**，**不要所有事情都想清楚再出发，那样是来不及的，先做一版mvp去验证市场，然后再去完善**，这是一种很好的互联网产品运营思想。
3.  上面的都是作为开发者自己的头脑风暴，都是些比较主观的东西，很有可能会陷入一种自嗨的状态，为了避免掉入这种陷阱，我们需要用客观的数据去辅助验证这是否是个伪需求。验证方法如下：

```javascript
*   关键词检索：通过[semrush](https://www.semrush.com/)可以验证关键词在google上面的被录入的数量，竞争的激烈程度，可以辅助判断这个项目是否值得去做，比如类似于ai english translate这种就不值得，因为搜索引擎前列的几乎都是大厂，个人开发者在这种超级红海里面没有机会。
*   网站流量分析：通过[similarWeb](https://www.similarweb.com/zh/)可以去分析竞品网站的流量、排名、关键词等数据，对比多个网站的表现，找出竞争优势。原理和上面是类似的。
*   谷歌搜索趋势：通过[谷歌关键词搜索趋势](https://trends.google.com/)可以去分析该关键词在整体谷歌、或者目标地区的被搜索频率，查看目标地区对相关产品的需求程度，并且辅助判断产品是否为周期性产品。
```bash

```javascript
以上的方法可以侧面去判断一个需求是否值得去做，我这里只粗略的提一些理论上的知识，尽可能的将我学到的分享出来，实战方面可能偏少，因为我也正在这方面学习，共勉。
```bash

## 技术分析

我开发这个网站采用的技术和原因如下：

*   全栈框架：next.js 14 (App Router)+react： seo友好、全栈开发、性能优异
*   样式：tailndcss+shadcn ui：开发效率高、组件复用性强
*   类型系统：typescript：js超集、很好的类型提示和纠错
*   数据库：supabase：开箱即用、实时订阅、免费额度高
*   登录鉴权：nextauth：集成简单、支持多种登录方式
*   大模型：通义千问turbo：免费额度高、速度较快
*   部署上线：github、vercel
*   粒子动画：tsparticles

这也是我推荐给想要进行独立开发的同学的技术栈，开发效率超级高效，nextjs支持基于文件类型的路由系统、内置api、同时支持csr、ssr的同时还能保证不错的性能体验。shadcn ui + tailwind支持原子级别的css，基本上就是复制粘贴样式，然后自己修修改改。supabase数据库也是开箱即用，虽然在性能上还有待提升，但是已经基本满足一个小网站的要求。nextauth可以帮助开发者快速集成登录鉴权相关的工作。vercel更是提供了非常成熟的CI/CO流水线。如果你还刚好懂得一点提示词工程，那么你的开发效率将提升到一个变态级别的程度。

当前这一切的前提是你懂一点编程基础，知道出现bug怎么调试，开发项目前能做好最基本的架构，知道利用github去管理你的代码仓库，知道如何去申请域名、绑定ssl证书、最重要的是能读懂一点英文，因为上面所有的这些技术几乎都是纯英文的，即使有一些中文翻译过后的文档，也有存在失真的情况。这其实就是我说的要会扬长避短，利用好自己的优势，知道怎么利用ai去弥补短板。

## UI设计

作为一个一直做纯前端、懂一点点后端的开发者，在ui领域我几乎是没有经验的，从零去学习似乎也来不及，所以我选择了走捷径，说好点叫踩在巨人的肩膀上，说难听点就是去抄。去模仿那些ui做的很好看的网站，然后根据自己的需求进行定制化修改。我现在并不避讳这个话题，因为这在互联网行业是再正常不过的现象了，百度模仿谷歌、微博模仿推特、淘宝模仿ebay等等。但是这里的借鉴并不是盲目的抄袭，有一点一定要记住，不要去违背法律，很容易被告侵权的。

优先去看那些开源的项目和作品，开源的也要看是否允许商业化，非开源的作品尽量不要去做ui级别的模仿，可以借鉴一下产品交互、商业运营的思路，这里也给大家推荐一下我最近用的一些工具。

*   [copyweb](https://copyweb.ai/):   输出网站直接出来相关ui的代码，AI Timeline Generator就是模仿这个作者的一个开源作品进行二创的，之前是腾讯大佬，现在all in ai，做了非常多实用的ai产品，这不是推广，是我投桃报李的一种方式。
*   [豆包文生图](https://www.doubao.com/chat/create-image)： 我前司的AI大模型，可以用来通过文字描述出自己的logo设计思想，让AI帮你设计出相关的logo，目前效果还算可以。
*   [设计师](https://www.logosc.cn/design/tools/png-maker)：豆包生成的图片我调整了很多遍提示词，还是没办法将图片的背景抹除干净，这个网站就是专门用来一键移除图片背景的。
*   [favicon在线生成](https://tool.lu/favicon/)：在做好logo之后就要制作网页tab图标了，也就是favicon，这个网站支持一键生成favicon文件，免费且非常方便。

除了ui我这里再简单提两句网页交互，由于我的目标是做小而美的网站，都是整体的交互设计的很简单，包括了

*   输入关键词一键生成时间轴
*   更新时间轴卡片列表展示
*   时间轴详情页展示加粒子动画背景
*   支持下载时间轴图片

在做产品方面我之前一直是属于和产品经理砍需求的那种类型，自己从零到一去设计还是第一次，需要学习的地方还很多，可分享的内容也不多，后续打算出个专栏去输出自己相关的学习经验。

## 前后端实现、数据库设计、大模型集成

整体需求分析和ui设计确定下来后，编码就清晰很多了，前端两个页面，一个主页、一个详情页。后端api主要的工作量在于调用大模型生成时间轴服务。我这里核心介绍该服务，这里有几个很关键的问题，表结构该怎么设计，要接入什么模型，怎么去设置提示词让返回的数据结构可以适配时间轴组件。因为这是网站的核心功能，整体分析过程如下：

### 1. 表结构设计

首先是表结构设计，主页需要展示时间轴卡片，内容包括时间轴标题、时间轴描述、用户头像、创建时间，查看数量等数据，所以需要一张时间轴卡片表timeline\_events。详情页需要时间轴标题、时间轴描述、时间轴事件出现的年份、详细描述、标题等，所以需要一张时间轴详情表timeline。整体的设计图如下：

**主页时间轴卡片**
![223.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d60232d747fc4cedb65683133a475d2d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=KXsLiBIj%2BNSf4DVQriVFJRBOh90%3D)

**详情页时间轴**
![5.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a6b53e2801574afe884c33ca4f0e24f5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=wF1mEngzvvphD%2BH7LFsf%2BF2%2B4g0%3D)

**表结构图**
![222.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b64c10b523ac4cb7a591393050fe87dc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=BUdRmr4raLKd4DiNZhuoSMjEYUc%3D)

表设计完成后，将你的思路交给AI，让它帮助我生成数据库操作的方法，包括创建时间轴信息createTimeline、根据ID获取时间轴及其所有事件getTimeline、获取时间轴列表listTimelines。相关代码如下：

```javascript
import { getSupabaseClient } from './db';

    export class TimelineRepository {
      private client = getSupabaseClient();

      /**
       * 创建新的时间轴及其事件
       * @param data.title - 时间轴标题
       * @param data.coverImage - 时间轴封面图片URL（可选）
       * @param data.events - 时间轴事件数组
       * @param data.userId - 创建者ID（可选）
       * @returns 创建的时间轴信息
       */
      async createTimeline(data: {
        title: string;
        coverImage?: string;
        events: Array<{
          year: string;
          title: string;
          description: string;
        }>;
        userId?: string;
      }) {
        const { data: timeline, error: timelineError } = await this.client
          .from('timelines')
          .insert({
            title: data.title,
            cover_image: data.coverImage,
            user_id: data.userId
          })
          .select()
          .single();

        if (timelineError) throw timelineError;

        const events = data.events.map((event, index) => ({
          timeline_id: timeline.id,
          year: event.year,
          title: event.title,
          description: event.description,
          sort_order: index
        }));

        const { error: eventsError } = await this.client
          .from('timeline_events')
          .insert(events);

        if (eventsError) throw eventsError;

        return timeline;
      }

      /**
       * 根据ID获取时间轴及其所有事件
       * @param id - 时间轴ID
       * @returns 时间轴信息及其关联的事件列表
       */
      async getTimeline(id: string) {
        const { data: timeline, error: timelineError } = await this.client
          .from('timelines')
          .select('*')
          .eq('id', id)
          .single();

        if (timelineError) throw timelineError;

        const { data: events, error: eventsError } = await this.client
          .from('timeline_events')
          .select('*')
          .eq('timeline_id', id)
          .order('sort_order', { ascending: true });

        if (eventsError) throw eventsError;

        return {
          ...timeline,
          events
        };
      }

      /**
       * 获取时间轴列表
       * @param limit - 返回结果数量限制，默认10条
       * @returns 时间轴列表，按创建时间倒序排列
       */
      async listTimelines(limit = 10) {
        const { data, error } = await this.client
          .from('timelines')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data;
      }
    }
```bash

就上面这些代码的编写过程就起码省去了一个非后端大半天的功夫，只是需求描述的足够清楚，AI还是牛的啊。

### 2. 大模型集成

要想集成大模型首先要想清楚的是选择哪个大模型，这里我踩了不少坑，着重描述一下。

首先我们通过[OpenCompass](https://opencompass.org.cn/home)来看下目前国内外大模型的打分，看下目前有哪些大模型是比较优秀的。

![6.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2cf820e71f35442fb8106248cab2b5dd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=44nV22AnZ2lj3USRuIaLnV%2BEJg8%3D)
暂且不论实际的分数是怎么来的，映入眼帘的都是一些比较知名的通用大模型，包括openai、deepseek、gemini、doubao等，看起来还是比较靠谱的。

#### Open AI

所以我根据该网站的建议先接入了openai的`gpt-4o`模型，按照官方文档接入过程如下：

1.  申请apiKey
2.  按照官方文档的描述进行调用

```javascript
    import OpenAI from "openai";
    const client = new OpenAI();

    const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: "Write a one-sentence bedtime story about a unicorn.",
            },
        ],
    });
```bash

3.  通过Vscode的REST Client插件进行本地调用。

这个时候就开始陆续暴露出问题来了。

**APIConnectionError报错**

首先openai调用过程中一直报APIConnectionError，我先去官方查询了一下这个错误的解释，大致意思是请求无法到达服务器，可能是由于代理配置、SSL 证书或防火墙规则导致的，但是具体什么问题就不清楚了，然后根据官网问题我先是关闭了代理，直接发不出请求，切换节点也啥用，防火墙和ssl证书我直接在官网进行对话是没问题的，所以很尴尬我只能去github、stackoverflow去找类似的问题解决方案，找了打半天也没有很有效的信息，又说是python的一个服务导致的，又说是openai的拦截策略导致的，最后在我各种切换搜索词不断去各种社区找，终于找到一个稍微靠谱点的内容，它的意思大概是如果是macos系统通过clash进行代理的话需要开启Tun模式才能进行访问，不然就会报APIConnectionError，我的天，我虽然知道有个Tun模式，但是从来没用过，也不知道是什么东西，于是我去问了一下AI，说实话这个回答我没咋看懂，总结下来就是三句话，为了安全、安全、还是TM的安全。

![333.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/04d0e90d15e24fbeb295b856e1324783~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=SJczLxN4HwejqFErg3Vf%2BhPuRNI%3D)

**海外信用卡收费**

好不容易可以成功调用了，但是显示余额不足需要充值，我服了，不过也怪我之前没有调研清楚，收费就收费吧结果还一定要海外行用卡充值，我实在是没有精力去折腾了，所以就默默换了国产的大模型，这里有知道怎么去充值openai的同学也可以在评论区给点思路。

#### Doubao

在openai上受到了挫折的我第一时间想到了我的老东家，字节跳动的豆包，毕竟熟悉啊，没想在豆包上我又踩坑了。
虽然是老东家，不过这是还是稍微吐槽两句，毕竟我们内部有坦诚清晰这个原则，我想有同事看到也不会怪我🐶。

**文档嵌套层级深**

先不谈文档质量怎么样，我觉得让开发者可以快速找到api文档应该是最起码得工作吧？我搜索这些大模型的api文档，一般都是在google搜索，大模型名字+api就能准确进入到相关的文档，比如我试过Open AI、通义千问、腾讯元宝、deepseek，都是直接搜索完可以直接进入到开发者文档页，非常方便，不信大家可以试试。唯独是豆包，搜索完第一个结果点进去进的是首页，api文档在竟然在第四个位置，前面两个还是第三方写的文档，我实在是理解不了，如果这里你觉得是我鸡蛋里挑骨头的话你可以继续看下面的操作。

**没有前端调用示例**

我好不容易找到了开发者调用文档，结果居然连最基本的前端开发者调用api的示例都没有，我看到了Java、Python、Go、甚至Curl的，唯独没看到nodejs的，我理解不了，豆包不开放给前端开发者吗？当然也有可能是我眼瞎没找到，但是这种示例如果对于有经验的开发者来说都如此难找，这种设计真的是正常的吗？为了证明我不是尬黑，我这里放下我好不容易找到的[开发者文档](https://www.volcengine.com/docs/82379/1099455)，让网友来看看我说的几分真几分假。

![Snipaste\_2025-03-20\_23-57-55.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e08e8e0d16f24eb0b5744d141fdf139e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=YMLQR2Nj6zHxoZ6ee2B1jL0vPR4%3D)

![Snipaste\_2025-03-20\_23-58-27.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b8f8083a7b854fa3bc33303a7214d39a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=3XTsxPrZnBM2iD3FEjrt6vibXfM%3D)

当然如果所有厂商都是这个样子我也就不说什么了，但是我特意去搜索了openai、deepseek、通义千问、腾讯元宝的官方文档，都没有这个问题，非常迅速的找到了我想要的api调用示例。

Open AI
![Snipaste\_2025-03-21\_00-08-19.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6cd8bd3ff0244552b512b70af98db8b7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=MdTEmfvh0pLJ0U5J51xg1VgFNJs%3D)

通义千问

![Snipaste\_2025-03-21\_00-08-30.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4abd2c07d05246b29629ff6e1ae0211f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=tp%2B%2BF2iGxkQ7%2BU1792uA%2ByWFimA%3D)

腾讯元宝

![Snipaste\_2025-03-21\_00-08-45.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/36586774297d401ab37e3597f9d4be59~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=CoOmkdhCTvaXW%2BYN6qrb4PxQ4VQ%3D)

deepseek

![Snipaste\_2025-03-21\_00-08-52.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dbf6804c9e3a436fb5b2f56899ca1951~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=cpYiRWKWXdwk7oK99pqZ7adSYvI%3D)

**复杂的调用姿势**

我自己看着官方文档连猜带蒙的，总算是差不多完成的调用模型的代码，在测试的时候报错了，相关的错误是签名不正确，这里补充一下，调用豆包需要一套复杂的签名策略对传输的数据进行加密，我认为初衷还是好的，但是对于开发者一定都不友好，这里是加密过程的[源码](https://github.com/volcengine/volc-openapi-demos/blob/main/signature/nodejs/sign.js)大家可以参考一下，还是比较复杂的，出了问题之后我没找到合适的解决方法也没有办法debug，于是写了个demo提了个工单，大概等了3个小时之后，给我发了个[调试工具链接](https://api.volcengine.com/api-explorer?action=HighAesGeneralV21L\&groupName=%E4%BA%BA%E5%83%8F%E4%BA%BA%E4%BD%93%E5%85%AC%E6%B5%8B\&serviceCode=cv\&version=2024-06-06)，但是我这个时候已经心力枯竭了，想着还是换个模型吧，太累了。

总结一下，我再次声明一下，我没有任何黑老东家的意思，只是希望它的产品可以越做越好，不然也不会在放弃openai之后第一时间想着用豆包，豆包作为字节内部最近两年的明星级别产品，在近些年饱受争议，投入大产出少，之前我在内部还没有实际体会，但是这次作为独立开发者在接入相关api的时候还是有一些体会的，如果作为一个国内top级别的大模型产品连让开发者可以按照文档顺利接入这一点都做不到，谈何宣传和推广呢？虽然我原来在宇宙厂做研发的时候就已经能感受到了它对于开发者的这种折磨，但是没想到离职之后还能再次遭遇这种被漠视的场景，属于是欧亨利式结尾，情理之中，意料之外了。还是为了证明我不是在尬黑，我下面讲下我介入deepseek和通义千问的流程。

#### Deepseek

接入deepseek的过程和openai没有任何区别，唯一变了的就是模型变了，这里用的是deepseek-v3模型也叫deepseek-chat，非常丝滑。直接调用告诉我要收费，充了10块钱之后就能顺利调通了，整个过程不超过10分钟。

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
        {
            role: "user",
            content: "Write a one-sentence bedtime story about a unicorn.",
        },
    ],
});
```bash

但是deepseek有个很大的问题是速度太慢了，也可能其他模式比较快，但是deepseek-chat我整体体验下来还是太慢了，我体感上起码要一分钟左右，这完全不可接受，原因应该是它背后走的是推理生成，而整个推理过程是比较耗时的，所以为了用户体验我最后切换成了通义千问。

#### 通义千问

通义千问的调用过程和Open AI、Deepseek没有任何区别，都是上面的那种方法，唯一需要做的就是将apiKey和模型修改一下。所以读到这里的朋友应该知道我为什么会在上面对豆包怒其不争了吧，为啥大家都能这样使用，而你非要与众不同呢？关于豆包的评价点到为止，我diss它也是因为它浪费我对它美好的期待和我宝贵的时间。说回来，刚开始我用的模型是qwen-plus，效果速度成本均衡，但是我体验下来还是感觉慢，体感要20s左右。于是我选择了速度更快、成本极低的qwen-turbo，因为我需要的时间轴数据是属于简单任务类型的。这次接入后让我非常满意，平均用时在10s以内，并且通义千问提供了非常多的免费额度，我现在也没有任何充值行为。

![Snipaste\_2025-03-21\_00-46-36.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/eddd4a3f45514cd79d936b63479ff1cb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=OYULQfzEAqStTnBVC%2B%2B15nQmdhY%3D)

对上面的大模型集成过程进行总结一下，我事后反思觉得我在这个过程中犯了一个很严重的错误，就是没有清楚的明白自己想要的是什么类型的模型的情况下就去盲目的接入各种大模型了，导致浪费了很多时间。如果我能想清楚自己需要的就是一个速度快、成本低、适合简单任何的模型的话，我相信应该不会走这么多的弯路，请大家一定要吸取我这个教训。

## 🚀 部署方案

![Snipaste\_2025-03-21\_19-01-37.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b3c5ca505be24c7aa6df8fe47faeb415~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=b9NTjCYdUSG271j5sbl%2BfotNUUg%3D)

我在将这个网站分享到各个技术群的时候，有很多东西对我部署的过程非常好奇，说之前没有接触过部署的流程，想学习一下，我这里进行一个着重分享吧。其实没有大家想的那么复杂，我个人除了在公司经常会用到持续集成的这种流水线以外，个人建站也有过好几次这种部署全流程的经验了。这里详细分析一下

1.  购买主机：首先你需要一个服务器，不管是自己购买的主机还是云服务器都行， 不过国内的主机都需要备案，这一步比较麻烦，耗时比较久，而且自己购买主机的话会涉及到配置选择、依赖安装等比较专业的运维知识，而且一般来说费用都不便宜。我的博客网站就是部署在阿里云服务器的，刚开始也是花了我不少时间。所以这里我建议大家尽可能使用云服务器，也就是第三方厂商的服务器，一般是按照流量进行付费的，相对来说比较便宜，而且不用自己去运维，直接托管厂商，对了，如果只做出海网站的话，直接买国外的主机就好了，这样可以省去备案的时间。

2.  绑定域名：有了服务器之后，你要将你的仓库或托管或部署到服务器上，并购买一个适合你网站域名，域名的选取也是有技巧的，篇幅优先，后续有空分享给大家，域名的绑定涉及到域名解析，在域名服务商处添加A记录，这里建议同时配置www和@主域名解析人，然后等待DNS生效（通常10分钟-2小时）。

3.  ssl证书：绑定域名之后，就能够通过http协议访问了，但是如果你不想要你网站的流量被劫持并且试图提升SEO排名的话，务必要去配置ssl证书，一般大厂的云服务器都是赠送一些免费额度的ssl证书。

4.  如果后续你要给你的网站提速、安全防护的话还需要去可以去购买一些CDN加速、自动备份等相关服务，这里就不多提了。

上面是整体流程，讲下我这个项目怎么部署的吧。
首先是服务器我直接用的[vercel](https://vercel.com/)，免费的，操作流程如下。

1.在将你的项目上传到github后，将你的github和vercel绑定，然后在vercel上导入你要部署的项目。
![Snipaste\_2025-03-21\_19-07-50.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a844238e0f3d41108f38fd0bef49561c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=djuYw40wa%2FOpqGT4XN6HyENMpzg%3D)

2.  选择你项目用的技术栈，我的nextjs，然后点击deploy。
```javascript
![Snipaste\_2025-03-21\_19-08-16.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/1091b05a5dd04aafa09a8be1d5e0e453~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=ksxhBkufPEsrjbSXIojj9bFIHyo%3D)
```bash

3.  然后你的项目就会开始部署了，页面大概张这样，部署成功之后，红色标记的部分就是vercel默认分配的域名，你可以再互联网上进行访问了。
```javascript
![Snipaste\_2025-03-21\_19-08-37.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6963c63c80ff4710acd2e00847d91bd6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=8ZQq83y223TSldi%2FGj%2BNprGy6oY%3D)
```bash

4.  如果你想要去绑定自己的域名的话，那么要先拥有一个域名，我这里用的是[腾讯云](https://buy.cloud.tencent.com/domain/buy?domain=aitmeline\&tlds=.com\&from=dnspodEntrance&_t=1742555577941\&position=search-input),选择一个你觉得合适的域名进行购买，这里需要实名认证，实名后便可以成功购买了。

![Snipaste\_2025-03-21\_19-14-15.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b92fc9799c0349b59517377bcbb28b88~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgY29kZWJhbmdiYW5n:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTU2NTMxNjg0NDM2Mzg5NiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1754814518&x-orig-sign=sTam96WSWrup%2B3IpuLC0it8SCYY%3D)
5.购买域名成功之后需要在Vercel 控制台添加域名，步骤如下

**进入域名设置**

登录 Vercel 控制台 → 选择目标项目 → 进入 **Settings** → **Domains** → 点击 **Add**。

输入需绑定的域名（如 `example.com` 或子域名 `blog.example.com`）15。

**验证域名所有权**

添加域名后，Vercel 会提示 **Invalid Configuration**，需根据指引配置 DNS 解析

**配置 DNS 解析**

进行常规配

*   **子域名（如 `blog.example.com`）** ：\
```javascript
添加 **CNAME 记录**，值为 `cname.vercel-dns.com`8。
```bash
*   **根域名（如 `example.com`）** ：\
```javascript
添加 **A 记录**，指向 Vercel 的 IP 地址（如 `76.76.21.21`）58。
```bash

国内访问优化配置

若需提升国内访问速度和稳定性，使用 Vercel 提供的中国特供解析地址：

*   **CNAME 记录**：`cname-china.vercel-dns.com`
*   **A 记录**：`76.76.21.21` 或 `76.223.126.88`

域名服务商操作示例

进入域名控制台 → 添加记录 → 选择记录类型（A/CNAME）→ 填写目标值

总结：这里比较繁琐，我直接将deepseek生成的答案贴过来了，如果中间遇到问题可以先询问ai,或者去[stackoverflow](https://stackoverflow.com/)上进行相关查询，你遇到的90%的问题在上面都能找到解答。

## 🎯 总结

至此一个项目就大致就成功上线，当然后续还有很多工作要做，比如不断地去做seo、在各种平台进行分享，思考如何进行商业化运营，这些也是我目前正在学习的领域，后续有机会再和大家进行分享吧。这里聊下我未来对这个项目的规划，我这里简单列了一下。

*   提供接入本地大模型知识库的入口，因为现阶段是接入的通用大模型，现在生成的内容还比较泛化，有些用户可能会用在自己公司、学习内部的分享、ppt制作等，需要生成的内容足够定制化。
*   支持多种主题，多种风格的时间轴类型
*   支持横纵时间轴的转换
*   支持自定义时间轴内容
*   支持单张图片的导出
*   不断地去做seo，争取冲上google搜索相关关键词的前15
*   思考如何进行后续的商业化，可能是订阅制、广告流量等

说几句心里话，自从我3月初从字节离职后，一直在思考未来放在何方，暂时还不想重回职场，但是又不知道去干嘛，当休息的差不多之后在x上看到了很多独立开发者在借助AI的力量疯狂的输出自己的产品、那种内心的兴奋感让我觉得这应该是我想做的，我懂一点编程、知道怎么利用AI和搜索引擎解决遇到的问题、会点英文，做几个自己的产品应该不是问题，并且我在这条路上遇到了很多别的行业的朋友通过自己不断地学习也能去做这些事情，我越发觉得AI的力量实在势不可挡，现在的状态除了没有稳定输入会让我偶尔焦虑以外，其他的我都很满足，所以我认为我应该先凭借自己的现有的知识先去做力所能及的事情，遇到瓶颈或者实在没有收入的情况再去职场，不过应该也是为了去学习，然后再次出来做出海产品。工作这条路我思来想去觉得还是有上限的，这行说到最后拼的还是精力和体力，至少我看到的大佬都是精力怪，我觉得我应该不是，如果机遇到来，做出了一些收到别人认可的产品，我觉得这就能算得上是我的事业了。这篇文章写到这里已经花了我差不多3个小时的时间，我分享这些的目的一是利己，复盘的同时通过文字去和志同道合的人交朋友，扩大自己的影响力，宣传自己的产品，二是利他，让或在职场煎熬或被迫事业的朋友看到一个新的可能性，且知道有人正在这条路上拿到成果。我知道评论区可能会有一些负面评价，但是认可的我感谢，批评的我笑纳，这个社会总归是乐观者前行，悲观者正确的，我还是对未来充满希望。哈哈谢谢大家。

> 首发于公众号 [阿彭成长日记](https://s21.ax1x.com/2025/03/21/pE0ut3V.png)，作者codebangbang，全网同名，工作 3 年+，字节跳动跑路前端工程师，校招offer收割机，AI TimeLine Generator作者，立志借助AI成为独立开发者，期待你我共同成长。
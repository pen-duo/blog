export const projects: Project[] = [
  {
    title: 'Jimmy的个人博客',
    description: '基于Docusaurus v3 静态网站生成器实现个人博客',
    preview: '/img/project/blog.png',
    website: '',
    source: 'https://github.com/pen-duo/blog',
    tags: ['opensource', 'design', 'favorite'],
    type: 'web',
  },
  {
    title: 'AI时间轴生成器',
    description: 'AI TimeLine Generator是一个基于AI的网站，可以生成时间线，并生成时间线图片',
    preview: '/img/project/ai-timeline.png',
    website: 'https://www.aitimeline.site/',
    tags: ['ai', 'product', 'personal'],
    type: 'web',
  },
  {
    title: '多语言表格转JSON工具',
    description: '多语言表格转JSON工具，支持复制表格内容进行自动转换和导入JSON，简化手动接入多语言成本',
    preview: '/img/project/auto-transform-json.png',
    website: 'https://codesandbox.io/p/sandbox/sjppvn',
    tags: ['opensource'],
    type: 'tool',
  },
  {
    title: 'Unlock X',
    description: '一个面向 X 账号申诉场景的 AI 产品，提供智能诊断、申诉文案生成与一键化申诉辅助能力，帮助用户更高效地完成账号恢复流程',
    preview: '/img/project/unlock-x.png',
    website: 'https://www.xunlock.cn/',
    tags: ['ai', 'product', 'personal'],
    type: 'web',
  },
]

export type Tag = {
  label: string
  description: string
  color: string
}

export type TagType = 'favorite' | 'opensource' | 'product' | 'design' | 'large' | 'personal' | 'ai' | 'tool'

export type ProjectType = 'web' | 'app' | 'commerce' | 'personal' | 'toy' | 'tool' | 'other'

export const projectTypeMap = {
  web: '🖥️ 网站',
  app: '💫 应用',
  commerce: '商业项目',
  personal: '👨‍💻 个人',
  toy: '🔫 玩具',
  other: '🗃️ 其他',
  tool: '🔧 工具',
}

export type Project = {
  title: string
  description: string
  preview?: string
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目可以提供灵感!',
    color: '#39ca30',
  },
  tool: {
    label: '工具',
    description: '工具项目，简化工作流程，提高工作效率',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '设计漂亮的网站!',
    color: '#a44fb7',
  },
  large: {
    label: '大型',
    description: '大型项目，原多于平均数的页面',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
  ai: {
    label: 'AI',
    description: 'AI项目',
    color: '#12affa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce(
  (group, project) => {
    const { type } = project
    group[type] = group[type] ?? []
    group[type].push(project)
    return group
  },
  {} as Record<ProjectType, Project[]>,
)

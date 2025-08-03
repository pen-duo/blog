import Translate, { translate } from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'
import SpiderSvg from '@site/static/svg/undraw_spider.svg'
import WebDeveloperSvg from '@site/static/svg/undraw_web_developer.svg'

export type FeatureItem = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  header: React.ReactNode
  icon?: React.ReactNode
}

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.developer',
      message: 'TypeScript 全栈工程师',
    }),
    description: (
      <Translate>
        在字节跳动工作3年4个月，负责抖音CSR部门跨端开发。深度掌握TypeScript、React技术栈，在hybrid app开发领域有着丰富的实战经验和深入研究。
      </Translate>
    ),
    header: <WebDeveloperSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="logos:typescript-icon" className="size-4 text-neutral-500" />,
  },
  {
    title: translate({
      id: 'homepage.feature.web3',
      message: '懂点Web3 & 金融交易',
    }),
    description: (
      <Translate>
        在香港知名上市Web3交易所担任高级前端工程师，拥有丰富的Web3金融交易系统开发经验。懂点区块链技术、DeFi协议和加密货币交易系统架构设计。
      </Translate>
    ),
    header: <SpiderSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="cryptocurrency:btc" className="size-4 text-neutral-500" />,
  },
  {
    title: translate({
      id: 'homepage.feature.ai',
      message: 'AI 产品独立开发者',
    }),
    description: (
      <Translate>
        拥有丰富的AI产品独立开发经验，从0到1构建多个AI应用产品。深度理解AI技术栈，擅长将前沿AI技术转化为实用的商业产品，具备全栈产品开发能力。
      </Translate>
    ),
    header: <OpenSourceSvg className="h-auto w-full" height={150} role="img" />,
    icon: <Icon icon="simple-icons:openai" className="size-4 text-neutral-500" />,
  },
]

export default FEATURES

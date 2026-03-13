// eslint-disable-next-line @typescript-eslint/no-require-imports
const blogPluginExports = require('@docusaurus/plugin-content-blog')
const { default: blogPlugin } = blogPluginExports

async function blogPluginEnhanced(context, options) {
  const blogPluginInstance = await blogPlugin(context, options)
  const { postsPerPage } = options

  return {
    ...blogPluginInstance,
    async contentLoaded({ content, allContent, actions }) {
      // Sort blog: first by sticky (higher first), then by date (newer first)，便于用 date 控制系列阅读顺序
      content.blogPosts.sort((a, b) => {
        const stickyA = a.metadata.frontMatter.sticky ?? 0
        const stickyB = b.metadata.frontMatter.sticky ?? 0
        if (stickyB !== stickyA) return stickyB - stickyA
        return new Date(b.metadata.date) - new Date(a.metadata.date)
      })

      // Group posts by postsPerPage
      const groupedPosts = Array.from({ length: Math.ceil(content.blogPosts.length / postsPerPage) }, (_, i) => ({
        items: content.blogPosts.slice(i * postsPerPage, (i + 1) * postsPerPage).map(post => post.id),
      }))

      // Update paginated blog list
      content.blogListPaginated.forEach((page, i) => {
        page.items = groupedPosts[i] ? groupedPosts[i].items : []
      })

      // Create default plugin pages
      await blogPluginInstance.contentLoaded({ content, allContent, actions })

      // Create your additional pages
      const { blogTags } = content
      const { setGlobalData } = actions

      setGlobalData({
        posts: content.blogPosts.slice(0, 10), // Only store 10 posts
        postNum: content.blogPosts.length,
        tagNum: Object.keys(blogTags).length,
      })
    },
  }
}

module.exports = Object.assign({}, blogPluginExports, {
  default: blogPluginEnhanced,
})

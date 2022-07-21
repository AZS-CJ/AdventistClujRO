import axios from 'axios'
type ArticleResponse = { data: { attributes: any; id: number }[]; meta: { pagination: { pageCount: number } } }
const pageSize = 5

const getArticles = async (page) => {
  const url = `/api/articles?sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  const { data: response } = await axios.get<ArticleResponse>(url)

  const articleList = response.data.map((art) => {
    const attrs = art.attributes
    const formattedD = new Date(attrs.publishedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    return {
      id: art.id,
      title: attrs.Title,
      author: attrs.Author,
      summary: attrs.Summary || '',
      content: attrs.Content,
      cover: attrs.Cover,
      img: attrs.Cover ? attrs.Cover.formats.large.url : '',
      createdAt: attrs.createdAt,
      publishedAt: attrs.publishedAt,
      updatedAt: attrs.undatedAt,
      formattedDate: formattedD
    }
  })
  return { articles: articleList, pageCount: response.meta.pagination.pageCount }
}

export default getArticles

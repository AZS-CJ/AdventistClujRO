import axios from 'axios'
import qs from 'qs'

const pageSize = 5

const getArticles = async (page) => {
  const query = qs.stringify(
    {
      sort: 'publishedAt:desc',
      pagination: {
        page: page,
        pageSize: pageSize
      },
      populate: '*'
    },
    {
      encodeValuesOnly: true // prettify URL
    }
  )
  const url = `/api/articles?${query}`
  const { data: response } = await axios.get(url)

  const articleList = response.data.map((article) => {
    const attrs = article.attributes

    return {
      id: article.id,
      title: attrs.title,
      author: attrs.author,
      summary: attrs.summary || '',
      content: attrs.content,
      smallImg: attrs.cover.data ? attrs.cover.data.attributes.formats.small.url : '',
      largeImg: attrs.cover.data ? attrs.cover.data.attributes.formats.large.url : '',
      publishedAt: attrs.publishedAt
    }
  })
  return { articles: articleList, pageCount: response.meta.pagination.pageCount }
}

export default getArticles

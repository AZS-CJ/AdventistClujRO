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
      title: attrs.Title,
      author: attrs.Author,
      summary: attrs.Summary || '',
      content: attrs.Content,
      smallImg: attrs.Background.data ? attrs.Background.data.attributes.formats.small.url : '',
      largeImg: attrs.Background.data ? attrs.Background.data.attributes.formats.large.url : '',
      publishedAt: attrs.publishedAt
    }
  })
  return { articles: articleList, pageCount: response.meta.pagination.pageCount }
}

export default getArticles

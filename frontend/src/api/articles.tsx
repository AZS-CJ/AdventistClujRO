import axios from 'axios'

// const pageSize = 5

// const url = `/api/articles?sort=published_date%3desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`

const getArticles = async (page) => {
  console.log('page? ', page)
  const url = `/api/articles`
  const response = await axios.get(url)
  // return the number of pages: response.meta.pagination.pageCount
  return response.data.map((art) => {
    const formattedD = new Date(art.published_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    return {
      id: art.id,
      title: art.Title,
      content: art.Content,
      cover: art.Cover,
      img: art.Cover ? art.Cover.formats.large.url : '',
      createdAt: art.created_at,
      publishedAt: art.published_at,
      updatedAt: art.undated_at,
      formattedDate: formattedD
    }
  })
}

export default getArticles

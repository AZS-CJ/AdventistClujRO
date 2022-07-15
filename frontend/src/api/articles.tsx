import axios from 'axios'

const getArticles = async () => {
  const url = `/api/articles`
  const response = await axios.get(url)
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

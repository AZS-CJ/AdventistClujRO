import axios from 'axios'

const getHomePageContent = async () => {
  const url = `/api/home-page`
  const response = await axios.get(url)
  return response.data.data.attributes
}

export default getHomePageContent

import axios from 'axios'

const getHomePageContent = async () => {
  const url = `/api/home-page`
  return axios
    .get(url)
    .then((response) => response.data.data.attributes)
    .catch((err) => {
      console.log('Error then loading home content ', err)
      return {}
    })
}

const getLiveStatus = async (youtubeChannelName: string) => {
  return await axios
    .get(`/live?youtubeChannelName=${youtubeChannelName}`)
    .then((response) => response.data)
    .catch((err) => {
      console.log('Error on get live status ', err)
      return {}
    })
}

export { getHomePageContent, getLiveStatus }

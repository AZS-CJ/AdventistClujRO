import axios from 'axios'

const getBackgroundImages = async () => {
  const url = `/api/background?populate=*`
  const response = await axios.get(url)
  return {
    homeDesktop: response.data.data.attributes.homeDesktop.data.attributes.url,
    homeMobile: response.data.data.attributes.homeMobile.data.attributes.url
  }
}

export default getBackgroundImages

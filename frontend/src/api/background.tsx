import axios from 'axios'

const getBackgroundImages = async () => {
  const url = `/api/background?populate=*`
  return axios
    .get(url)
    .then((response) => {
      return {
        homeDesktop: response.data.data.attributes.homeDesktop.data.attributes.url,
        homeMobile: response.data.data.attributes.homeMobile.data.attributes.url
      }
    })
    .catch(() => {
      return { homeDesktop: '', homeMobile: '' }
    })
}

export default getBackgroundImages

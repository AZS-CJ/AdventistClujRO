import axios from 'axios'
import { BackgroundImages } from '../data/backgroundImages'

const getBackgroundImages = async (): Promise<BackgroundImages> => {
  const url = `/api/background?populate=*`
  return axios
    .get(url)
    .then((response) => {
      const attrs = response.data.data.attributes
      return {
        home: attrs.home.data?.attributes.url || '',
        program: attrs.program.data?.attributes.url || '',
        contact: attrs.contact.data?.attributes.url || ''
      }
    })
    .catch((err) => {
      console.log('error ', err)
      return { home: '' }
    })
}

export default getBackgroundImages

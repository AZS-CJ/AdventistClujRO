import axios from 'axios'
import { ImageType } from '../data/about'

export const getGallery = async () => {
  return axios
    .get('/api/gallery?populate=*')
    .then((response) => {
      return {
        description: response.data.data.attributes.description as string,
        images: response.data.data.attributes.images.data.map((img) => {
          return {
            id: img.id,
            large: img.attributes.formats?.large?.url,
            small: img.attributes.formats?.small?.url
          } as ImageType
        })
      }
    })
    .catch((error) => {
      console.log('Error when loading gallery ', error)
      return { description: '', images: [] }
    })
}

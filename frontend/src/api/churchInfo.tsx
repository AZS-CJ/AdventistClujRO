import axios from 'axios'
import { ChuchInfo } from '../data/churchInfo'

const getChurchInfo = async (): Promise<ChuchInfo> => {
  const url = `/api/church-info?populate=*`
  return axios
    .get(url)
    .then((response) => {
      const attrs = response.data.data.attributes
      return {
        tabTitle: attrs.tabTitle,
        churchName: attrs.churchName,
        nameLogoURL: attrs.nameLogo.data?.attributes.url || '',
        address: attrs.address,
        locationMapLink: attrs.locationMapLink,
        youtubeLink: attrs.youtubeLink,
        youtubeLiveLink: attrs.youtubeLiveLink,
        facebookLink: attrs.facebookLink,
        instagramLink: attrs.instagramLink
      }
    })
    .catch((err) => {
      console.log('Error when loading church info ', err)
      return { tabTitle: 'Biserica', churchName: '', nameLogoURL: '', address: '' }
    })
}

export default getChurchInfo

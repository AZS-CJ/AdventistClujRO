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
        faviconUrl: attrs.favicon.data?.attributes.url || '',
        appDescription: attrs.description,
        churchName: attrs.churchName,
        nameLogoURL: attrs.nameLogo.data?.attributes.url || '',
        address: attrs.address,
        locationMapLink: attrs.locationMapLink,
        youtubeLink: attrs.youtubeLink,
        youtubeChannelName: attrs.youtubeChannelName,
        facebookLink: attrs.facebookLink,
        instagramLink: attrs.instagramLink
      }
    })
    .catch((err) => {
      console.log('Error when loading church info ', err)
      return { tabTitle: 'Biserica', churchName: '', nameLogoURL: '', address: '', faviconUrl: '', appDescription: '' }
    })
}

export default getChurchInfo

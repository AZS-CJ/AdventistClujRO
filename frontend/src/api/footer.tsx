import axios from 'axios'

export const getFooter = async () => {
  return axios
    .get(`/api/footer`)
    .then((response) => response.data.data.attributes)
    .catch((error) => {
      console.log('Error when loading Footer ', error)
      return {}
    })
}
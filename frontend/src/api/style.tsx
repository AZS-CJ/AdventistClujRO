import axios from 'axios'

const getStyle = async () => {
  const url = '/api/style'
  return axios
    .get(url)
    .then((response) => response.data.data.attributes)
    .catch((err) => {
      console.log('Error when loading styles ', err)
      return {}
    })
}

export default getStyle

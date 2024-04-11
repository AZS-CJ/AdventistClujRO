import axios from 'axios'

export const getNavbar = async () => {
  return axios
    .get(`/api/navbar`)
    .then((response) => response.data.data.attributes)
    .catch((error) => {
      console.log('Error when loading Navbar', error)
      return {}
    })
}
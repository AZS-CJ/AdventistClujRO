import axios from 'axios'

const getHomePageContent = async () => {
  const url = `/api/home-page`
  return axios
    .get(url)
    .then((response) => response.data.data.attributes)
    .catch((err) => console.log(err))
}

export default getHomePageContent

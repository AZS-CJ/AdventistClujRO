import axios from 'axios'

const getContact = async () => {
  const url = `/api/contact`
  const { data: response } = await axios.get(url)
  return response.data ? response.data.attributes : {}
}

export default getContact

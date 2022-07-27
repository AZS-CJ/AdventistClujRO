import axios from 'axios'

const getUnderConstruction = async () => {
  const url = `/api/under-construction`
  const response = await axios.get(url)
  return response.data.data.attributes.Enabled
}

export default getUnderConstruction

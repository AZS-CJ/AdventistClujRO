import axios from 'axios'

const getUnderConstruction = async () => {
  const url = `${process.env.REACT_APP_HOST}/under-construction`
  if (url !== undefined) {
    const response = await axios.get(url)
    console.log(JSON.stringify(response.data))
    return response.data.IsEnabled
  }
  return false
}

export default getUnderConstruction

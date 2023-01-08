import axios from 'axios'

const getPrograms = async () => {
  const url = `/api/programs`
  const { data: response } = await axios.get(url)

  return response.data
    .map((p) => ({ id: p.id, ...p.attributes }))
    .filter((p) => {
      if (!p.expirationDate) return true
      return new Date(p.expirationDate) > new Date()
    })
}

export default getPrograms

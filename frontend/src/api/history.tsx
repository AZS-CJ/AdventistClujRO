import axios from 'axios'

export const getHistory = async () => {
  return axios
    .get(`/api/histories`)
    .then((response) => response.data.data.map((entry) => ({ id: entry.id, ...entry.attributes })))
    .catch((error) => {
      console.log('Error when loading history ', error)
      return []
    })
}

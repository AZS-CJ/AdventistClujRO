import axios from 'axios'

export const getHistory = async () => {
  return axios
    .get(`/api/histories?sort=id:asc`)
    .then((response) => response.data.data.map((entry, index) => ({ id: entry.id, order: index + 1, ...entry.attributes })).reverse())
    .catch((error) => {
      console.log('Error when loading history ', error)
      return []
    })
}

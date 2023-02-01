import axios from 'axios'
import { ProgramType } from '../data/program'

const getPrograms = async (): Promise<ProgramType[]> => {
  const url = `/api/programs`
  return axios
    .get(url)
    .then((response) => {
      return response.data.data
        .map((p) => ({ id: p.id, ...p.attributes }))
        .filter((p) => {
          if (!p.expirationDate) return true
          return new Date(p.expirationDate) > new Date()
        })
    })
    .catch((error) => {
      console.log('error ', error)
      return []
    })
}

export default getPrograms

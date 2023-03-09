import axios from 'axios'
import { ProgramType } from '../data/program'
import { formatToYYYYMMDD } from '../util/functions'
import qs from 'qs'

const getPrograms = async (): Promise<ProgramType[]> => {
  const query = qs.stringify(
    {
      filters: {
        $or: [{ expirationDate: { $gte: formatToYYYYMMDD(new Date()) } }, { expirationDate: { $null: true } }]
      }
    },
    { encodeValuesOnly: true }
  )
  const url = `/api/programs?${query}`
  return axios
    .get(url)
    .then((response) => {
      return response.data.data.map((p) => ({ id: p.id, ...p.attributes }))
    })
    .catch((error) => {
      console.log('Error when loading the program ', error)
      return []
    })
}

export default getPrograms

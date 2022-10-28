import axios from 'axios'
import { createEmailFormat } from '../util/functions'

export const getContact = async () => {
  const { data: response } = await axios.get(`/api/contact`)
  return response.data ? response.data.attributes : {}
}

export const sendEmail = async (message) => {
  const name = `${message.firstName} ${message.lastName}`
  const title = `Mesaj nou de la ${name}`
  const htmlContent = createEmailFormat(message, name)
  return await axios.post('/email', { htmlContent, title })
}

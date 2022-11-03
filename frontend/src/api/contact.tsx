import axios from 'axios'

export const getContact = async () => {
  const { data: response } = await axios.get(`/api/contact`)
  return response.data ? response.data.attributes : {}
}

export const sendEmail = async (message) => {
  const name = `${message.firstName} ${message.lastName}`
  const title = `Mesaj nou de la ${name}`
  return await axios.post('/email', { title, name, email: message.email, phone: message.phone || '-', text: message.text })
}

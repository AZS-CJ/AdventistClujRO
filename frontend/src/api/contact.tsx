import axios from 'axios'

export const getContact = async () => {
  return axios
    .get(`/api/contact`)
    .then((response) => response.data.data.attributes)
    .catch((error) => {
      console.log('Error when loading Contact ', error)
      return {}
    })
}

export const sendEmail = async (message) => {
  const name = `${message.firstName} ${message.lastName}`
  const title = `Mesaj nou de la ${name}`
  return await axios.post('/email', { title, name, email: message.email, phone: message.phone || '-', text: message.text })
}

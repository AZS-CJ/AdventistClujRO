const path = require('path');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const axios = require('axios');
require('dotenv').config()


const fetchEmailConfig = async () => {
    try {
      const response = await axios.get(`${process.env.CMS_DB_HOST}/api/contact-email`);
      const config = response.data.data.attributes;
      return {
        email: config.email,
        password: config.password
      };
    } catch (error) {
      throw new Error('Could not fetch email configuration');
    }
  };

const handlebarOptions = {
    viewEngine:  {
        extName: ".handlebars",
        partialsDir: path.resolve('/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars"
}

const sendEmail = async (params, callback) => {
    try {
        const { email, password } = await fetchEmailConfig();
        const transporter = nodemailer.createTransport({
            service: 'gmail', auth: { user: email, pass: password }
        });
        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: email,
            to: email,
            subject: params.title,
            template: 'email',
            context: params
        };

        transporter.sendMail(mailOptions, callback);
    } catch (error) {
        callback(error);
    }
}

module.exports = { sendEmail }

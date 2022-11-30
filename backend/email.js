const path = require('path');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD }
});

const handlebarOptions = {
    viewEngine:  {
        extName: ".handlebars",
        partialsDir: path.resolve('/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars"
}

transporter.use('compile', hbs(handlebarOptions))

const sendEmail = (params, callback) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: params.title,
        template: 'email',
        context: params
    };

    transporter.sendMail(mailOptions, callback);
}

module.exports = { sendEmail }

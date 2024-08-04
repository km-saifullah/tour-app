const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  // 1. create a transporter
  let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // 2. define the email options
  const mailOptions = {
    from: 'Khaled Saifullah <monmoygsc@gmail.com>',
    to: options.email,
    sub: options.subject,
    text: options.message,
  }

  // 3. send the email with nodemailer
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail

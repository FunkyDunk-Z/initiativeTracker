const nodemailer = require('nodemailer')

module.exports = class Email {
  constructor(user, url, message) {
    this.to = user.email
    this.firstName = user.firstName
    this.url = url
    this.message = message
    this.from = `Duncan W. Saul <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // for gmail activate "less secure app"
    })
  }

  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: this.message,
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('Welcome to a World Building App')
  }

  async sendPasswordReset() {
    await this.send('Password Reset (valid for 10 minutes)')
  }
}

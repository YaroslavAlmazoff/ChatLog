const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "yalmazoff@gmail.com",
        pass: "wloe wsdd vsdo bfqn",
      },
    });
  }
  async sendActivationLink(to, link) {
    await this.transporter.sendMail({
      from: "yalmazoff@gmail.com",
      to,
      subject: `Подтверждение регистрации chatlog.ru`,
      text: "",
      html: `
                <div>
                    <h1>Для подтверждения регистрации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
    });
  }
  async sendReturnLink(to, link) {
    await this.transporter.sendMail({
      from: "yalmazoff@gmail.com",
      to,
      subject: `Восстановление доступа к chatlog.ru`,
      text: "",
      html: `
                <div>
                    <h1>Для восстановления доступа к аккаунту перейдите по ссылке:</h1>
                    <a href="${link}">${link}</a>
                </div>
            `,
    });
  }
}

module.exports = new MailService();

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
  async sendArtMail(data) {
    const {
      picture,
      price,
      name,
      surname,
      email,
      phone,
      comment,
      delivery,
      address1,
      address2,
    } = data;
    await this.transporter.sendMail({
      from: "svetlana.kizhaewa@yandex.ru",
      to: email,
      subject: `Ваш заказ принят. Спасибо!`,
      text: "",
      html: `
        <div>
          <p>
            Уважаемый(ая) ${name}, выражаю Вам признательность за покупку в
            Интернет-магазине КИоСК. Ваш заказ уже поступил в обработку, об
            отправке и оплате я Вас проинформирую по указанному Вами телефону
          </p>
          <h1>${name} ${surname}</h1>
          <hr />
          <div
            style="display: flex; align-items: center; justify-content: center;"
          >
            <div>
              <h3>Контакты:</h3>
              <a href="${email}">${email}</a>
              <p>${phone}</p>
              <br />
              <h3>Способ оплаты:</h3>
              <p>Перевод</p>
            </div>
            <div>
              <h3>Адрес:</h3>
              <p>${address1 ? address1 : address2}</p>
              <br />
              <h3>Способ доставки:</h3>
              <p>${delivery}</p>
            </div>
          </div>
          <h1>Содержание заказа</h1>
          <hr />
          <h3>Наименование</h3>
          <p>${picture}</p>
          <h2>ИТОГО: ${price}</h2>
          <hr />
          <h2>Комментарий</h2>
          <p>${comment}</p>
        </div>
      `,
    });
  }
}

module.exports = new MailService();

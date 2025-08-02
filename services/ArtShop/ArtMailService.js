const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "kiosk.svetlana.kizhaeva@gmail.com",
        pass: "brkc knks sfep cgmu",
      },
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
    try {
      await this.transporter.sendMail({
        from: "kiosk.svetlana.kizhaeva@gmail.com",
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
      await this.transporter.sendMail({
        from: "kiosk.svetlana.kizhaeva@gmail.com",
        to: "svetlana.kizhaewa@yandex.ru",
        subject: `Новый заказ`,
        text: "",
        html: `
        <div>
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
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new MailService();

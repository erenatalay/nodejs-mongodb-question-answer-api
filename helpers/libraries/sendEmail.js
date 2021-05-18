const nodemailer = require("nodemailer");


const sendEmail = async(mailOptions) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9db1492c9ea132",
          pass: "8d8e8c644165a9"
        }
      });

    let info = await transporter.sendMail(mailOptions);
    console.log(`MESSAGE SENT : ${info.messageId}`)


}

module.exports = sendEmail;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'giecha16@gmail.com',
    pass: 'Nevergiveup2'
  },
  debug: true
});

const sendMail = (email, name, title) => {
  const options = {
    from: 'giecha16@gmail.com',
    to: email,
    subject: "Reminder for your reads",
    text: `Halo ${name}!! Hari ini adalah hari terakhir masa pinjam ebook ${title}, \n ayo segera bereskan bacaanmu sebelum masa pinjammu habis!`
  };

  transporter.sendMail(options, (err, info) => {
    if (err) console.log(err);
    else console.log(`Reminder terkirim ke alamat email ${email}`);
  });
}

sendMail('adastariana@gmail.com', 'Anggi Dastariana', 'Sapiens');
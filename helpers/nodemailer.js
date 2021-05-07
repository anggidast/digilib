const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'giecha16@gmail.com',
    pass: 'nevergiveup2'
  }
});

const sendMail = (email, name, title, cb) => {
  const options = {
    from: '"Digilib Reminder" <giecha16@gmail.com>',
    to: email,
    subject: "Reminder for your reads",
    text: `Halo ${name}!! \n Hari ini adalah hari terakhir masa pinjam ebook ${title}, \n ayo segera selesaikan bacaanmu sebelum masa pinjammu habis!\n\n\n Digilib Admin`
  };

  transporter.sendMail(options, (err, info) => {
    if (err) return cb('Email tidak terkirim, terjadi kesalahan');
    else cb(null);
  });
}

module.exports = sendMail;
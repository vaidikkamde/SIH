var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ceo.dot.in@gmail.com',
    pass: 'Hbaruas2225@'
  }
});

var mailOptions = {
  from: 'ceo.dot.in@gmail.com',
  to: 'co.ceo.dot.in@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'keshav Chutiya Hai!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
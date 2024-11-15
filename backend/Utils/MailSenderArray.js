const nodemailer = require('nodemailer');
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: 'placementconnect9@gmail.com', 
      pass: 'vbxp xoql egds euuf'      
    }
  });
};


const sendEmail = (toEmails, subject, text,htmlcontent  ) => {
  const transporter = createTransporter();  // Create the transporter

  const mailOptions = {
    from: 'placementconnect9@gmail.com', 
    to: toEmails.join(', '),     
    subject: subject,            
    html:htmlcontent         
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent successfully: ', info.response);
    }
  });
};
module.exports=sendEmail;


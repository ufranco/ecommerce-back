const express = require("express");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "testestrestigres@gmail.com",
      pass: "tetesteolapapirola"
  }
});

exports.sendEmailConfirmation = async(req, user) => {

  const token = await jwt.sign(
    { user: {
      id: user.id
    } }, 
    process.env.JWT_EMAIL_AUTH_SECRET, 
    { expiresIn: 3600 }
  );

  const confirmationUrl = `https://${process.env.HOSTNAME}:${process.env.PORT}/${token}`;

  console.log(confirmationUrl);

  const mailOptions = {
    from: 'testestrestigres@gmail.com',
    to: user.email,
    subject: `${user.sex === 'FEMALE' ? 'Bienvenida' : 'Bienvenido' } ${user.profileName}!`,
    html: `Please confirm your email by clicking the following link 
    <a href=${confirmationUrl}>${confirmationUrl}</>`,
  };

  return await transporter.sendEmail(mailOptions);

} 
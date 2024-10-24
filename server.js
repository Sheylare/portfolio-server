// server.js
require("dotenv").config(); // Cargar las variables de entorno
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Usar la variable de entorno
    pass: process.env.EMAIL_PASS, // Usar la variable de entorno
  },
});

// Endpoint para enviar el correo
app.post("/send", (req, res) => {
  if (!req.is("application/json")) {
    return res.status(400).send("Tipo de contenido no soportado."); // Verifica si el contenido es JSON
  }
  const { name, email, subject, message } = req.body;
  const mailOptions = {
    from: email, // Remitente
    to: process.env.EMAIL_USER, // Destinatario
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Correo enviado: " + info.response);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

import 'express-async-errors';
import express, {NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import { validate as validateEmail } from 'email-validator';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env['PORT'] || 3000;

const toMail = process.env['TO_EMAIL'];

const smtp = {
  service: process.env['SMTP_SERVICE']!,
  host: process.env['SMTP_HOST']!,
  port: parseInt(process.env['SMTP_PORT']!),
  secure: !!(process.env['SMTP_SECURE'] && process.env['SMTP_SECURE'] != 'false'),
  auth: {
    user: process.env['SMTP_AUTH_USER']!,
    pass: process.env['SMTP_AUTH_PASS']!,
  }
}

const transporter = nodemailer.createTransport(smtp);

interface ContactRequest {
  email: string;
  message: string;
  name?: string;
  subject?: string;
};

app.get('/', async (req, res)=>{
  res.sendFile(process.cwd()+'/assets/index.html')
});
app.get('/style.css', async (req, res)=>{
  res.sendFile(process.cwd()+'/assets/style.css')
});
app.get('/portrait.png', async (req, res)=>{
  res.sendFile(process.cwd()+'/assets/portrait.png')
});
app.get('/contact', async (req, res)=>{
  res.sendFile(process.cwd()+'/assets/contact.html')
});

app.post("/contact", async (req, res) => {
  const { email, message, name, subject } = req.body as ContactRequest;
  if (!validateEmail(email)) {
    res.status(400).send("Invalid email");
    return;
  }
  if (!message.trim()) {
    res.status(400).send("No message");
    return;
  }
  const info = await transporter.sendMail({
    from: `<${smtp.auth.user}>`,
    replyTo: `${name?`"${name}"`:''} <${email}>`,
    to: toMail,
    subject: subject || "Contact form message",
    text: message
  });

  if (info.rejected.length) {
    res.status(500).send("Failed to send message");
    return;
  }
  res.sendFile(process.cwd()+'/assets/thanks.html')
});

app.use(async (err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Internal server error');
  return;
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

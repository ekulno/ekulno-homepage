import express from 'express';
import React from 'react';
import App from '../src/App';
import generateClient from './GenerateClient';
import { StaticRouter } from 'react-router-dom/server'
import { HeadProvider } from 'react-head';
import { EirikLd } from '../src/ld';
import { ContactFormData } from '../src/types';
import { Resend } from 'resend';

const missingEnvVars:Array<string> = [];
for (const envVar of ['RESEND_API_KEY','RESEND_TO_EMAIL','RESEND_FROM_EMAIL']){
  if (!process.env[envVar]){
    missingEnvVars.push(envVar);
  }
}
if (missingEnvVars.length){
  throw new Error(`Missing env vars [ ${missingEnvVars.join(', ')} ]`);
}

const resend = new Resend(process.env['RESEND_API_KEY']);
const toMail = process.env['RESEND_TO_EMAIL']!;
const fromMail = process.env['RESEND_FROM_EMAIL']!;

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('./public', {
  index: false,
}));

app.use(express.json())


app.use('/build', express.static('./build'));
app.get('/eirik', async (req, res) => {
  return res.json({ ...EirikLd, "@context": "https://schema.org/" });
})
app.get('*', async (req, res) => {
  try {
    const clientString = await generateClient(
      <HeadProvider headTags={[]}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </HeadProvider>,
      undefined
    )
    return res.send(clientString);
  } catch (untypedErr: any) {
    const err: NodeJS.ErrnoException = untypedErr;
    console.error('Something went wrong:', err);
    return res.status(500).send('Oops, better luck next time!');
  }
});
app.post('/contact', async(req,res)=>{
  const data = req.body as ContactFormData;
  for (const key of (['name','email','message'] as Array<keyof ContactFormData>)){
    if (!data[key]){
      const response = res.status(400);
      response.statusMessage = `Missing field '${key}'`;
      return response.send();
    }
  }
  try{
    const info = await resend.emails.send({
      from: fromMail,
      reply_to: `${data.name||'No name'} <${data.email}>`,
      to: toMail,
      subject: "Contact form message",
      text: data.message
    })
    if (info.error) {
      console.error("Resender error",info.error)
      return res.status(500).send();
    }
  } catch (error){
    return res.status(500).send();
  }
  return res.status(201).send();
});
app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});
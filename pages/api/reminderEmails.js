import { config } from 'dotenv-safe';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

config();

export default async function emailHandler(request, response) {
  if (request.method === 'POST') {
    if (
      typeof request.body.reminder.email !== 'string' ||
      !request.body.reminder.email ||
      typeof request.body.reminder.name !== 'string' ||
      !request.body.reminder.name ||
      typeof request.body.reminder.price !== 'string' ||
      !request.body.reminder.price ||
      typeof request.body.reminder.username !== 'string' ||
      !request.body.reminder.username
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Email, name or price not provided',
          },
        ],
      });
      return;
    }

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const refreshToken = process.env.REFRESH_TOKEN;

    const OAuth2 = google.auth.OAuth2;
    const myOAuth2Client = new OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground',
    );
    myOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const myAccessToken = myOAuth2Client.getAccessToken();

    console.log(request.body);

    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      secure: true,
      auth: {
        type: 'OAuth2',
        clientId,
        clientSecret,
      },
    });

    const mailData = {
      from: 'draku.money.management@gmail.com',
      to: request.body.reminder.email,
      subject: `Reminder to pay your bills`,
      text: `Hey, just a quick reminder that you have to pay ${request.body.reminder.name}. The total amount is ${request.body.reminder.price}`,
      html: `<div>
          <div>Hey  ${request.body.reminder.username}! </div>
          Just a quick reminder that you have to pay
          ${request.body.reminder.name} soon. The total amount is
          ${request.body.reminder.price}.
          <div>Draku</div>
        </div>`,
      auth: {
        user: 'draku.money.management@gmail.com',
        refreshToken: refreshToken,
        accessToken: myAccessToken,
      },
    };

    const confirmationMailData = {
      from: 'draku.money.management@gmail.com',
      to: request.body.reminder.email,
      subject: `Confirmation e-mail reminder set-up `,
      text: `Hey, you successfully registered for an e-mail reminder to pay your ${request.body.reminder.name} bill.`,
      html: `<div>
      <div>Hey  ${request.body.reminder.username}! </div>
      You successfully registered for an e-mail reminder to pay your ${request.body.reminder.name} bill.
      <div>Draku</div>
        </div>`,
      auth: {
        user: 'draku.money.management@gmail.com',
        refreshToken: refreshToken,
        accessToken: myAccessToken,
      },
    };

    transporter.sendMail(confirmationMailData, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    // cron.schedule(` */10 * * * * *`, () => {
    //   transporter.sendMail(mailData, function (err, info) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log(info);
    //     }
    //   });
    // });

    cron.schedule(`* * * ${request.body.reminder.day} * *`, () => {
      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    });

    response.status(200).json({ message: 'it worked' });
    return;
  }

  response.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST',
      },
    ],
  });
  return;
}

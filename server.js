const express = require('express')

const app = express()
require('dotenv').config()

app.get('/favicon.ico', (_req, res) => {
  res.status(204)
  res.end()
})

app.get('/set-device', (req, res) => {
  // import { create, Client } from '@open-wa/wa-automate';
  const wa = require('@open-wa/wa-automate');

  wa.create({
    useChrome:true,
    sessionId: req.query.session,
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
  }).then(client => start(client));

  async function start(client) {
    client.onMessage(async message => {
      if (message.body === 'Hi') {
        await client.sendText(message.from, '👋 Hello!');
      }
      await client.sendText(chatId, "Hello");
    })
  }
  res.json()
})

app.listen(process.env.APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`express whatsapp app running in port ${process.env.APP_PORT}`)
})

let server;

const exitHandler = () => {
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports = app

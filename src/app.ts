import express = require('express');
import { PostgresToJsonService } from './postgres-to-json/postgres-to-json.service';
import { Client } from 'ts-postgres';

const app: express.Application = express();

async function initApp(app: express.Application) {
  const mimicClient = await initDatabaseConnection();
  app.get('/dataset', async (_req, res) => {
    let response: string;
    const postgresToJsonService = new PostgresToJsonService(mimicClient);
    const dataset = await postgresToJsonService.getDataset();
    response = JSON.stringify(dataset);
    res.send(response);
  });

  app.get('/visit/:visitId', async (req, res) => {
    const reqVisitId = req.params.visitId;
    const visitId = Number(req.params.visitId);
    let response: string;
    if (isNaN(visitId)) {
      res.status(400);
      response = `Invalid visitId: ${reqVisitId}`;
    } else {
      const postgresToJsonService = new PostgresToJsonService(mimicClient);
      const visit = await postgresToJsonService.getVisit(visitId);
      response = JSON.stringify(visit);
    }
    res.send(response);
  });

  app.get('/visits', async (_req, res) => {
    const postgresToJsonService = new PostgresToJsonService(mimicClient);
    const visit = await postgresToJsonService.getVisits();
    const response = JSON.stringify(visit);
    res.send(response);
  });

  app.listen(4040, () => {
    console.log('Example app listening on port 4040');
  });
}

async function initDatabaseConnection() {
  const host = process.env.mimicHost;
  const port = Number(process.env.mimicPort);
  const user = process.env.mimicUser;
  const database = process.env.mimicDatabase;
  const password = process.env.mimicPassword;

  const mimicClient = new Client({ host, port, user, database, password });
  await mimicClient.connect();
  return mimicClient;
}

initApp(app);
import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

import { PostgresToJsonService } from '../postgres-to-json/postgres-to-json.service';
import { NamedParamClient } from '../named-param-client/named-param-client';
import { DataAccessObject } from '../data-access-object/data-access-object';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventDictionary } from '../event-dictionary/event-dictionary';

export class MimicServer {
  private app = new BehaviorSubject<express.Application | null>(null);
  private server: Server;
  private mimicClient: NamedParamClient | null = null;
  private io: SocketIO.Server;
  private eventDict: EventDictionary;

  constructor() {
    this.eventDict = new EventDictionary();
    const app = express();
    this.server = createServer(app);
    this.io = socketIo(this.server);
    this.listen(app);
  }

  getApp(): Observable<express.Application> {
      return new Observable((observer: Observer<express.Application>) => {
        this.app
        .pipe(filter((app: express.Application | null) => !!app))
        .subscribe((app: express.Application | null) => {
          if (app) observer.next(app);
        });
      });
  }

  private async listen(app: express.Application) {
    this.mimicClient = await this.initDatabaseConnection();
    const dataAccessObject = new DataAccessObject(this.mimicClient);
    const postgresToJsonService = new PostgresToJsonService(dataAccessObject);

    app.get('/dataset', async (_req, res) => {
      let response: string;
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
        const visit = await postgresToJsonService.getVisit(visitId, this.eventDict);
        response = JSON.stringify(visit);
      }
      res.send(response);
    });

    app.get('/visits', async (_req, res) => {
      const visit = await postgresToJsonService.getVisits();
      const response = JSON.stringify(visit);
      res.send(response);
    });

    app.listen(4040, () => {
      console.log('Example app listening on port 4040');
    });

    this.io.on('connect', (socket: SocketIO.Socket) => {
      console.log('new client connected');
      socket.on('listen', (guid: string) => {
        console.log(guid);
      });
      socket.on('disconnect', () => {
          console.log('Client disconnected');
      });
    });

    this.app.next(app);
  }

  private async initDatabaseConnection() {
    const host = process.env.mimicHost;
    const port = Number(process.env.mimicPort);
    const user = process.env.mimicUser;
    const database = process.env.mimicDatabase;
    const password = process.env.mimicPassword;

    const mimicClient = new NamedParamClient({ host, port, user, database, password });
    await mimicClient.connect();
    return mimicClient;
  }
}

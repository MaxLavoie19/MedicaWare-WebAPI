import { createServer, Server } from 'http';
import express = require("express");
import socketIo = require("socket.io");

import { NamedParamClientPool } from '../named-param-client/named-param-client';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { EventDictionary } from '../event-dictionary/event-dictionary';
import { ModuleClass } from '../types/module-class';
import { DataModule } from '../modules/data-module/data-module';
import { EventModule } from '../modules/event/event';

export class MimicServer {
  private app = new BehaviorSubject<express.Application | null>(null);
  private mimicClient?: NamedParamClientPool;
  private server?: Server;
  private io?: SocketIO.Server;
  private eventDict: EventDictionary;

  constructor(private serverModuleClassList: ModuleClass[] = []) {
    this.eventDict = new EventDictionary();
    const app = express();
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
    if (!this.mimicClient) return;
    const mimicClient = this.mimicClient;

    app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      next();
    });

    const eventModule = new EventModule(app, this.eventDict);
    eventModule.init();
    this.serverModuleClassList.forEach((serverModuleClass: ModuleClass) => {
      const serverModule = new serverModuleClass(app, mimicClient, this.eventDict);
      serverModule.init();
    });

    this.server = createServer(app);
    this.io = socketIo(this.server);

    this.server.listen(4040, () => {
      console.log('Mimic app listening on port 4040');
    });

    this.io.on('connect', (socket: SocketIO.Socket) => {
      console.log('new client connected');
      const subscriptions: Subscription[] = [];
      socket.on('subscribe', (guid: string) => {
        console.log(`Client subscribed to ${guid}`);
        const subscription = this.eventDict.getEvent(guid)
          .pipe(debounceTime(500))
          .subscribe((value) => {
            socket.emit('update', { guid, value });
          });
        subscriptions.push(subscription);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected');
        subscriptions.forEach(subscription => subscription.unsubscribe());
      });
    });
    this.app.next(app);
  }

  private async initDatabaseConnection(): Promise<NamedParamClientPool> {
    const host = process.env.mimicHost;
    const port = Number(process.env.mimicPort);
    const user = process.env.mimicUser;
    const database = process.env.mimicDatabase;
    const password = process.env.mimicPassword;

    const mimicClientPool = new NamedParamClientPool(
      { host, port, user, database, password }, { max: 10 }
    );
    return mimicClientPool;
  }
}

import { Injectable, Injector } from '@angular/core';
import { banner } from '../../common/util/banner';
import Socket = SocketIO.Socket;
import { Logger } from '../../common/services/logger.service';
import { Server } from '../servers/abstract.server';
import { IRoute } from 'hapi';
import * as chalk from 'chalk';
const Vantage = require('vantage');

export interface ConnectedSocketCallback {
  (socket: Socket): void;
}

@Injectable()
export class RemoteCli {

  protected vantage: any;
  private logger: Logger;

  constructor(loggerBase: Logger, private injector: Injector) {

    this.logger = loggerBase.source('remote-cli');

    this.vantage = new Vantage();

    this.vantage.delimiter('ubiquits-runtime~$');

    let displayBanner = `Welcome to Ubiquits runtime cli. Type 'help' for commands`;
    if ((<any>process.stdout).columns > 68) {
      displayBanner = `${banner}\n${displayBanner}`;
    }

    this.vantage.banner(displayBanner);

    this.registerCommands();
  }

  private registerCommands(): void {

    let remoteCli = this;

    this.vantage
      .command('foo')
      .description("Outputs 'bar'.")
      .action(function (args: any, callback: Function) {
        remoteCli.logger.info('bar');
        this.log('hey there foo');
        callback();
      });

    this.vantage.command('routes')
      .description('outputs route table')
      .action(function (args: any, callback: Function) {

        remoteCli.logger.info('CLI session retrieving routes');

        let server = remoteCli.injector.get(Server);

        const routeTable = server.getEngine().connections[0].table()
          .map((route: IRoute) => [route.method, route.path]);

        routeTable.unshift(['Method', 'Path'].map((s: string) => chalk.blue(s)));

        let table = remoteCli.logger.makeTable(routeTable);

        this.log('\n' + table);
        callback();
      });
  }

  public start(port: number, callback?: ConnectedSocketCallback): void {

    if (!callback) {
      callback = (socket: Socket) => {
        this.logger.info(`Accepted a connection from [${socket.conn.remoteAddress}]`);
      };
    }

    this.vantage.listen(port, callback);
    this.logger.info(`Vantage server started on ${port}`);
  }

}

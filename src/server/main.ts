import 'core-js';
import 'reflect-metadata';
import { Server } from './servers/abstract.server';
import { Database } from './services/database.service';
import { RemoteCli } from './services/remoteCli.service';
import { Logger } from '../common/services/logger.service';
import { ConsoleLogger } from '../common/services/consoleLogger.service';
import { DebugLogMiddleware } from './middleware/debugLog.middleware';
import { ExpressServer } from './servers/express.server';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as _ from 'lodash';
import { ProviderDefinition } from './bootstrap/bootstrap';

/**
 * Load .env variables into process.env.*
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

process.env = _.mapKeys(process.env, (value: any, key: string) => key.replace(/^PUBLIC_/, ''));

export const CORE_PROVIDERS: ProviderDefinition[] = [
  Database,
  RemoteCli,
  DebugLogMiddleware,
  // {provide: Server, useClass: HapiServer},
  {provide: Server, useClass: ExpressServer},
  {provide: Logger, useClass: ConsoleLogger},
];

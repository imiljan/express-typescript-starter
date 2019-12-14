import config from 'config';
import http from 'http';
import { createConnection } from 'typeorm';

import app from './app';
import { CacheService } from './services/CacheService';

const serverConfig = config.get<any>('server');

createConnection()
  .then(() => {
    // init services
    CacheService.initialize();

    const httpServer = http.createServer(app);
    const port = process.env.PORT || serverConfig.port;

    httpServer.listen({ port }, () => {
      console.log(`Server ready at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

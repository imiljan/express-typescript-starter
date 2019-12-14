import config from 'config';
import http from 'http';
import { createConnection } from 'typeorm';

import app from './app';

const serverConfig = config.get<any>('server');

createConnection()
  .then(() => {
    // init services

    const httpServer = http.createServer(app);
    const port = process.env.PORT || serverConfig.port;

    httpServer.listen({ port }, () => {
      console.log(`Server ready at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

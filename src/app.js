import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { APP_PORT } from './config/app';
import { connectToDB } from './db';
import api from './api';

(async function runApp() {
  const app = express();

  // Add basic middlewares
 
  app.use(cors());
   
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('combined'));
  
// Connect to the database
  await connectToDB();

  // Add routing
  app.use(api);

  const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
})();



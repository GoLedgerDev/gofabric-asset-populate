import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as rateLimit from 'express-rate-limit';

import DataPostRouter from './DataPostRouter';

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;

  memoryStore = new session.MemoryStore();

 
  // Create limiter to requests
  limiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 100 // limit each IP to 100 requests per windowMs
  });

  // Run configuration methods on the Express instgance.
  constructor() {
    this.express = express();
    //this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    if (process.env.LOAD_TEST !== 'true') {
      this.express.use(this.limiter);
    }
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.text());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    const router = express.Router();
    const options: cors.CorsOptions = {
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
        'aircompany'
      ],
      credentials: true,
      methods: 'GET,POST,PUT,DELETE',
      origin: '*',
      preflightContinue: false
    };

    // use cors middleware
    this.express.use(cors(options));

    // enable pre-flight
    this.express.options('*', cors(options));

    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'online'
      });
    });

    this.express.use('/', DataPostRouter);
  }
}

export default new App().express;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const DataPostRouter_1 = require("./DataPostRouter");
// Creates and configures an ExpressJS web server.
class App {
    // Run configuration methods on the Express instgance.
    constructor() {
        this.memoryStore = new session.MemoryStore();
        // Create limiter to requests
        this.limiter = rateLimit({
            windowMs: 60000,
            max: 100 // limit each IP to 100 requests per windowMs
        });
        this.express = express();
        //this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        if (process.env.LOAD_TEST !== 'true') {
            this.express.use(this.limiter);
        }
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.text());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }
    // Configure API endpoints.
    routes() {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        const router = express.Router();
        const options = {
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
        this.express.use('/', DataPostRouter_1.default);
    }
}
exports.default = new App().express;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const axiosApi = axios_1.default.create({
// baseURL: process.env.URL,
// headers: { 'content-type': 'application/x-www-form-urlencoded' },
});
exports.default = axiosApi;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axiosorderers_1 = require("./axiosorderers");
const express_1 = require("express");
class DataPostRouter {
    constructor() {
        /**
         * Create a new Operator by CNPJ
         */
        this.createPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query.url || !req.query.type || !req.query.n0 ||
                !req.query.noneA || !req.query.noneB || !req.query.lightA || !req.query.lightB || !req.query.mediumA || !req.query.mediumB ||
                !req.query.hardA || !req.query.hardB || !req.query.decA || !req.query.decB) {
                res.statusMessage = 'Missing param. Ex: /create?url=http://${HOST}&type=foundationVolunteer&n0=2000&lightA=100&mediumA=50';
                return res.status(500).end();
            }
            const url = req.query.url;
            const prop = req.query.type;
            const n0 = parseInt(req.query.n0);
            const noneA = parseInt(req.query.noneA);
            const noneB = parseInt(req.query.noneB);
            const lightA = parseInt(req.query.lightA);
            const lightB = parseInt(req.query.lightB);
            const mediumA = parseInt(req.query.mediumA);
            const mediumB = parseInt(req.query.mediumB);
            const hardA = parseInt(req.query.hardA);
            const hardB = parseInt(req.query.hardB);
            const decA = parseInt(req.query.decA);
            const decB = parseInt(req.query.decB);
            const n1 = n0 + noneA + noneB + lightA + lightB + mediumA + mediumB + hardA + hardB + decA + decB - 1;
            const assetType = req.query.type;
            const date0 = new Date();
            console.log("Initial time: ", date0);
            const limit = 1000;
            var i0 = n0;
            var i1 = (n0 + limit) > n1 ? n1 : n0 + limit;
            var results = { errors: [], results: [], anonErrors: [], anonResults: [], vacErrors: [], vacResults: [], symptErrors: [], symptResults: [] };
            // Register volunteer data (non private)
            for (; i0 <= n1 && i1 <= n1 + limit; i0 += limit, i1 += limit) {
                var promises = [];
                var ii1 = i1;
                if (i1 > n1)
                    ii1 = n1;
                for (var i = i0; i <= ii1; i++) {
                    const n = ("000000000" + i).substr(5);
                    var assetObj = { '@assetType': req.query.type };
                    assetObj["cpf"] = n;
                    assetObj["name"] = this.randName(n);
                    assetObj["contact"] = "+55 11 9" + ("000000000" + i).substr(8);
                    promises.push(axiosorderers_1.default.post(url + '/api/invoke/createAsset', {
                        asset: [assetObj],
                    }, { timeout: 300000 }));
                }
            }
            var promiseRes = yield this.executeAllPromises(promises, prop);
            results.errors.push(promiseRes.errors);
            results.results.push(promiseRes.results);
            var i0 = n0;
            var i1 = (n0 + limit) > n1 ? n1 : n0 + limit;
            for (var j = 0; i0 <= n1 && i1 <= n1 + limit; i0 += limit, i1 += limit) {
                var anonPromises = [];
                var ii1 = i1;
                if (i1 > n1)
                    ii1 = n1;
                for (var i = i0; i <= ii1; i++, j++) {
                    const n = ("000000000" + i).substr(5);
                    var assetObj = { '@assetType': "anonymousVolunteer" };
                    assetObj["id"] = n;
                    var volunteerObj = promiseRes.results[j];
                    if (volunteerObj && volunteerObj["asset"] && volunteerObj["asset"][0]) {
                        assetObj[assetType] = volunteerObj["asset"][0];
                    }
                    anonPromises.push(axiosorderers_1.default.post(url + '/api/invoke/createAsset', {
                        asset: [assetObj],
                    }, { timeout: 300000 }));
                }
            }
            var anonPromiseRes = yield this.executeAllPromises(anonPromises, "anonymousVolunteer");
            results.anonErrors.push(anonPromiseRes.errors);
            results.anonResults.push(anonPromiseRes.results);
            var i0 = n0;
            var i1 = (n0 + limit) > n1 ? n1 : n0 + limit;
            // Update volunteer group for immunization
            for (var j = 0; i0 <= n1 && i1 <= n1 + limit; i0 += limit, i1 += limit, j++) {
                var groupUpdatePromises = [];
                var ii1 = i1;
                if (i1 > n1)
                    ii1 = n1;
                for (var i = i0; i <= ii1; i++, j++) {
                    var group = 'A';
                    if (j >= noneA + lightA + mediumA + hardA + decA) {
                        group = 'B';
                    }
                    const n = ("000000000" + i).substr(5);
                    var assetObj = { '@assetType': "anonymousVolunteer" };
                    assetObj["id"] = n;
                    assetObj["group"] = group;
                    groupUpdatePromises.push(axiosorderers_1.default.post(url + '/api/invoke/updateAsset', {
                        update: assetObj,
                    }, { timeout: 300000 }));
                }
                var groupUpdatePromisesRes = yield this.executeAllPromises(groupUpdatePromises, "anonymousVolunteer");
                results.vacErrors.push(groupUpdatePromisesRes.errors);
                results.vacResults.push(groupUpdatePromisesRes.results);
            }
            var i0 = n0;
            var i1 = (n0 + limit) > n1 ? n1 : n0 + limit;
            // Update volunteer group for immunization
            for (var j = 0; i0 <= n1 && i1 <= n1 + limit; i0 += limit, i1 += limit) {
                var symptUpdatePromises = [];
                var ii1 = i1;
                if (i1 > n1)
                    ii1 = n1;
                for (var i = i0; i <= ii1; i++, j++) {
                    var sympton = 'NONE--';
                    if (j < noneA) {
                        sympton = 'NONE';
                    }
                    else if (j < noneA + lightA) {
                        sympton = 'LIGHT';
                    }
                    else if (j >= noneA + lightA && j < noneA + lightA + mediumA) {
                        sympton = 'MEDIUM';
                    }
                    else if (j >= noneA + lightA + mediumA && j < noneA + lightA + mediumA + hardA) {
                        sympton = 'HARD';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA && j < noneA + lightA + mediumA + hardA + decA) {
                        sympton = 'DECEASED';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA + decA && j < noneA + lightA + mediumA + hardA + decA + noneB) {
                        sympton = 'NONE';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA + decA + noneB && j < noneA + lightA + mediumA + hardA + decA + noneB + lightB) {
                        sympton = 'LIGHT';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA + decA + noneB + lightB && j < noneA + lightA + mediumA + hardA + decA + noneB + lightB + mediumB) {
                        sympton = 'MEDIUM';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA + decA + noneB + lightB + mediumB && j < noneA + lightA + mediumA + hardA + decA + noneB + lightB + mediumB + hardB) {
                        sympton = 'HARD';
                    }
                    else if (j >= noneA + lightA + mediumA + hardA + decA + noneB + lightB + mediumB + hardB) {
                        sympton = 'DECEASED';
                    }
                    const n = ("000000000" + i).substr(5);
                    var assetObj = { '@assetType': "anonymousVolunteer" };
                    assetObj["id"] = n;
                    assetObj["clinicaSymptoms"] = sympton;
                    symptUpdatePromises.push(axiosorderers_1.default.post(url + '/api/invoke/updateAsset', {
                        update: assetObj,
                    }, { timeout: 300000 }));
                }
                var symptUpdatePromisesRes = yield this.executeAllPromises(symptUpdatePromises, "anonymousVolunteer");
                results.symptErrors.push(symptUpdatePromisesRes.errors);
                results.symptResults.push(symptUpdatePromisesRes.results);
            }
            const date1 = new Date();
            console.log("Final time: ", date1);
            const diffTime = Math.abs(date1 - date0);
            const diffMin = diffTime / (1000);
            var nErrors = 0;
            results.errors.forEach(a => nErrors += a.length);
            var nResults = 0;
            results.results.forEach(a => nResults += a.length);
            results.anonErrors.forEach(a => nErrors += a.length);
            results.anonResults.forEach(a => nResults += a.length);
            results.vacErrors.forEach(a => nErrors += a.length);
            results.vacResults.forEach(a => nResults += a.length);
            res.send({ results: results.results.map(res => res),
                errors: results.errors.map(err => err),
                anonResults: results.anonResults.map(res => res),
                anonErrors: results.anonErrors.map(err => err),
                time: diffMin + " s",
                averageTime: diffMin / (n1 - n0 + 1) + " s",
                nErrors: nErrors,
                nResults: nResults,
                transPerSec: (n1 - n0 + 1) / diffMin,
                successTransPerSec: nResults / diffMin,
            });
        });
        this.router = express_1.Router();
    }
    randName(id) {
        const firstNames = ['MARCOS', 'CARLOS', 'IVO', 'LUCAS', 'MATEUS', 'ANA', 'CARLA', 'MIRELA', 'JOANA', 'SIMONE'];
        const middleNames = ['SENA', 'GARCIA', 'LIMA', 'MIRANDA', 'ISNARD', 'LUZ', 'REGO', 'ORTEGA', 'LEVI', 'MESSIAS'];
        const lastNames = [
            'DA SILVA',
            'PEREIRA',
            'TEXEIRA',
            'DA COSTA',
            'DE ALMEIDA',
            'ARRAES',
            'RIBEIRO',
            'MARTINS',
            'PESSOA',
            'DE MELO'
        ];
        var i0 = (Number(id.charAt(0)) + Number(id.charAt(3))) % 10;
        var i1 = (Number(id.charAt(1)) + Number(id.charAt(4))) % 10;
        var i2 = (Number(id.charAt(2)) + Number(id.charAt(5))) % 10;
        var sum = i0 + i1 + i2;
        var nome = firstNames[i0] + ' ' + middleNames[i1] + ' ' + lastNames[i2];
        return nome;
    }
    executeAllPromises(promises, prop) {
        // Wrap all Promises in a Promise that will always "resolve"
        var resolvingPromises = promises.map(function (promise) {
            return new Promise(function (resolve) {
                var payload = new Array(2);
                promise.then(function (result) {
                    payload[0] = result;
                })
                    .catch(function (error) {
                    payload[1] = error;
                })
                    .then(function () {
                    /*
                     * The wrapped Promise returns an array:
                     * The first position in the array holds the result (if any)
                     * The second position in the array holds the error (if any)
                     */
                    resolve(payload);
                });
            });
        });
        var errors = [];
        var results = [];
        // Execute all wrapped Promises
        return Promise.all(resolvingPromises)
            .then(function (items) {
            items.forEach(function (payload) {
                if (payload[1]) {
                    var obj = {};
                    var errObj = {};
                    try {
                        obj = JSON.parse(payload[1].config.data);
                        errObj = { prop: obj.asset[0][prop], err: payload[1].response ? payload[1].response.data : "", msg: payload[1].message };
                    }
                    catch (_a) { }
                    errors.push(errObj);
                }
                else {
                    var obj = {};
                    var resObj = {};
                    try {
                        resObj = { prop: payload[0].data[0].cpf, asset: payload[0].data };
                    }
                    catch (_b) { }
                    results.push(resObj);
                }
            });
            return {
                errors: errors,
                results: results
            };
        });
    }
    init() {
        this.router.get('/create', this.createPost);
    }
}
const dataPostRouter = new DataPostRouter();
dataPostRouter.init();
exports.default = dataPostRouter.router;

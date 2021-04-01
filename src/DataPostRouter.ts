import axiosApi from './axiosorderers';
import * as qs from 'qs';
import { Router, Request, Response, NextFunction } from 'express';



class DataPostRouter {
    router: Router;

    constructor() {
      this.router = Router();
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
        var resolvingPromises = promises.map(function(promise) {
          return new Promise(function(resolve) {
            var payload = new Array(2);
            promise.then(function(result) {
                payload[0] = result;
              })
              .catch(function(error) {
                payload[1] = error;
              })
              .then(function() {
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
          .then(function(items) {
            items.forEach(function(payload) {
              if (payload[1]) {

                var obj:any={};
                var errObj:any = {};
                
                try {
                  obj = JSON.parse(payload[1].config.data);
                  errObj = {prop: obj.asset[0][prop], err: payload[1].response ? payload[1].response.data : "", msg:payload[1].message};
                } catch {}
                
                errors.push(errObj);
              } else {
                var obj:any={};
                var resObj:any = {};

                try {
                  resObj = {prop: payload[0].data[0].cpf, asset: payload[0].data};
                } catch {}

                results.push(resObj);
              }
            });
      
            return {
              errors: errors,
              results: results
            };
          });
      }

    /**
     * Create a new Operator by CNPJ
     */
    createPost = async (req: Request, res: Response, next: NextFunction) => {
    
      if (!req.query.url || !req.query.type ||  !req.query.n0 || !req.query.n1) {
     //     !req.query.noneA || !req.query.noneB || !req.query.lightA || !req.query.lightB || !req.query.mediumA || !req.query.mediumB ||
      //    !req.query.hardA || !req.query.hardB || !req.query.decA || !req.query.decB) {
        res.statusMessage = 'Missing param. Ex: /create?url=http://${HOST}&type=foundationVolunteer&n0=2000&lightA=100&mediumA=50';
        return res.status(500).end();
      }
      const url = req.query.url;
      const prop = req.query.type;
      const n0:number = parseInt(req.query.n0 as string);
  /*    const noneA:number = parseInt(req.query.noneA as string);
      const noneB:number = parseInt(req.query.noneB as string);
      const lightA:number = parseInt(req.query.lightA as string);
      const lightB:number = parseInt(req.query.lightB as string);
      const mediumA:number = parseInt(req.query.mediumA as string);
      const mediumB:number = parseInt(req.query.mediumB as string);
      const hardA:number = parseInt(req.query.hardA as string);
      const hardB:number = parseInt(req.query.hardB as string);
      const decA:number = parseInt(req.query.decA as string);
      const decB:number = parseInt(req.query.decB as string);*/
      const n1:number = parseInt(req.query.n1 as string); //n0+noneA+noneB+lightA+lightB+mediumA+mediumB+hardA+hardB+decA+decB-1;
   

      const assetType = req.query.type as string;

      const date0:any = new Date();
      console.log("Initial time: ", date0);
      const limit:number = 1000;
      var i0 = n0;
      var i1 = (n0+limit)>n1 ? n1 : n0+limit;
      var results = {errors: [], results:[], anonErrors: [], anonResults: [], vacErrors: [], vacResults: [], symptErrors: [], symptResults: []};

      // Register volunteer data (non private)
      for (; i0<=n1 && i1<=n1+limit; i0+=limit, i1+=limit) {
        var promises = [];
        var ii1 = i1
        if (i1>n1) ii1=n1 ;

        for (var i:number=i0; i<=ii1; i++) {
          const n = ("000000000" + i).substr(5);
          var assetObj:object = {'@assetType': req.query.type};
          assetObj["id"] = n as string;
          assetObj["from"] = n as string;
          assetObj["to"] = n as string;
       //   assetObj["name"] = this.randName(n);
        //  assetObj["contact"] = "+55 11 9"+("000000000" + i).substr(8);

          promises.push(axiosApi.post(url+'/api/invoke/createAsset', {
            asset: [assetObj],
          },
          { timeout: 300000 }
          ));
        }
      }

      var promiseRes = await this.executeAllPromises(promises, prop);

      results.errors.push(promiseRes.errors);
      results.results.push(promiseRes.results);

 /*     var i0 = n0;
      var i1 = (n0+limit)>n1 ? n1 : n0+limit;

      for (var j=0; i0<=n1 && i1<=n1+limit; i0+=limit, i1+=limit) {
        var anonPromises = [];
        var ii1 = i1
        if (i1>n1) ii1=n1 ;

        for (var i:number=i0; i<=ii1; i++, j++) {
          const n = ("000000000" + i).substr(5);
          var assetObj:object = {'@assetType': "anonymousVolunteer"};
          assetObj["id"] = n;

          var volunteerObj:object = promiseRes.results[j];
          if (volunteerObj && volunteerObj["asset"] && volunteerObj["asset"][0]) {
            assetObj[assetType] = volunteerObj["asset"][0];
          }

          anonPromises.push(axiosApi.post(url+'/api/invoke/createAsset', {
            asset: [assetObj],
          },
          { timeout: 300000 }
          ));
        }
      }
      
      var anonPromiseRes = await this.executeAllPromises(anonPromises, "anonymousVolunteer");

      results.anonErrors.push(anonPromiseRes.errors);
      results.anonResults.push(anonPromiseRes.results);
     
      var i0 = n0;
      var i1 = (n0+limit)>n1 ? n1 : n0+limit;

      // Update volunteer group for immunization
      for (var j=0; i0<=n1 && i1<=n1+limit; i0+=limit, i1+=limit, j++) {
        var groupUpdatePromises = [];
        var ii1 = i1
        if (i1>n1) ii1=n1 ;
        for (var i:number=i0; i<=ii1; i++, j++) {
          var group='A'
          if (j>=noneA+lightA+mediumA+hardA+decA) {
            group = 'B'
          } 
          const n = ("000000000" + i).substr(5);
          var assetObj:object = {'@assetType': "anonymousVolunteer"};
          assetObj["id"] = n;
          assetObj["group"] = group;

          groupUpdatePromises.push(axiosApi.post(url+'/api/invoke/updateAsset', {
            update: assetObj,
          },
          { timeout: 300000 }
          ));
        }
      var groupUpdatePromisesRes = await this.executeAllPromises(groupUpdatePromises, "anonymousVolunteer");

      results.vacErrors.push(groupUpdatePromisesRes.errors);
      results.vacResults.push(groupUpdatePromisesRes.results);
      }
    

      var i0 = n0;
      var i1 = (n0+limit)>n1 ? n1 : n0+limit;

      // Update volunteer group for immunization
      for (var j=0; i0<=n1 && i1<=n1+limit; i0+=limit, i1+=limit) {
   
        var symptUpdatePromises = [];
        var ii1 = i1
        if (i1>n1) ii1=n1 ;
        for (var i:number=i0; i<=ii1; i++, j++) {
          var sympton = 'NONE--';
          if (j<noneA) {
            sympton = 'NONE';
          } else if (j<noneA+lightA) {
            sympton = 'LIGHT';
          } else if (j>=noneA+lightA && j<noneA+lightA+mediumA) {
            sympton = 'MEDIUM';
          } else if (j>=noneA+lightA+mediumA && j<noneA+lightA+mediumA+hardA) {
            sympton = 'HARD';          
          } else if (j>=noneA+lightA+mediumA+hardA && j<noneA+lightA+mediumA+hardA+decA) {
            sympton = 'DECEASED';          
          } else if (j>=noneA+lightA+mediumA+hardA+decA && j<noneA+lightA+mediumA+hardA+decA+noneB) {
            sympton = 'NONE';
          } else if (j>=noneA+lightA+mediumA+hardA+decA+noneB && j<noneA+lightA+mediumA+hardA+decA+noneB+lightB) {
            sympton = 'LIGHT';
          } else if (j>=noneA+lightA+mediumA+hardA+decA+noneB+lightB && j<noneA+lightA+mediumA+hardA+decA+noneB+lightB+mediumB) {
            sympton = 'MEDIUM';          
          } else if (j>=noneA+lightA+mediumA+hardA+decA+noneB+lightB+mediumB && j<noneA+lightA+mediumA+hardA+decA+noneB+lightB+mediumB+hardB) {
            sympton = 'HARD';          
          } else if (j>=noneA+lightA+mediumA+hardA+decA+noneB+lightB+mediumB+hardB) {
            sympton = 'DECEASED';          
          }

          const n = ("000000000" + i).substr(5);
          var assetObj:object = {'@assetType': "anonymousVolunteer"};
          assetObj["id"] = n;
          assetObj["clinicaSymptoms"] = sympton;

          symptUpdatePromises.push(axiosApi.post(url+'/api/invoke/updateAsset', {
            update: assetObj,
          },
          { timeout: 300000 }
          ));
        }

     
      var symptUpdatePromisesRes = await this.executeAllPromises(symptUpdatePromises, "anonymousVolunteer");

      results.symptErrors.push(symptUpdatePromisesRes.errors);
      results.symptResults.push(symptUpdatePromisesRes.results);
      }

*/
    const date1:any = new Date();
    console.log("Final time: ", date1);

    const diffTime:number = Math.abs(date1 - date0);
    const diffMin = diffTime / ( 1000 ); 

    var nErrors = 0;
    results.errors.forEach(a => nErrors+=a.length);
    var nResults = 0;
    results.results.forEach(a => nResults+=a.length);
    results.anonErrors.forEach(a => nErrors+=a.length);
    results.anonResults.forEach(a => nResults+=a.length);
    results.vacErrors.forEach(a => nErrors+=a.length);
    results.vacResults.forEach(a => nResults+=a.length);
   
    res.send({  results: results.results.map(res => res), 
                errors: results.errors.map(err => err),
                anonResults: results.anonResults.map(res => res),
                anonErrors: results.anonErrors.map(err => err),
               

                time: diffMin+" s",
                averageTime: diffMin/(n1-n0+1)+" s",
                nErrors: nErrors,
                nResults: nResults,
                transPerSec: (n1-n0+1)/diffMin,
                successTransPerSec: nResults/diffMin,
            });
    }

    init() {
      this.router.get('/create', this.createPost);
    }

}


const dataPostRouter = new DataPostRouter();
dataPostRouter.init();

export default dataPostRouter.router;

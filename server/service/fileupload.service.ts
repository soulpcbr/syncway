import { createReadStream } from 'fs';
import Loop from '../models/loop';
const fetch = require('node-fetch');
const FormData = require('form-data');
const populate = require('form-data/lib/populate');
const request = require('request');
const parseUrl = require('url').parse;

/**
 * Created by icastilho on 23/05/17.
 */

export class SyncwayFileUpload {

   static async upload(loop: Loop) {
      console.log('Upload:', loop.arquivo);
      const form = new FormData();

      try {

         if (loop.arquivo.match('^https?://')) {
            console.log('Upload2:')
            request(loop.arquivo, (error, response, body) => {
               if (error) {
                  console.log('error:', error); // Print the error if one occurred
               }
               console.log('[GET IMAGE] statusCode:', response && response.statusCode);
               console.log('[GET IMAGE] content-type:', response.headers['content-type'] );

               form.append('fileToUpload',  body);
            });

            console.log('Upload3:');
         } else {
            form.append('fileToUpload',  createReadStream(loop.arquivo));
         }
         if (loop.data) {
            const obj = JSON.parse(loop.data);
            const keys = Object.keys(obj);
            await keys.forEach((key, index, array) => {
               form.append(key, obj[key]);
            });
         }
         const params = parseUrl(loop.api);

         return await new Promise((resolve, reject) => {
            form.submit({
               port: params.port,
               path: params.pathname,
               host: params.hostname,
               method: loop.method.toLowerCase(),
            }, function(err, res) {
               if (err) {
                  reject(err);
               }

               if (!/^application\/json/.test(res.headers['content-type'])) {
                  reject(new Error(`Invalid content-type.\n` +
                     `Expected application/json but received ${res.headers['content-type']}`));
               }
               if (res) {
                 let rawData = '';
                 res.on('data', (chunk) => {
                    rawData += chunk;
                 });
                 res.on('end', () => {
                    try {
                       const parsedData = JSON.parse(rawData);
                       resolve(parsedData.delay);
                    } catch (e) {
                       console.error(e.message);
                       reject();
                    }
                 });
               }
            });
         });
      } catch (err) {
         throw  err;
      }
   }
}




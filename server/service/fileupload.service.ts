import { createReadStream } from 'fs';
import Loop from '../models/loop';
const fetch = require('node-fetch');
const FormData = require('form-data');
const request = require('request');
const parseUrl = require('url').parse;

/**
 * Created by icastilho on 23/05/17.
 */

export class SyncwayFileUpload {

   static async upload(loop: Loop) {

      console.log('Upload:', loop.arquivo);
      const form = new FormData();

      if (loop.arquivo.match('^https?://')) {
         form.append('fileToUpload',  request(loop.arquivo));
      } else {
         form.append('fileToUpload',  createReadStream(loop.arquivo));
      }
      form.append('submit',  'submit');

      const params = parseUrl(loop.api);
     return new Promise((resolve, reject) => {
         form.submit({
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            method: loop.method.toLowerCase()
         }, function(err, res) {
            if (err) {
               reject(err);
            }
            console.log(res.headers['content-type'])
            res.on('data', (chunk) => {
               console.log(`BODY: ${chunk}`);
               resolve(loop.delay_main + 1000);
            });
         });
      });

   }

}




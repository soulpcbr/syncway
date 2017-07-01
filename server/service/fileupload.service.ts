import {createReadStream} from 'fs';
import Loop from '../models/loop';
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const http = require('http');
const download = require('image-downloader');
const parseUrl = require('url').parse;

/**
 * Created by icastilho on 23/05/17.
 */
export const D_PATH = 'download/';
export class SyncwayFileUpload {

   static async upload(loop: Loop) {
      console.log(`[FILE UPLOAD] ${loop.nome} :: ${loop.arquivo}` );
      await this.createForm(loop)
         .then((form: FormData) => this.submitFile(form, loop))
         .catch((err) => {
            console.error(`[FILE UPLOAD] ${loop.nome} UNESPECTED ERROR:: `, err.message);
            throw  err;
         });

   }

   static createForm(loop: Loop): Promise<FormData> {

       return new Promise( async (resolve, reject) => {
         const form = new FormData();

            if (loop.data) {
               const obj = JSON.parse(loop.data);
               const keys = Object.keys(obj);
               keys.forEach((key, index, array) => {
                  form.append(key, obj[key]);
               });
            }

            if (loop.arquivo.match('^https?://')) {
               if (!fs.existsSync(`${D_PATH}`)) {
                  fs.mkdirSync(`${D_PATH}`);
               }
               const pathname = new Date().getTime();
               fs.mkdirSync(`${D_PATH}${pathname}`);
               const filename = await this.downloadIMG({
                  url: loop.arquivo,
                  dest: D_PATH + pathname,
               });
               loop.pathname = D_PATH + pathname;
               form.append('fileToUpload', createReadStream(filename));
               resolve(form);
            } else {
               console.log('else');
               form.append('fileToUpload', createReadStream(loop.arquivo));
               loop.pathname = loop.arquivo;
               resolve(form);
            }
      });
   }

   static async downloadIMG(options) {
      try {
         console.log(`[DOWNLOADING FILE]  :: ${options.url}` );
         const { filename, image } = await download.image(options);
         return filename;
      } catch (e) {
         throw e;
      }
   }


   static submitFile(form, loop: Loop) {
      return new Promise((resolve, reject) => {
         const params = parseUrl(loop.api);
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
               console.error(`Invalid content-type.\n Expected application/json but received ${res.headers['content-type']}`);
            }
            if (res) {
               let rawData = '';
               res.on('data', (chunk) => {
                  rawData += chunk;
               });
               res.on('end', () => {
                  try {
                     console.log(`[FILE UPLOAD] ${loop.nome} Response::`, rawData);
                     const parsedData = JSON.parse(rawData);
                     resolve(parsedData.delay);
                  } catch (e) {
                     console.error(`[FILE UPLOAD] ${loop.nome} ERROR:: `, e);
                     reject(e);
                  }
               });
            }
         });
      });
   }

}




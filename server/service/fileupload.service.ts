import {createReadStream} from 'fs';
import Loop from '../models/loop';

const FormData = require('form-data');
const fs = require('fs');
const download = require('image-downloader');
const parseUrl = require('url').parse;

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
console.log(ffmpeg.path, ffmpeg.version);


/**
 * Created by icastilho on 23/05/17. */
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
         let form = new FormData();

            if (loop.data) {
               const obj = JSON.parse(loop.data);
               const keys = Object.keys(obj);
               keys.forEach((key, index, array) => {
                  form.append(key, obj[key]);
               });
            }
            try {
               if (loop.arquivo.match('^https?://')) {
                  form = this.downloadImage(loop, form, this.downloadHttps);
                  resolve(form);
               } else if (loop.arquivo.match('^rtsp?://')) {
                  form = this.downloadImage(loop, form, this.downloadRtsp);
                  resolve(form);
               } else {
                  console.log('else');
                  form.append('fileToUpload', createReadStream(loop.arquivo));
                  loop.pathname = loop.arquivo;
                  resolve(form);
               }
            } catch (err) {
               reject(err);
            }
      });
   }

   static async downloadImage(loop: Loop, form: FormData, fdonwload: any) {
      if (!fs.existsSync(`${D_PATH}`)) {
         fs.mkdirSync(`${D_PATH}`);
      }
      const pathname = new Date().getTime();
      fs.mkdirSync(`${D_PATH}${pathname}`);
      const filename = await fdonwload({
         url: loop.arquivo,
         dest: D_PATH + pathname,
      });
      loop.pathname = D_PATH + pathname;
      form.append('fileToUpload', filename);
      return form;
   }

   static async downloadHttps(options) {
      try {
         console.log(`[DOWNLOADING FILE]  :: ${options.url}` );
         const { filename, image } = await download.image(options);
         return filename;
      } catch (e) {
         throw e;
      }
   }

   static async downloadRtsp(options) {
      console.log(`[DOWNLOADING RTSP] BEGAN :: ${options.url}`);
      const timestamp = new Date().getTime();
      const fileName = `/fileName${timestamp}.png`;
      // const path = `${options.dest}`;
      return new Promise((resolve, reject) => {
         const command = ffmpeg(options.url)
            .outputOptions(['-vf', 'fps=1'])
            .duration(process.env.RTSP_LOAD_DURATION || 1)
            .on('start', () => {
               console.log('[DOWNLOADING RTSP] STARTING :: ');
            })
            .on('end', (filen) => {
               console.log(`[DOWNLOADING RTSP] ENDED :: ${fileName}`);
               resolve(options.dest + fileName);
            })
            .on('finish', (filen) => {
               console.log(`[DOWNLOADING RTSP] FINISHED :: ${fileName}`);
               resolve(fileName);
            })
/*           .on('filenames', (filenames) => {
             console.log('`[DOWNLOADING RTSP] SCREENSHOTS ' + filenames.join(', '));
             path = path + filenames[0];
           })*/
            .on('error', (error, stdout, stderr) => {
                console.log('ffmpeg stdout:\n' + stdout);
                console.log('ffmpeg stderr:\n' + stderr);
               reject(error);
            })
           .saveToFile(options.dest + fileName);
           // .takeScreenshots({count: 1,  timemarks: [ '2', '2' ], filename: fileName}, options.dest);
      });
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




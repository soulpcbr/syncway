import * as Loki from 'lokijs';
import {isNullOrUndefined} from 'util';
import * as chokidar from 'chokidar';

/**
 * Created by icastilho on 20/05/17.
 */


const DB_NAME = '.db.json';
const DB_PATH = 'data';

abstract class BaseCtrl<T> {

   model: T;
   private db: Loki;
   protected coll: Loki.Collection;
   private watcher;

   constructor() {
      this.db = new Loki(`${DB_PATH}/${this.getName()}${DB_NAME}`, {
         verbose: true,
         persistenceMethod: 'fs',
         autoload: true,
         autoloadCallback : () => this.loadHandler()
      });

      console.log(':: Init DB ', this.getName() + DB_NAME);
   }

   /**
    * Insert
    * @param req
    * @param res
    */
   insert = (req, res) => {
      console.log('Insert: ', this.getName());
      if (!req.body) {
         res.sendStatus(400);
         return;
      }

      this.beforSave(req.body).then((data) => {
         this.model = this.coll.insertOne(data);
         this.db.saveDatabase();
         if (isNullOrUndefined(this.model)) {
            res.sendStatus(400);
            return;
         }
         res.status(200).json(this.model);
      });
   }

   /**
    * Get All
    * @param req
    * @param res
    */
   getAll = (req, res) => {
      res.json(this.coll.data);
   }

   /**
    * Get One by id
    * @param req
    * @param res
    */
   get = (req, res) => {
      res.json(this.coll.get(req.params.id));
   }


   protected findOne = (param): Promise<T> => {
      const data = <T>this.coll.findOne(param);
      return Promise.resolve(data);
   }

   /**
    * Count all
    * @param req
    * @param res
    */
   count = (req, res) => {
      res.json(this.coll.data.length);
   }

   // Update by id
   update = (req, res) => {
      console.log(`Update: ${this.getName()} - ${req.body.$loki}`);
      if (!req.body || !req.body.$loki) {
         res.sendStatus(400);
         return;
      }
      this.coll.update(req.body);
      this.db.saveDatabase();
      res.status(200).json(this.model);
   }

   // Delete by id
   delete = (req, res) => {
      console.log(`Delete ${this.getName()} id: ${req.params.id}` );
      if (!req.params.id) {
         res.sendStatus(400);
         return;
      }
      const doc = this.coll.get(req.params.id);
      this.coll.remove(doc);
      this.db.saveDatabase();
      console.log(`Deleted Col ${this.getName()} - id: ${req.body}`);
      res.sendStatus(200);
   }

   private loadHandler() {
     // if database did not exist it will be empty so I will intitialize here
      this.loadCollection(() => {});

      this.watcher = chokidar.watch(`${DB_PATH}/${this.getName()}${DB_NAME}`, {ignored: /(^|[\/\\])\../, interval: 1})
      this.watcher.on('change', path => {
         console.log(`File ${path} has been changed`);
         this.db.loadDatabase({}, () => {
            console.log('reload: ', this.getName());
            this.coll =  this.db.getCollection(this.getName());
         });
         this.watcher.unwatch(`${DB_PATH}/${this.getName()}${DB_NAME}`);
         this.watcher.add(`${DB_PATH}/${this.getName()}${DB_NAME}`);
      });

   }

   private loadCollection(callback) { console.log('LoadCollection:', this.getName())
      this.coll = this.db.getCollection(this.getName());
      if (this.coll === null) {
         this.coll = this.db.addCollection(this.getName(), this.getCollectionOption());
      }
      this.coll.on('error', (err) => console.error('Error Load Coll: ',  this.getName(), err));
      callback();
   }

   /**
    * Function to execute before save
    * @returns {Promise<boolean>}
    */
   beforSave(data: T): Promise<any> {
      return Promise.resolve(data);
   }

   getCollectionOption() {
      return {};
   }

   abstract getName(): string;

}

export default BaseCtrl;


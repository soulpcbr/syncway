import * as Loki from 'lokijs';
import * as chokidar from 'chokidar';
import {setTimeout} from "timers";
/**
 * Created by icastilho on 22/05/17.
 */

const DB_NAME = '.db.json';
const DB_PATH = 'data';
abstract class BaseService<T extends Model> {

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
   insert = (obj: T): Promise<T> => {
      console.log('Insert: ', this.getName());
      this.stopwatch();
      return new Promise((resolve, reject) => {
         this.beforSave(obj).then((data) => {
            this.model = this.coll.insertOne(data);
            this.db.saveDatabase();
            resolve(this.model);
            this.addWatch();
         });
      });
   }

   /**
    * Get All
    * @param req
    * @param res
    */
   getAll = (): Promise<T> => {
      return Promise.resolve(this.coll.data);
   }

   /**
    * Get One by id
    * @param req
    * @param res
    */
   get = (id: number): Promise<T> => {
      return Promise.resolve(this.coll.get(id));
   }


   findOne = (param): Promise<T> => {
      const data = <T>this.coll.findOne(param);
      return Promise.resolve(data);
   }

   /**
    * Count all
    * @param req
    * @param res
    */
   count = (): Promise<number> => {
      return Promise.resolve(this.coll.data.length);
   }

   // Update by id
   update = (obj): Promise<T> => {
      this.stopwatch();
      this.coll.update(obj);
      this.db.saveDatabase();
      setTimeout(() => this.addWatch(), 300);
      return Promise.resolve(this.model);
   }

   // Delete by id
   delete = (doc): Promise<boolean> => {
      this.stopwatch();
      this.coll.remove(doc);
      this.db.saveDatabase();
      console.log(`Deleted Col ${this.getName()} - id: ${doc.id}`);
      this.addWatch();
      return Promise.resolve(true);
   }

   private loadHandler() {
      // if database did not exist it will be empty so I will intitialize here
      this.loadCollection(() => {});

      this.watcher = chokidar.watch(`${DB_PATH}/${this.getName()}${DB_NAME}`, {ignored: /(^|[\/\\])\../, interval: 1});
      this.watcher.on('change', path => {
         console.log(`File ${path} has been changed`);
         this.db.loadDatabase({}, () => {
            console.log('reload: ', this.getName());
            this.coll =  this.db.getCollection(this.getName());
         });
        this.stopwatch();
        this.addWatch();
      });

   }
   private stopwatch() {
      this.watcher.unwatch(`${DB_PATH}/${this.getName()}${DB_NAME}`);
   }
   private addWatch() {
      this.watcher.add(`${DB_PATH}/${this.getName()}${DB_NAME}`);
   }

   private loadCollection(callback) { console.log('LoadCollection:', this.getName());
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

export default BaseService;

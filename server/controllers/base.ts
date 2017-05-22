import {isNullOrUndefined} from 'util';
import BaseService from '../service/base.service';

/**
 * Created by icastilho on 20/05/17.
 */


abstract class BaseCtrl<S extends BaseService<T>, T> {

   service: S;

   constructor(s: S) {
      this.service = s;
   }

   /**
    * Insert
    * @param req
    * @param res
    */
   insert = (req, res) => {
      console.log('Insert: ', this.service.getName());
      if (!req.body) {
         res.sendStatus(400);
         return;
      }

      this.service.insert(req.body).then((value) => {
         if (isNullOrUndefined(value)) {
            res.sendStatus(400);
            return;
         }
         res.status(200).json(value);
      });
   }

   /**
    * Get All
    * @param req
    * @param res
    */
   getAll = (req, res) => {
      this.service.getAll().then(obj => res.json(obj));
   }

   /**
    * Get One by id
    * @param req
    * @param res
    */
   get = (req, res) => {
      this.service.get(req.params.id).then(obj => res.json(obj));
   }


   /**
    * Count all
    * @param req
    * @param res
    */
   count = (req, res) => {
      this.service.count().then(length => res.json(length));
   }

   // Update by id
   update = (req, res) => {
      console.log(`Update: ${this.service.getName()} - ${req.body.$loki}`);
      if (!req.body || !req.body.$loki) {
         res.sendStatus(400);
         return;
      }
      this.service.update(req.body).then((obj) => res.status(200).json(obj));
   }

   // Delete by id
   delete = (req, res) => {
      console.log(`Delete ${this.service.getName()} id: ${req.params.id}` );
      if (!req.params.id) {
         res.sendStatus(400);
         return;
      }
      this.service.get(req.params.id).then((doc) => {
         this.service.delete(doc).then((value) => {
            if (value) {
               res.sendStatus(200);
            } else {
               res.sendStatus(400);
            }
         });
      });

   }
}

export default BaseCtrl;


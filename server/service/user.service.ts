import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import BaseService from './base.service';
/**
 * Created by icastilho on 22/05/17.
 */


export class UserService extends BaseService<User> {

   getName(): string {
      return 'user';
   }

   beforSave(data: User): Promise<any> {
      return new Promise((resolve, reject) => {
         bcrypt.genSalt(10, function (err, salt) {
            if (err) {
               return reject(err);
            }
            bcrypt.hash(data.password, salt, function (error, hash) {
               if (error) {
                  return reject(error);
               }
               data.password = hash;
               return  resolve(data);
            });
         });
      });
   };

   comparePassword = function(candidatePassword, password,  callback) {
      bcrypt.compare(candidatePassword, password, function(err, isMatch) {
         if (err) { return callback(err); }
         callback(null, isMatch);
      });
   };
}


let service: UserService;
export default function userService() {
   if (!service) {
      service = new UserService();
   }
   return service;
}


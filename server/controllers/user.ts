import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import BaseCtrl from './base';
import * as bcrypt from 'bcryptjs';

export default class UserCtrl extends BaseCtrl<User> {

  getName(): string {
    return 'user';
  }

  login = (req, res) => {
    this.findOne({ email: req.body.email }).then( (user) => {
      console.log(user);
      if (!user) {
        return res.sendStatus(403);
      }

      this.comparePassword(req.body.password, user.password, (error, isMatch) => {
        if (!isMatch) {
          return res.sendStatus(403);
        }
        const token = jwt.sign({user: user}, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({token: token});
      });
    });
  }

  private comparePassword = function(candidatePassword, password,  callback) {
    bcrypt.compare(candidatePassword, password, function(err, isMatch) {
      if (err) { return callback(err); }
      callback(null, isMatch);
    });
  };

  beforSave(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return reject(err);
        }
        bcrypt.hash(user.password, salt, function (error, hash) {
          if (error) {
            return reject(error);
          }
          user.password = hash;
          return  resolve(user);
        });
      });
    });
  };

}

import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import BaseCtrl from './base';
import {UserService} from '../service/user.service';


export default class UserCtrl extends BaseCtrl<UserService, User> {

  getName(): string {
    return 'user';
  }

  login = (req, res) => {
    this.service.findOne({ email: req.body.email }).then( (user) => {
      console.log(user);
      if (!user) {
        return res.sendStatus(403);
      }

      this.service.comparePassword(req.body.password, user.password, (error, isMatch) => {
        if (!isMatch) {
          return res.sendStatus(403);
        }
        const token = jwt.sign({user: user}, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({token: token});
      });
    });
  }



}

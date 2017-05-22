import BaseService from './base.service';
import Loop from '../models/loop';
/**
 * Created by icastilho on 22/05/17.
 */


export class LoopService extends BaseService<Loop> {
   getName(): string {
      return 'loop';
   }
}

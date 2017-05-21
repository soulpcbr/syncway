import Loop from '../models/loop';
import BaseCtrl from './base';
/**
 * Created by icastilho on 19/05/17.
 */


export default class LoopCtrl extends BaseCtrl<Loop> {

   getName(): string {
      return 'loop';
   }

   getCollectionOption() {
      return {
         disableChangesApi: false
      };
   }

}

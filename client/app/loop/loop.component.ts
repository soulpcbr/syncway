import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { LoopService } from '../services/loop.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
   selector: 'app-loop',
   templateUrl: './loop.component.html',
   styleUrls: ['./loop.component.scss']
})
export class LoopComponent implements OnInit {

   loop = {};
   loops = [];
   isLoading = true;
   isEditing = false;

   addLoopForm: FormGroup;
   nome = new FormControl('', Validators.required);
   arquivo = new FormControl('', Validators.required);
   delay_main = new FormControl('', Validators.required);
   delay_extra = new FormControl('', Validators.required);
   data = new FormControl('');
   method = new FormControl('', Validators.required);
   api = new FormControl('', Validators.required);
   usuario_id = new FormControl('', Validators.required);
   usuario_token = new FormControl('', Validators.required);

   constructor(private loopService: LoopService,
               private formBuilder: FormBuilder,
               public toast: ToastComponent) { }

   ngOnInit() {
      this.getLoops();
      this.addLoopForm = this.formBuilder.group({
         nome: this.nome,
         arquivo: this.arquivo,
         delay_main: this.delay_main,
         delay_extra: this.delay_extra,
         data: this.data,
         method: this.method,
         api: this.api,
         usuario_id: this.usuario_id,
         usuario_token: this.usuario_token,
      });
   }

   getLoops() {
      this.loopService.getLoops().subscribe(
         data => this.loops = data,
         error => console.log(error),
         () => this.isLoading = false
      );
   }

   addLoop() {
      this.loopService.addLoop(this.addLoopForm.value).subscribe(
         res => {
            const newLoop = res.json();
            this.loops.push(newLoop);
            this.addLoopForm.reset();
            this.toast.setMessage('item added successfully.', 'success');
         },
         error => console.log(error)
      );
   }

   enableEditing(loop) {
      this.isEditing = true;
      this.loop = loop; console.log(this.loop);
   }

   cancelEditing() {
      this.isEditing = false;
      this.loop = {};
      this.toast.setMessage('item editing cancelled.', 'warning');
      // reload the loops to reset the editing
      this.getLoops();
   }

   editLoop(loop) {
      this.loopService.editLoop(loop).subscribe(
         res => {
            this.isEditing = false;
            this.loop = loop;
            this.toast.setMessage('item edited successfully.', 'success');
         },
         error => console.log(error)
      );
   }

   deleteLoop(loop) {
      if (window.confirm('Are you sure you want to permanently delete this item?')) {
         this.loopService.deleteLoop(loop).subscribe(
            res => {
               const pos = this.loops.map(elem => { return elem.$loki; }).indexOf(loop.$loki);
               this.loops.splice(pos, 1);
               this.toast.setMessage('item deleted successfully.', 'success');
            },
            error => console.log(error)
         );
      }
   }
}

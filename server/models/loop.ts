/**
 * Created by icastilho on 19/05/17.
 */



/*const loopSchema = new mongoose.Schema({
});

const Loop = mongoose.model('Cat', loopSchema);*/


class Loop {
   nome: string;
   arquivo: string;
   delay_main: number;
   delay_extra: number;
   api: string;
   method: string;
   data: any;
   usuario_id: number;
   usuario_token: string;

}

export default Loop;

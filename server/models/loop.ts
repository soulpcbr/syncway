/**
 * Created by icastilho on 19/05/17.
 */



class Loop {
   /**
    * Nome do registro
    */
   nome: string;
   /**
    * Pode ser um local na maquina ou endereço http(s).
    */
   arquivo: string;

   /**
    * Intervalo de envio recebido do servidor
    */
   delay_main: number;
   /**
    * Intervalo de envio caso não exista delay main
    */
   delay_extra: number;
   /**
    * Endereço que será enviado.
    */
   api: string;
   /**
    * Método de envio ajax.
    */
   method: string;
   /**
    * Dados podem ser até 10 parâmetros
    */
   data: any;
   /**
    * Id Usuário API
    */
   usuario_id: number;
   /**
    * Token usuário API
    */
   usuario_token: string;

}

export default Loop;

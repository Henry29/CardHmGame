import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {
  private socket$: WebSocketSubject<any> | null = null;
  private enlace : String = "ws://";
  private token : String = "";
  private conectado : boolean = false;
  constructor() { }
  Comienzo(url : String, clave : String){
    this.enlace = "ws://" + url;
    this.token = clave;
    this.socket$ = webSocket({
      url: `${this.enlace}?token=${this.token}`,
    });
    this.socket$.subscribe({
      next: () => {
        console.log("Conexión exitosa al WebSocket");
        this.conectado = true;
      },
      error: (err: any) => {
        console.error("Error en la conexión al WebSocket:", err);
        this.conectado = false;
      },
      complete: () => {
        console.log("Conexión WebSocket cerrada");
        this.conectado = false;
      }
    });
  }
  connect(): WebSocketSubject<any> | undefined {
    if (this.socket$ != null) {
      return this.socket$;
    }else{
      return undefined;
    }
  }
  sendMessage(message: string, tipo : String): void {
    if (this.socket$ == null) {
      console.log('el socket no ha comenzado la conexion');
      return;
    }
    if (!this.conectado) {
      console.log('el socket no ha logrado conectarse');
      return;
    }
    this.socket$.next({ type: tipo, data: message });
  }
}

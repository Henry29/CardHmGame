import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketServiceService } from '../servicio/websocket-service.service';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './entrada.component.html',
  styleUrl: './entrada.component.scss'
})
export class EntradaComponent {
  nombrejugador : String = "";
  urlserver : String = "";
  token : String = "";
  conectando : boolean = false;

  @Output() nombreEvt = new EventEmitter<String>();
  constructor (private serv : WebsocketServiceService) { }

  IniciarConexion(){
    this.serv.Comienzo(this.urlserver, this.token);
    this.conectando = true;
    this.nombreEvt.emit(this.nombrejugador);
  }
}

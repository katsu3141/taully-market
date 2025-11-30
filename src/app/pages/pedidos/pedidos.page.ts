// src/app/pages/pedidos/pedidos.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, receiptOutline, cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon
  ]
})
export class PedidosPage {
  constructor() {
    addIcons({ arrowBackOutline, receiptOutline, cartOutline });
  }
  
  // TODO: Implementar lógica de pedidos
  // - Cargar historial de pedidos desde la base de datos
  // - Mostrar estado de cada pedido
  // - Permitir ver detalles de cada pedido
}
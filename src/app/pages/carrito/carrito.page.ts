// src/app/pages/carrito/carrito.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonCard, IonCardContent,
  IonItem, IonLabel, IonInput,
  IonIcon, IonList, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';
import { CarritoService, ItemCarrito } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput,
    IonIcon, IonList, IonButtons
  ]
})
export class CarritoPage implements OnInit {
  carrito: ItemCarrito[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {
    addIcons({ arrowBackOutline, trashOutline });
  }

  ngOnInit() {
    this.carritoService.carrito$.subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  eliminarProducto(productoId: number) {
    this.carritoService.eliminarProducto(productoId);
  }

  actualizarCantidad(productoId: number, event: any) {
    const cantidad = parseInt(event.target.value, 10);
    if (!isNaN(cantidad) && cantidad > 0) {
      this.carritoService.actualizarCantidad(productoId, cantidad);
    }
  }

  getTotalPrecio(): number {
    return this.carritoService.getTotalPrecio();
  }

  volver() {
    this.router.navigate(['/tienda']);
  }

  realizarPedido() {
    // Verificar que hay items en el carrito
    if (this.carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // TODO: Implementar lógica completa de pedido con base de datos
    // Por ahora, mostrar resumen y limpiar carrito
    const total = this.getTotalPrecio();
    const mensaje = `Pedido realizado por S/. ${total.toFixed(2)}\n\nEsta funcionalidad se completará con la integración a la base de datos.`;
    
    if (confirm(mensaje)) {
      this.carritoService.limpiarCarrito();
      this.router.navigate(['/pedidos']);
    }
  }
}
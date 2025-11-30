// src/app/pages/tienda/tienda.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonGrid, IonRow, IonCol,
  IonIcon, IonSearchbar, IonBadge, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, searchOutline } from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Producto } from '../../models/producto.model';
import { CarritoService } from './../../services/carrito.service';
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonGrid, IonRow, IonCol,
    IonIcon, IonSearchbar, IonBadge, IonButtons
  ]
})
export class TiendaPage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';

  constructor(
    private dbService: DatabaseService,
    private carritoService: CarritoService,
    private router: Router
  ) {
    addIcons({ cartOutline, searchOutline });
  }

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    this.productos = await this.dbService.getAllProductos();
    this.productosFiltrados = this.productos;
  }

  buscarProductos(event: any) {
    const termino = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto, 1);
  }

  irACarrito() {
    this.router.navigate(['/carrito']);
  }

  getTotalCarrito(): number {
    return this.carritoService.getTotalItems();
  }
}
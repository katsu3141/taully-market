// src/app/pages/productos-lista/productos-lista.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonFab, IonFabButton, IonGrid, IonRow, IonCol, 
  IonBackButton, IonButtons, IonModal 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, createOutline, trashOutline, cubeOutline,
  addCircleOutline, checkmarkCircle, alertCircle, 
  closeCircle, imageOutline, pricetagOutline, 
  appsOutline, cashOutline, documentTextOutline, eyeOutline,
  closeOutline, calculatorOutline
} from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { Producto } from '../../models/producto.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos-lista.page.html',
  styleUrls: ['./productos-lista.page.scss'],
  standalone: true,
  imports: [
    IonModal, 
    IonButtons, IonBackButton, 
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonFab, IonFabButton, IonGrid, IonRow, IonCol
  ]
})
export class ProductosPage implements OnInit, OnDestroy {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  mostrarModal = false;
  
  private productosSubscription?: Subscription;

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {
    addIcons({
      cubeOutline,
      addCircleOutline,
      checkmarkCircle,
      alertCircle,
      closeCircle,
      imageOutline,
      pricetagOutline,
      createOutline,
      trashOutline,
      addOutline,
      appsOutline,
      cashOutline,
      documentTextOutline,
      eyeOutline,
      closeOutline,
      calculatorOutline
    });
  }

  async ngOnInit() {
    console.log('📋 Inicializando lista de productos...');
    
    // ✅ Suscribirse a cambios automáticos
    this.productosSubscription = this.dbService.productos$.subscribe(productos => {
      console.log(`✅ Productos actualizados: ${productos.length} items`);
      this.productos = productos;
    });
    
    // Cargar productos inicialmente
    await this.cargarProductos();
  }

  ngOnDestroy() {
    // ✅ Limpiar suscripción al destruir el componente
    if (this.productosSubscription) {
      this.productosSubscription.unsubscribe();
      console.log('🧹 Suscripción a productos limpiada');
    }
  }

  /**
   * 🔄 Cargar productos desde la base de datos
   */
  async cargarProductos() {
    console.log('🔄 Cargando productos desde la BD...');
    this.productos = await this.dbService.getAllProductos();
    console.log(`✅ ${this.productos.length} productos cargados`);
  }

  /**
   * 👁️ Ver detalles del producto en modal
   */
  verDetalles(id: number) {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      console.log(`👁️ Mostrando detalles de: ${producto.nombre}`);
      this.productoSeleccionado = producto;
      this.mostrarModal = true;
    } else {
      console.warn(`⚠️ Producto con ID ${id} no encontrado`);
    }
  }

  /**
   * ✏️ Editar producto desde el modal de detalles
   */
  editarDesdeDetalles() {
    if (this.productoSeleccionado?.id) {
      console.log(`✏️ Editando producto: ${this.productoSeleccionado.nombre}`);
      this.cerrarModal();
      this.editarProducto(this.productoSeleccionado.id);
    }
  }

  /**
   * ❌ Cerrar modal de detalles
   */
  cerrarModal() {
    console.log('❌ Cerrando modal de detalles');
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  /**
   * ➕ Navegar a formulario de nuevo producto
   */
  nuevoProducto() {
    console.log('➕ Navegando a nuevo producto');
    this.router.navigate(['/producto-form']);
  }

  /**
   * ✏️ Editar producto existente
   */
  editarProducto(id: number) {
    console.log(`✏️ Navegando a editar producto ID: ${id}`);
    this.router.navigate(['/producto-form', id]);
  }

  /**
   * 🗑️ Eliminar producto con confirmación
   */
  async eliminarProducto(id: number) {
    const producto = this.productos.find(p => p.id === id);
    const nombre = producto?.nombre || 'este producto';
    
    if (confirm(`¿Está seguro de eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        console.log(`🗑️ Eliminando producto ID: ${id}`);
        await this.dbService.eliminarProducto(id);
        console.log('✅ Producto eliminado correctamente');
        // ✅ No necesita recargar manualmente, el observable lo hace automáticamente
      } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        alert('❌ Error al eliminar el producto');
      }
    }
  }

  /**
   * 📊 Contar productos con stock saludable (> 10 unidades)
   */
  contarProductosEnStock(): number {
    return this.productos.filter(p => p.stock > 10).length;
  }

  /**
   * ⚠️ Contar productos con stock bajo (1-10 unidades)
   */
  contarProductosStockBajo(): number {
    return this.productos.filter(p => p.stock > 0 && p.stock <= 10).length;
  }

  /**
   * 💰 Calcular valor total del inventario
   */
  calcularValorTotal(): number {
    return this.productos.reduce((total, p) => total + (p.precio * p.stock), 0);
  }
}
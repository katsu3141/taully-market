// src/app/pages/producto-form/producto-form.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonBackButton, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonList, 
  IonIcon, IonSpinner, IonActionSheet
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cubeOutline, informationCircleOutline, calculatorOutline,
  saveOutline, closeOutline, imageOutline, cameraOutline,
  imagesOutline, trashOutline
} from 'ionicons/icons';
import { DatabaseService } from '../../services/database.service';
import { ImageService } from '../../services/image.service';
import { Producto, CATEGORIAS } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.page.html',
  styleUrls: ['./producto-form.page.scss'],
  standalone: true,
  imports: [
    IonActionSheet, IonSpinner,
    IonList, IonIcon,
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonButton, IonBackButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class ProductoFormPage implements OnInit {
  producto: Producto = {
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen: undefined,
    imagenThumbnail: undefined,
    tieneImagen: false
  };

  categorias = CATEGORIAS;
  modoEdicion = false;
  productoId?: number;
  cargandoImagen = false;
  mostrarOpcionesImagen = false;

  // Botones del Action Sheet
  botonesImagen = [
    {
      text: 'Tomar Foto',
      icon: 'camera-outline',
      handler: () => {
        this.tomarFoto();
      }
    },
    {
      text: 'Elegir de Galería',
      icon: 'images-outline',
      handler: () => {
        this.seleccionarDeGaleria();
      }
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      icon: 'close-outline'
    }
  ];

  constructor(
    private dbService: DatabaseService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({
      cubeOutline,
      informationCircleOutline,
      calculatorOutline,
      saveOutline,
      closeOutline,
      imageOutline,
      cameraOutline,
      imagesOutline,
      trashOutline
    });
  }

  async ngOnInit() {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.productoId) {
      this.modoEdicion = true;
      await this.cargarProducto();
    }
  }

  async cargarProducto() {
    if (!this.productoId) return;
    
    try {
      const producto = await this.dbService.getProducto(this.productoId);
      if (producto) {
        this.producto = producto;
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
      alert('Error al cargar el producto');
    }
  }

  /**
   * 📸 Mostrar opciones de imagen
   */
  abrirOpcionesImagen() {
    this.mostrarOpcionesImagen = true;
  }

  /**
   * 📷 Tomar foto con la cámara
   */
  async tomarFoto() {
    this.mostrarOpcionesImagen = false;
    await this.seleccionarImagen(true);
  }

  /**
   * 🖼️ Seleccionar desde galería
   */
  async seleccionarDeGaleria() {
    this.mostrarOpcionesImagen = false;
    await this.seleccionarImagen(false);
  }

  /**
   * 🎨 Método principal para seleccionar/capturar imagen
   */
  private async seleccionarImagen(useCamera: boolean) {
    try {
      this.cargandoImagen = true;
      
      // Seleccionar imagen
      const imagenBase64 = await this.imageService.seleccionarImagen(useCamera);
      
      if (!imagenBase64) {
        this.cargandoImagen = false;
        return;
      }

      // Validar tamaño
      if (!this.imageService.validarTamano(imagenBase64)) {
        this.cargandoImagen = false;
        return;
      }

      // Crear miniatura
      const thumbnail = await this.imageService.crearMiniatura(imagenBase64);

      // Asignar al producto
      this.producto.imagen = imagenBase64;
      this.producto.imagenThumbnail = thumbnail;
      this.producto.tieneImagen = true;

      this.cargandoImagen = false;
      console.log('✅ Imagen cargada correctamente');
      
    } catch (error) {
      this.cargandoImagen = false;
      console.error('Error seleccionando imagen:', error);
      alert('Error al cargar la imagen');
    }
  }

  /**
   * 🗑️ Eliminar imagen del producto
   */
  eliminarImagen() {
    if (confirm('¿Estás seguro de eliminar la imagen?')) {
      this.producto.imagen = undefined;
      this.producto.imagenThumbnail = undefined;
      this.producto.tieneImagen = false;
      this.imageService.eliminarImagen();
      console.log('✅ Imagen eliminada');
    }
  }

  /**
   * 💾 Guardar producto
   */
  async guardarProducto() {
    if (!this.validarFormulario()) {
      return;
    }

    try {
      if (this.modoEdicion && this.productoId) {
        this.producto.id = this.productoId;
        await this.dbService.actualizarProducto(this.producto);
        alert('✅ Producto actualizado exitosamente');
      } else {
        await this.dbService.crearProducto(this.producto);
        alert('✅ Producto creado exitosamente');
      }

      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('❌ Error al guardar el producto');
    }
  }

  /**
   * ✅ Validar formulario
   */
  validarFormulario(): boolean {
    if (!this.producto.nombre || this.producto.nombre.trim() === '') {
      alert('⚠️ El nombre del producto es obligatorio');
      return false;
    }

    if (!this.producto.categoria || this.producto.categoria === '') {
      alert('⚠️ Debe seleccionar una categoría');
      return false;
    }

    if (this.producto.precio <= 0) {
      alert('⚠️ El precio debe ser mayor a 0');
      return false;
    }

    if (this.producto.stock < 0) {
      alert('⚠️ El stock no puede ser negativo');
      return false;
    }

    return true;
  }

  /**
   * ❌ Cancelar edición
   */
  cancelar() {
    this.router.navigate(['/productos']);
  }
}
// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  constructor() {}

  /**
   * 📸 Seleccionar imagen desde la cámara o galería
   * ✅ OPTIMIZADO: Reducción automática de tamaño
   */
  async seleccionarImagen(useCamera: boolean = false): Promise<string | null> {
    try {
      console.log(`📸 Iniciando selección de imagen (${useCamera ? 'Cámara' : 'Galería'})`);
      
      const permiso = await this.verificarPermisos();
      if (!permiso) {
        alert('⚠️ Se necesitan permisos para acceder a la cámara/galería');
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 60, // ✅ REDUCIDO de 80 a 60 para menor tamaño
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: useCamera ? CameraSource.Camera : CameraSource.Photos,
        width: 600, // ✅ REDUCIDO de 800 a 600
        height: 600, // ✅ REDUCIDO de 800 a 600
      });

      if (image && image.base64String) {
        const imagenBase64 = `data:image/${image.format};base64,${image.base64String}`;
        
        // Calcular tamaño
        const tamanoMB = this.calcularTamano(imagenBase64);
        console.log(`✅ Imagen seleccionada: ${tamanoMB.toFixed(2)} MB`);
        
        return imagenBase64;
      }

      return null;
    } catch (error: any) {
      console.error('❌ Error seleccionando imagen:', error);
      
      if (error.message && error.message.includes('cancelled')) {
        console.log('ℹ️ Usuario canceló la selección');
        return null;
      }
      
      throw error;
    }
  }

  /**
   * 🖼️ Crear miniatura de una imagen
   * ✅ OPTIMIZADO: Tamaño más pequeño y mejor compresión
   */
  async crearMiniatura(base64Image: string): Promise<string> {
    console.log('🖼️ Creando miniatura...');
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject('No se pudo crear el contexto del canvas');
          return;
        }

        // ✅ Tamaño de miniatura más pequeño
        const maxSize = 150; // REDUCIDO de 200 a 150
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // ✅ Reducir calidad para miniaturas
        const thumbnail = canvas.toDataURL('image/jpeg', 0.5); // REDUCIDO de 0.7 a 0.5
        
        console.log(`✅ Miniatura creada: ${width}x${height}px`);
        resolve(thumbnail);
      };

      img.onerror = () => reject('Error al cargar la imagen');
      img.src = base64Image;
    });
  }

  /**
   * 📊 Validar tamaño de imagen (máximo 3MB)
   * ✅ AUMENTADO límite para imágenes de productos
   */
  validarTamano(base64Image: string): boolean {
    const tamanoMB = this.calcularTamano(base64Image);
    const maxSizeMB = 3; // Máximo 3MB
    
    console.log(`📊 Tamaño de imagen: ${tamanoMB.toFixed(2)} MB (${(tamanoMB * 1024 * 1024).toFixed(0)} bytes)`);
    
    if (tamanoMB > maxSizeMB) {
      alert(`⚠️ La imagen es muy grande (${tamanoMB.toFixed(2)} MB). Máximo ${maxSizeMB}MB permitido.`);
      return false;
    }
    
    return true;
  }

  /**
   * 🔢 Calcular tamaño de imagen en MB
   */
  private calcularTamano(base64Image: string): number {
    const base64Length = base64Image.length - (base64Image.indexOf(',') + 1);
    const padding = (base64Image.charAt(base64Image.length - 2) === '=') ? 2 : 
                    (base64Image.charAt(base64Image.length - 1) === '=') ? 1 : 0;
    const fileSize = base64Length * 0.75 - padding;
    return fileSize / (1024 * 1024); // Convertir a MB
  }

  /**
   * 🔍 Verificar y solicitar permisos de cámara
   */
  private async verificarPermisos(): Promise<boolean> {
    try {
      const platform = Capacitor.getPlatform();
      console.log(`🔍 Verificando permisos en: ${platform}`);
      
      if (platform === 'web') {
        return true;
      }

      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera === 'denied' || permissions.photos === 'denied') {
        const requested = await Camera.requestPermissions();
        return requested.camera === 'granted' || requested.photos === 'granted';
      }

      return permissions.camera === 'granted' || permissions.photos === 'granted';
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }

  /**
   * 🗑️ Eliminar imagen (solo limpia la referencia)
   */
  eliminarImagen(): void {
    console.log('✅ Imagen eliminada de la memoria');
  }
}
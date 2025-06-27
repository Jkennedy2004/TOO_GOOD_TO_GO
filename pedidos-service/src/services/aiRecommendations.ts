import { Producto } from "../models/producto";
import { Usuario } from "../models/usuario";
import { Reserva } from "../models/reserva";

interface PreferenciasUsuario {
  tipos_cocina_favoritos: string[];
  precio_maximo: number;
  distancia_maxima: number;
  horarios_preferidos: string[];
  productos_evitar: string[];
}

interface FactorRecomendacion {
  producto: Producto;
  puntuacion: number;
  razones: string[];
}

export class AIRecommendationService {
  
  /**
   * Genera recomendaciones personalizadas para un usuario
   */
  async generarRecomendaciones(
    usuario: Usuario, 
    productos: Producto[], 
    historialReservas: Reserva[] = [],
    preferencias?: PreferenciasUsuario
  ): Promise<FactorRecomendacion[]> {
    
    // 1. Analizar historial del usuario
    const perfilUsuario = this.analizarPerfilUsuario(historialReservas);
    
    // 2. Combinar con preferencias explícitas
    const preferenciasCompletas = this.combinarPreferencias(perfilUsuario, preferencias);
    
    // 3. Calcular puntuación para cada producto
    const recomendaciones = productos
      .filter(p => p.activo && p.cantidad_disponible > 0)
      .map(producto => this.calcularPuntuacionProducto(producto, preferenciasCompletas, historialReservas))
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 10); // Top 10 recomendaciones
    
    return recomendaciones;
  }

  /**
   * Analiza el historial de reservas para crear un perfil del usuario
   */
  private analizarPerfilUsuario(historialReservas: Reserva[]): PreferenciasUsuario {
    if (historialReservas.length === 0) {
      return this.getPreferenciasDefault();
    }

    // Analizar tipos de cocina más frecuentes
    const tiposCocina: { [key: string]: number } = {};
    let totalGastado = 0;
    const precios: number[] = [];

    historialReservas.forEach(reserva => {
      if (reserva.producto?.restaurante?.tipo_cocina) {
        const tipo = reserva.producto.restaurante.tipo_cocina.toLowerCase();
        tiposCocina[tipo] = (tiposCocina[tipo] || 0) + 1;
      }
      
      totalGastado += Number(reserva.precio_total);
      precios.push(Number(reserva.precio_total));
    });

    // Obtener tipos favoritos (top 3)
    const tiposFavoritos = Object.entries(tiposCocina)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tipo]) => tipo);

    // Calcular precio máximo promedio
    const precioPromedio = totalGastado / historialReservas.length;
    const precioMaximo = Math.max(precioPromedio * 1.5, Math.max(...precios));

    return {
      tipos_cocina_favoritos: tiposFavoritos,
      precio_maximo: precioMaximo,
      distancia_maxima: 10, // km por defecto
      horarios_preferidos: ["18:00-22:00"], // Horario típico de cena
      productos_evitar: []
    };
  }

  /**
   * Combina el perfil aprendido con preferencias explícitas del usuario
   */
  private combinarPreferencias(
    perfilAprendido: PreferenciasUsuario, 
    preferenciasExplicitas?: PreferenciasUsuario
  ): PreferenciasUsuario {
    if (!preferenciasExplicitas) return perfilAprendido;

    return {
      tipos_cocina_favoritos: [
        ...new Set([
          ...preferenciasExplicitas.tipos_cocina_favoritos,
          ...perfilAprendido.tipos_cocina_favoritos
        ])
      ],
      precio_maximo: preferenciasExplicitas.precio_maximo || perfilAprendido.precio_maximo,
      distancia_maxima: preferenciasExplicitas.distancia_maxima || perfilAprendido.distancia_maxima,
      horarios_preferidos: preferenciasExplicitas.horarios_preferidos.length > 0 
        ? preferenciasExplicitas.horarios_preferidos 
        : perfilAprendido.horarios_preferidos,
      productos_evitar: [
        ...new Set([
          ...preferenciasExplicitas.productos_evitar,
          ...perfilAprendido.productos_evitar
        ])
      ]
    };
  }

  /**
   * Calcula la puntuación de recomendación para un producto específico
   */
  private calcularPuntuacionProducto(
    producto: Producto, 
    preferencias: PreferenciasUsuario,
    historial: Reserva[]
  ): FactorRecomendacion {
    let puntuacion = 0;
    const razones: string[] = [];

    // Factor 1: Tipo de cocina favorito (peso: 30%)
    if (preferencias.tipos_cocina_favoritos.includes(
      producto.restaurante.tipo_cocina.toLowerCase()
    )) {
      puntuacion += 30;
      razones.push(`Te gusta la cocina ${producto.restaurante.tipo_cocina}`);
    }

    // Factor 2: Precio atractivo (peso: 25%)
    const descuentoPorcentaje = ((Number(producto.precio_original) - Number(producto.precio_descuento)) / Number(producto.precio_original)) * 100;
    if (descuentoPorcentaje >= 50) {
      puntuacion += 25;
      razones.push(`Descuento del ${Math.round(descuentoPorcentaje)}%`);
    } else if (descuentoPorcentaje >= 30) {
      puntuacion += 15;
      razones.push(`Buen descuento del ${Math.round(descuentoPorcentaje)}%`);
    }

    // Factor 3: Precio dentro del rango (peso: 20%)
    if (Number(producto.precio_descuento) <= preferencias.precio_maximo) {
      puntuacion += 20;
      razones.push("Precio dentro de tu rango");
    }

    // Factor 4: Urgencia por caducidad (peso: 15%)
    const horasHastaCaducidad = this.calcularHorasHastaCaducidad(producto.fecha_caducidad);
    if (horasHastaCaducidad <= 4) {
      puntuacion += 15;
      razones.push("¡Caduca pronto! Mejor precio");
    } else if (horasHastaCaducidad <= 12) {
      puntuacion += 10;
      razones.push("Disponible por poco tiempo");
    }

    // Factor 5: Disponibilidad (peso: 10%)
    if (producto.cantidad_disponible >= 5) {
      puntuacion += 10;
      razones.push("Buena disponibilidad");
    } else if (producto.cantidad_disponible >= 2) {
      puntuacion += 5;
      razones.push("Disponibilidad limitada");
    }

    // Penalizaciones
    // Ya ha comprado este producto recientemente
    const yaComprado = historial.some(r => 
      r.producto?.id_producto === producto.id_producto && 
      this.esReciente(r.fecha_reserva)
    );
    if (yaComprado) {
      puntuacion -= 10;
      razones.push("Ya reservaste este producto recientemente");
    }

    // Productos a evitar
    const nombreProducto = producto.nombre.toLowerCase();
    const debeEvitar = preferencias.productos_evitar.some(evitar => 
      nombreProducto.includes(evitar.toLowerCase())
    );
    if (debeEvitar) {
      puntuacion -= 20;
    }

    return {
      producto,
      puntuacion: Math.max(0, puntuacion), // No permitir puntuaciones negativas
      razones
    };
  }

  /**
   * Genera explicación de por qué se recomienda un producto
   */
  generarExplicacionRecomendacion(recomendacion: FactorRecomendacion): string {
    const { producto, puntuacion, razones } = recomendacion;
    
    let explicacion = `Te recomendamos "${producto.nombre}" de ${producto.restaurante.nombre} `;
    explicacion += `(Puntuación: ${Math.round(puntuacion)}/100)\n\n`;
    
    explicacion += "¿Por qué te lo recomendamos?\n";
    razones.forEach((razon, index) => {
      explicacion += `${index + 1}. ${razon}\n`;
    });

    const descuento = ((Number(producto.precio_original) - Number(producto.precio_descuento)) / Number(producto.precio_original)) * 100;
    explicacion += `\n💰 Precio original: $${producto.precio_original}`;
    explicacion += `\n💸 Precio con descuento: $${producto.precio_descuento}`;
    explicacion += `\n🎯 Ahorras: ${Math.round(descuento)}%`;
    
    return explicacion;
  }

  /**
   * Busca productos similares basados en un producto específico
   */
  async encontrarProductosSimilares(
    productoBase: Producto, 
    todosLosProductos: Producto[]
  ): Promise<Producto[]> {
    return todosLosProductos
      .filter(p => 
        p.id_producto !== productoBase.id_producto &&
        p.activo && 
        p.cantidad_disponible > 0
      )
      .map(producto => ({
        producto,
        similitud: this.calcularSimilitud(productoBase, producto)
      }))
      .sort((a, b) => b.similitud - a.similitud)
      .slice(0, 5)
      .map(item => item.producto);
  }

  // Métodos auxiliares
  private getPreferenciasDefault(): PreferenciasUsuario {
    return {
      tipos_cocina_favoritos: ["italiana", "mexicana", "asiática"],
      precio_maximo: 15,
      distancia_maxima: 10,
      horarios_preferidos: ["18:00-22:00"],
      productos_evitar: []
    };
  }

  private calcularHorasHastaCaducidad(fechaCaducidad: Date): number {
    const ahora = new Date();
    const diferencia = new Date(fechaCaducidad).getTime() - ahora.getTime();
    return diferencia / (1000 * 60 * 60); // Convertir a horas
  }

  private esReciente(fecha: Date): boolean {
    const ahora = new Date();
    const diferencia = ahora.getTime() - new Date(fecha).getTime();
    const diasDiferencia = diferencia / (1000 * 60 * 60 * 24);
    return diasDiferencia <= 7; // Últimos 7 días
  }

  private calcularSimilitud(producto1: Producto, producto2: Producto): number {
    let similitud = 0;

    // Mismo tipo de cocina
    if (producto1.restaurante.tipo_cocina === producto2.restaurante.tipo_cocina) {
      similitud += 40;
    }

    // Rango de precio similar
    const precio1 = Number(producto1.precio_descuento);
    const precio2 = Number(producto2.precio_descuento);
    const diferenciaPrecio = Math.abs(precio1 - precio2);
    if (diferenciaPrecio <= 5) {
      similitud += 30;
    } else if (diferenciaPrecio <= 10) {
      similitud += 15;
    }

    // Nombres similares (palabras en común)
    const palabras1 = producto1.nombre.toLowerCase().split(' ');
    const palabras2 = producto2.nombre.toLowerCase().split(' ');
    const palabrasComunes = palabras1.filter(p => palabras2.includes(p));
    similitud += palabrasComunes.length * 10;

    return similitud;
  }
}
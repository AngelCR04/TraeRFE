export interface Mantenimiento {
    mantenimientoId: number;
    autobus: string;
    fechaMantenimiento: string;
    fechaFinMantenimiento: string;
    tipoMantenimiento: string;
    detalles: string;
    proximoMantenimiento: string;
  }
  
export interface NewMantenimiento {
    autobusId: number;
    fechaMantenimiento: string;
    tipoMantenimientoId: number;
    descripcion: string;
  }

export interface Autobus {
    autobusId: number;
    codigoAutobus: string;
  }
  
export interface TipoMantenimiento {
    tipoMantenimientoId: number;
    nombreMantenimiento: string;
  }
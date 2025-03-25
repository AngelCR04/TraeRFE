type Solicitud = {
    numeroSolicitud: number;
    tipoSolicitud: string;
    region: string;
    nombreSolicitante: string;
    correoSolicitante: string;
    descripcion: string;
    estado: string;
    encargado: string;
  }
  
  type EstadoSolicitud = {
    estadoSolicitudId: number;
    descripcion: string;
  }

  type TipoSolicitud={
    tipoSolicitudId: number;
    nombreTipoSolicitud: string
  }
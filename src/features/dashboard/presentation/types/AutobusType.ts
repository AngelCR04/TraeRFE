export interface Autobus {
    autobusId: number;
    placa: string;
    chasis:string;
    modelo: string;
    marcaId: number;
    marca: string;
    movilidad:string;
    capacidad: number;
    codigoAutobus: string;
    estado: string;
    ruta: string | null;
    modeloId?: number;
    estadoAutobusId?: number;
    regionId?: number;
    provinciaId?: number;
    municipioId?: number;
    provincia: string;
    municipio: string;
    agenciaId?: number;
    agencia: string;
    diasRestantesGarantia: number;
    region?: string;
  }
  
export interface Marca {
    marcaId: number;
    nombreMarca: string;
  }
  
export interface Agencia{
    agenciaId: number;
    nombre: string;
}
export interface Modelo {
    modeloId: number;
    marcaId: number;
    nombreModelo: string;
  }
  
export interface Estado {
    estadoAutobusId: number;
    descripcion: string;
  }
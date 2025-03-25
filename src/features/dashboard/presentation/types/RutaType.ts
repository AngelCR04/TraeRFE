export interface Coordenada {
    lat: number;
    lng: number;
}

export interface Escuela {
    centroEducativoId: number;
    nombreCentro: string;
    latitud: number;
    longitud: number;
    municipioId:number;
}

export interface Parada {
    paradaId?: number;
    nombreParada: string;
    latitud: number;
    longitud: number;
    municipio?: string;
    municipioId: number;
}

export interface TipoRuta {
    tipoRutaId: number;
    descripcion: string;
}
export interface Horario {
    horarioId: number;
    tipoHorario: string;
}

export interface Ruta {
    rutaId?: number;
    nombreRuta: string;
    descripcion: string;
    tipoRuta: TipoRuta;
    tipoRutaId:number;
    color: string;
    coordenadas: Coordenada[];
    paradas: number[];
    centroEducativoIds: number[];
    regionId: number;
    estado: number;
    horarioId: number;
    municipioId: number;
    horariosIds: number[];
    autobusIds: number[];
    personalIds: number[];
}

export interface NewRuta {
    tipoRutaId: number;
    nombreRuta: string;
    descripcion: string;
    regionId: number;
    estado: number;
    color: string;
    paradas: number[];
    centroEducativoIds: number[];
    horariosIds: number[];
    personalIds: number[];
    autobusIds: number[];
}

export interface GeoJsonFeature {
    type: string;
    properties?: Ruta;
    geometry: {
        type: string;
        coordinates: number[][];
    };
}

export interface GeoJson {
    type: string;
    features: GeoJsonFeature[];
}
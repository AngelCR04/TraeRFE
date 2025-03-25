export interface Coordenada {
    lat: number;
    lng: number;
}

export interface MapParada {
    paradaId: number;
    nombreParada: string;
    latitud: number;
    longitud: number;
}

export interface MapEscuela {
    centroEducativoId: number;
    nombreCentro: string;
    latitud: number;
    longitud: number;
}
export interface MapRuta {
    nombreRuta: string;
    descripcion: string;
    color: string;
    coordenadas: Coordenada[];
    paradas: MapParada[];
    escuelas: MapEscuela[];
}

export interface GeoJsonFeature {
    type: string;
    properties: MapRuta;
    geometry: {
        type: string;
        coordinates: number[][];
    };
}

export interface GeoJson {
    type: string;
    features: GeoJsonFeature[];
}
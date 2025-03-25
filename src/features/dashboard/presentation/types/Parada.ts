import { Geometry } from "geojson";

export interface Parada {
    paradaId?: number;
    nombreParada: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    estado: string;
    regionId?: number;
    provinciaId?: number;
    provincia?: string;
    rutaId?: number;
    municipioId?: number;
    municipioNombre?: string;
}

export interface ParadaProperties {
    nombreParada: string;
    descripcion: string;
    estado: string;
    regionId?: number;
    provinciaId?: number;
    provincia?: string;
    rutaId?: number;
    municipioId?: number;
    municipioNombre?: string;
}

export interface ParadaFeature {
    type: "Feature";
    properties: ParadaProperties;
    geometry: Geometry;
}

export interface FeatureCollection {
    type: "FeatureCollection";
    features: ParadaFeature[];
}

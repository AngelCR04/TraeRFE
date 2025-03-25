export interface Personal {
    personalId: number;
    tipoPersonalId: number;
    tipoPersonal: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    sexo: string;
    documentoId: number;
    documento: string;
    numeroDocumento: string;
    telefono: string;
    direccion: string;
    estado: string;
    fechaContratacion: string;
    rutaId: string | null;
}

export interface TipoDocumento {
    documentoId: number;
    documento: string;
}

export interface TipoPersonal {
    tipoPersonalId: number;
    descripcion: string;
}

export type NewPersonal = {
    tipoPersonalId: number;
    tipoPersonal: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    sexo: string;
    documentoId: number;
    documento: string;
    numeroDocumento: string;
    telefono: string;
    direccion: string;
    estado: number;
    fechaContratacion: string;
    rutaId: null;
};

export type SortConfig = {
    key: keyof Personal;
    direction: 'asc' | 'desc';
};

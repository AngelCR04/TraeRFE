import { Personal, NewPersonal } from '../../features/dashboard/presentation/types/PersonalType';

export const validateField = (field: string, value: any) => {
    const errors: { [key: string]: string[] } = {};

    switch (field) {
        case 'tipoPersonalId':
            if (!value) {
                errors.tipoPersonalId = ['Debe seleccionar el tipo de personal'];
            }
            break;
        case 'nombre':
            if (!value) {
                errors.nombre = ['Debe ingresar el nombre de la persona'];
            }
            break;
        case 'apellido':
            if (!value) {
                errors.apellido = ['Debe ingresar el apellido de la persona'];
            }
            break;
        case 'sexo':
            if (!value) {
                errors.sexo = ['Debe seleccionar un sexo'];
            }
            break;
        case 'documentoId':
            if (!value) {
                errors.documentoId = ['Debe seleccionar un tipo de documento'];
            }
            break;
        case 'numeroDocumento':
            if (!value) {
                errors.numeroDocumento = ['Debe ingresar el número de documento'];
            }
            break;
        case 'telefono':
            if (!value) {
                errors.telefono = ['Debe ingrsar un número de teléfono'];
            }
            break;
        case 'direccion':
            if (!value) {
                errors.direccion = ['Debe ingresar una dirección'];
            }
            break;
        case 'estado':
            if (!value) {
                errors.estado = ['Debe seleccionar un estado'];
            }
            break;
        default:
            break;
    }

    return errors;
};

export const validatePersonal = (personal: Personal | NewPersonal) => {
    const errors: { [key: string]: string[] } = {};

    if (!personal.tipoPersonalId) {
        errors.tipoPersonalId = ['Debe seleccionar el tipo del personal'];
    }
    if (!personal.nombre) {
        errors.nombre = ['Debe ingresar el nombre de la persona'];
    }
    if (!personal.apellido) {
        errors.apellido = ['Debe ingresar el apellido de la persona'];
    }
    if (!personal.sexo) {
        errors.sexo = ['Debe seleccionar un sexo'];
    }
    if (!personal.documentoId) {
        errors.documentoId = ['Debe seleccionar un tipo de documento'];
    }
    if (!personal.numeroDocumento) {
        errors.numeroDocumento = ['Debe ingresar un número de documento'];
    }
    if (!personal.telefono) {
        errors.telefono = ['Debe ingresar un número de teléfono'];	
    }
    if (!personal.direccion) {
        errors.direccion = ['Debe ingresar una dirección'];
    }
    if ('estado' in personal && !personal.estado) {
        errors.estado = ['Debe seleccionar el estado del personal'];
    }

    return errors;
};
import { Ruta, NewRuta } from '../../features/dashboard/presentation/types/RutaType';

export const validateField = (field: string, value: any) => {
    const errors: { [key: string]: string[] } = {};

    switch (field) {
        case 'nombreRuta':
            if (!value) {
                errors.nombreRuta = ['Debe ingresar el nombre de la ruta'];
            }
            break;
        case 'descripcion':
            if (!value) {
                errors.descripcion = ['Debe ingresar la descripción de la ruta'];
            }
            break;
        case 'tipoRutaId':
            if (!value) {
                errors.tipoRutaId = ['Debe seleccionar el tipo de ruta'];
            }
            break;
        case 'regionId':
            if (!value) {
                errors.regionId = ['Debe seleccionar una región'];
            }
            break;
        case 'estado':
            if (value === undefined || value === null) {
                errors.estado = ['Debe seleccionar un estado'];
            }
            break;
        case 'color':
            if (!value) {
                errors.color = ['Debe seleccionar un color'];
            }
            break;
        case 'paradas':
            if (!value || value.length < 2) {
                errors.paradas = ['Debe seleccionar al menos 2 paradas (La primera y la última seleccionada son origen y destino respectivamente)'];
            }
            break;
        case 'centroEducativoIds':
            if (!value || value.length === 0) {
                errors.centroEducativoIds = ['Debe seleccionar al menos un centro educativo'];
            }
            break;
        case 'horariosIds':
            if (!value || value.length === 0) {
                errors.horariosIds = ['Debe seleccionar al menos un horario'];
            }
            break;
        case 'personalIds':
            if (!value || value.length === 0) {
                errors.personalIds = ['Debe seleccionar al menos un personal'];
            }
            break;
        case 'autobusIds':
            if (!value || value.length === 0) {
                errors.autobusIds = ['Debe seleccionar al menos un autobús'];
            }
            break;
        default:
            break;
    }

    return errors;
};

export const validateRuta = (ruta: Ruta | NewRuta) => {
    const errors: { [key: string]: string[] } = {};

    if (!ruta.nombreRuta) {
        errors.nombreRuta = ['Debe ingresar el nombre de la ruta'];
    }
    if (!ruta.descripcion) {
        errors.descripcion = ['Debe ingresar la descripción de la ruta'];
    }
    if (!ruta.tipoRutaId) {
        errors.tipoRutaId = ['Debe seleccionar el tipo de ruta'];
    }
    if (!ruta.regionId) {
        errors.regionId = ['Debe seleccionar una región'];
    }
    if (ruta.estado === undefined || ruta.estado === null) {
        errors.estado = ['Debe seleccionar un estado'];
    }
    if (!ruta.color) {
        errors.color = ['Debe seleccionar un color'];
    }
    if (!ruta.paradas || ruta.paradas.length < 2) {
        errors.paradas = ['Debe seleccionar al menos 2 paradas (La primera y la última seleccionada son origen y destino respectivamente)'];
    }
    if (!ruta.centroEducativoIds || ruta.centroEducativoIds.length === 0) {
        errors.centroEducativoIds = ['Debe seleccionar al menos un centro educativo'];
    }
    if (!ruta.horariosIds || ruta.horariosIds.length === 0) {
        errors.horariosIds = ['Debe seleccionar al menos un horario'];
    }
    if (!ruta.personalIds || ruta.personalIds.length === 0) {
        errors.personalIds = ['Debe seleccionar al menos un personal'];
    }
    if (!ruta.autobusIds || ruta.autobusIds.length === 0) {
        errors.autobusIds = ['Debe seleccionar al menos un autobús'];
    }

    return errors;
};
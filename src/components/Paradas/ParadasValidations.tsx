export const validateField = (field: string, value: any) => {
    const errors: { [key: string]: string[] } = {};

    switch (field) {
        case 'nombreParada':
            if (!value) {
                errors.nombreParada = ['El nombre de la parada es obligatorio.'];
            }
            break;
        case 'descripcion':
            if (!value) {
                errors.descripcion = ['La descripción es obligatoria.'];
            }
            break;
        case 'latitud':
            if (!value || isNaN(Number(value))) {
                errors.latitud = ['La latitud es obligatoria y debe ser un número válido.'];
            }
            break;
        case 'longitud':
            if (!value || isNaN(Number(value))) {
                errors.longitud = ['La longitud es obligatoria y debe ser un número válido.'];
            }
            break;
        case 'municipioId':
            if (!value || value === 0) {
                errors.municipioId = ['El municipio es obligatorio.'];
            }
            break;
        case 'estado':
            if (!value) {
                errors.estado = ['Debe seleccionar el estado de la parada.'];
            }
            break;
        default:
            break;
    }

    return errors;
};

export const validateParada = (parada: any) => {
    const errors: { [key: string]: string[] } = {};

    if (!parada.nombreParada) {
        errors.nombreParada = ['El nombre de la parada es obligatorio.'];
    }
    if (!parada.descripcion) {
        errors.descripcion = ['La descripción es obligatoria.'];
    }
    if (!parada.latitud || isNaN(Number(parada.latitud))) {
        errors.latitud = ['La latitud es obligatoria y debe ser un número válido.'];
    }
    if (!parada.longitud || isNaN(Number(parada.longitud))) {
        errors.longitud = ['La longitud es obligatoria y debe ser un número válido.'];
    }
    if (!parada.municipioId || parada.municipioId === 0) {
        errors.municipioId = ['El municipio es obligatorio.'];
    }
    if ('estado' in parada && !parada.estado) {
        errors.estado = ['Debe seleccionar el estado de la parada.'];
    }

    return errors;
};
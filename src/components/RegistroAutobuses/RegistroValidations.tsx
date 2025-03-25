import { Autobus } from '../../features/dashboard/presentation/types/AutobusType';

export const validateAutobus = (autobus: Omit<Autobus, 'marcaId'>) => {
  const errors: { [key: string]: string[] } = {};

  if (!autobus.codigoAutobus) {
    errors.codigoAutobus = ['El código del autobús es obligatorio'];
  }

  if (!autobus.placa) {
    errors.placa = ['La placa es obligatoria'];
  }

  if (!autobus.chasis) {
    errors.chasis = ['El chasis es obligatorio'];
  }

  if (!autobus.agenciaId) {
    errors.agenciaId = ['La agencia es obligatoria'];
  }

  if (!autobus.marca) {
    errors.marca = ['La marca es obligatoria'];
  }

  if (!autobus.modeloId) {
    errors.modeloId = ['El modelo es obligatorio'];
  }

  if (!autobus.capacidad) {
    errors.capacidad = ['La capacidad es obligatoria'];
  }

  if (!autobus.municipioId) {
    errors.municipioId = ['El municipio es obligatorio, para seleccionar un municipio, primero seleccione una región y una provincia'];
  }

  return errors;
};
//Eto para validar campos individuales
export const validateField = (field: string, value: any) => {
  const errors: { [key: string]: string[] } = {};

  switch (field) {
    case 'codigoAutobus':
      if (!value) {
        errors.codigoAutobus = ['El código del autobús es obligatorio'];
      }
      break;
    case 'placa':
      if (!value) {
        errors.placa = ['La placa es obligatoria'];
      }
      break;
    case 'chasis':
        if (!value || !/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) {
            errors.chasis = ['El chasis debe tener exactamente 17 caracteres y no incluir letras I, O o Q.'];
          }
      break;
    case 'agenciaId':
      if (!value) {
        errors.agenciaId = ['La agencia es obligatoria'];
      }
      break;
    case 'marca':
      if (!value) {
        errors.marca = ['La marca es obligatoria'];
      }
      break;
    case 'modeloId':
      if (!value) {
        errors.modeloId = ['El modelo es obligatorio'];
      }
      break;
    case 'capacidad':
      if (!value) {
        errors.capacidad = ['La capacidad es obligatoria'];
      }
      break;
    case 'municipioId':
      if (!value) {
        errors.municipioId = ['El municipio es obligatorio, para seleccionar un municipio, primero seleccione una región y una provincia'];
      }
      break;
    default:
      break;
  }

  return errors;
};
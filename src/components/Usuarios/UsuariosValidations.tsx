export interface UsuarioValidation {
    nombreCompleto: string;
    rol: string;
    Estado: string;
  }
  
  export const validateUsuario = (usuario: UsuarioValidation) => {
    const errors: { [key: string]: string[] } = {};
  
    if (!usuario.nombreCompleto) {
      errors.nombreCompleto = ['El nombre es obligatorio'];
    }
  
    if (!usuario.rol) {
      errors.rol = ['El rol es obligatorio'];
    }
    if(!usuario.Estado){
      errors.Estado = ['El estado es obligatorio'];
    }
  
    return errors;
  };
  
  // Validación de campos individuales
  export const validateField = (field: string, value: any) => {
    const errors: { [key: string]: string[] } = {};
  
    switch (field) {
      case 'nombreCompleto':
        if (!value) {
          errors.nombreCompleto = ['El nombre es obligatorio'];
        }
        break;
      case 'rol':
        if (!value) {
          errors.rol = ['El rol es obligatorio'];
        }
        break;
      case 'Estado':
        if (!value) {
          errors.Estado = ['El estado es obligatorio'];
        }
        break;

      default:
        break;
    }
  
    return errors;
  };
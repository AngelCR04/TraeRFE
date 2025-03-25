import React from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";

const PasswordResetForm: React.FC = () => {
  const { formData, error, success, handleSubmit, handleChange } = usePasswordReset();

  return (
    <div className="relative min-h-screen">
      {/* Capa de fondo con la imagen */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm brightness-50"
        style={{
          backgroundImage: 'url("/traerd1.jpg")'
        }}
      />
      
      {/* Contenido del formulario */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="h-[400px] flex w-[800px] shadow-sm rounded-lg bg-white/90"> 
          <div className="flex w-[1024px]">
            {/* Panel izquierdo */}
            <div 
              className="hidden lg:flex lg:w-1/2 h-auto relative overflow-hidden rounded-l-lg"
              style={{
                backgroundImage: 'url("/traerd2.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Capa de superposición para mejorar legibilidad si es necesario */}
              <div className="absolute inset-0 bg-custom-blue/10"></div>
            </div>

            {/* Panel derecho - formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <h2 className="text-4xl font-semibold text-gray-700 mb-8">Restablecer Contraseña</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="shadow-sm">
                    <input
                      type="email"
                      name="email"
                      placeholder="correo@trae.rd"
                      value={formData.correo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-custom-blue hover:bg-custom-blue-light text-white font-medium rounded-lg transition-colors"
                  >
                    Enviar Enlace de Restablecimiento
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useLogin } from '../../features/dashboard/presentation/hooks/useLogin';

export default function LoginForm() {
  const { formData, handleSubmit, handleChange, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(event);
    } finally {
      setLoading(false);
    }
  };

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
              {/* Capa de para mejorar legibilidad */}
              <div className="absolute inset-0 bg-custom-blue/10"></div>
            </div>

            {/* Panel derecho - formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <h2 className="text-4xl font-semibold text-gray-700 mb-8">LOGIN</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="shadow-sm">
                    <input
                      type="email"
                      name="username"
                      placeholder="correo@trae.rd"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="shadow-sm relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleClickShowPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-custom-blue border-gray-300 rounded focus:ring-custom-blue"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                        Recórdarme
                      </label>
                    </div>
                    <a href="/password-reset" className="text-sm text-custom-blue hover:text-custom-blue-light transition-colors">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-custom-blue hover:bg-custom-blue-light text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : (
                      "Acceder"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

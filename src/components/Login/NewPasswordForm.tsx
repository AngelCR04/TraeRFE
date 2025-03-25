import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

Modal.setAppElement("#root");

const NewPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setModalMessage("Las contraseñas no coinciden.");
      setIsSuccess(false);
      setIsModalVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://localhost:7251/api/Usuarios/password-reset", {
        token,
        newPassword: password,
      });
      setModalMessage("Contraseña restablecida con éxito.");
      setIsSuccess(true);
      setIsModalVisible(true);
    } catch (error) {
      setModalMessage("Error al restablecer la contraseña. Por favor, inténtelo de nuevo.");
      setIsSuccess(false);
      setIsModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    if (isSuccess) {
      navigate("/login");
    }
  };

  return (
    <motion.div
      className="relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="shadow-sm">
                    <input
                      type="password"
                      name="password"
                      placeholder="Nueva Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                      required
                    />
                  </div>
                  <div className="shadow-sm">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmar Nueva Contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-custom-blue hover:bg-custom-blue-light text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Restablecer Contraseña"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal intuitivo ;) */}
      <Modal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-95 text-center">
          {isSuccess ? (
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h2 className="text-lg text-gray-700">{modalMessage}</h2>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-custom-blue hover:bg-custom-blue-light text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default NewPasswordForm;
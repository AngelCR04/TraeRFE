import React, { useState } from "react";
import axios from "axios";

export function usePasswordReset() {
  const [formData, setFormData] = useState({ correo: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const apiUrl = 'https://localhost:7251/api/Auth/password-reset-request';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiUrl, {
        Correo: formData.correo,
      });

      console.log(response);
      localStorage.setItem('resetToken', response.data.resetToken);
      setSuccess('Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.');
      setError(null);
      setModalMessage('Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.');
      setIsModalVisible(true);
      setFormData({ correo: "" });
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.');
      setSuccess(null);
      setModalMessage('No se pudo enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.');
      setIsModalVisible(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage(null);
  };

  return {
    formData,
    error,
    success,
    handleSubmit,
    handleChange,
    isModalVisible,
    modalMessage,
    closeModal,
  };
}
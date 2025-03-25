import { useState } from "react";
import axios from "axios";

export function useChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = 'https://localhost:7251/api/Usuarios/change-password-auth';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(apiUrl, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Contraseña cambiada con éxito.");
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("Error response:", err.response.data);
        if (err.response.data.errors) {
          const validationErrors = err.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat().join(' ');
          setError(`Error al cambiar la contraseña: ${errorMessages}`);
        } else if (err.response.data.message) {
          setError(`Error al cambiar la contraseña: ${err.response.data.message}`);
        } else {
          setError("Error al cambiar la contraseña. Por favor, inténtelo de nuevo.");
        }
      } else {
        console.error("Error:", err);
        setError("Error al cambiar la contraseña. Por favor, inténtelo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return {
    formData,
    error,
    success,
    isLoading,
    handleSubmit,
    handleChange,
  };
}
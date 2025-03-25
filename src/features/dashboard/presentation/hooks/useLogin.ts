import React, { useState } from "react";
import { LoginType } from "../types/LoginType";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useLogin(){
    const navigate = useNavigate();

    const[formData,setFormData]=useState<LoginType>({
        username: "",
        password: "",
    });

    const [error,setError] = useState<string|null>(null);

    const apiUrl = 'https://localhost:7251/api/Auth/login'

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try {
            const response = await axios.post(apiUrl,{
                Username: formData.username,
                Password: formData.password,
            });
            
            console.log(response); 

            localStorage.setItem('token',response.data.token);

            navigate('/dashboard');
        } catch (err) {
            setError('Credenciales incorrectas, vuelva a intentarlo.')
        }
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value
        }));
        
    }

    return{
        formData,
        error,
        handleSubmit,
        handleChange
    }

}
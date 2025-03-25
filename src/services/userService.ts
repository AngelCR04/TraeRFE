import axios from "axios";
import { LoggesInUser, Usuario } from "../features/dashboard/presentation/types/UserType";

const API_URL = 'https://localhost:7251/api/Usuarios'

export const getAllUsers = async():Promise<Usuario[]>=>{
    try {
        const response = await axios.get(API_URL,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            
        });
        return response.data;

    } catch (error) {
        console.error('error al obtener la data :(')
        throw error;
    }
}

export const getUserLoggedIn = async(): Promise<LoggesInUser>=>{
    try {
        const response = await axios.get(`${API_URL}/me`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('error al obtener al user logged :(');
        throw error;
    }
}
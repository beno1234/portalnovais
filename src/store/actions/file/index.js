import api from '../../../apis';
import { toast } from 'react-toastify';

import {
    LOADING_FILE,
    ERROR_FILE
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_FILE,
        payload: message
    }
}

export const setError = (err) => {
    if (!!err) {
        if (err.message === "Unauthorized") err.message = "Você não tem autorização para realizar essa operação.";
        switch (err.code) {
            case 401:
                err.message = "Você não tem autorização para realizar essa operação.";
                break;
            case "ECONNABORTED":
                err.message = "Operação excedeu o tempo de espera.";
                break;
            case "ERR_NETWORK":
                err.message = "Conexão perdida.";
                break;
            default:
                break;
        }
    }

    return {
        type: ERROR_FILE,
        payload: err
    }
}

// Dá upload em um arquivo
export const uploadFile = async (file) => {
    try {

        let formData = new FormData();
        formData.append("file", file);

        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.post('/files/upload', formData, config);

        return response.data?.id;
    } catch (err) {
        toast.error(`Não foi possível selecionar a imagem.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        return false;
    }
}

// Dá upload em um arquivo
export const getFile = async (id) => {
    try {
        const response = await api.get(`/files/${id}`);
        const base64Flag = `data:${response.data.type};base64,`;
        return base64Flag + response.data.dataImage;
    } catch (err) {
        return false;
    }
}
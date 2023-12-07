import api from '../../../apis';

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
        switch (err.code) {
            case 401:
                err.message = "Você não tem autorização para realizar essa operação.";
                break;
            case "ECONNABORTED":
                err.message = "Operação excedeu o tempo de espera.";
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
// Avalia o anúncio
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

        return response;
    } catch (err) {
        return false;
    }
}
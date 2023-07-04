import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_USER,
    ERROR_USER,
    CREATE_USER,
    FETCH_USER,
    FETCH_USERS,
    EDIT_USER,
    DISABLE_USER,
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_USER,
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
        type: ERROR_USER,
        payload: err
    }
}

// Dá fetch em um único user
export const fetchUser = (id) => async dispatch => {
    dispatch(startLoading("Carregando dados..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        // passando token (autorização)
        const response = await api.get(`/users/${id}`, config);

        dispatch({
            type: FETCH_USER,
            payload: response.data
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}

// Lista de todos os users
export const fetchUsers = (params) => async dispatch => {
    dispatch(startLoading("Carregando usuários..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/users";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_USERS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}

// Cria um user
export const createUser = (formValues) => async dispatch => {
    dispatch(startLoading("Carregando..."));

    try {
        await api.post('/users', formValues);

        dispatch({
            type: CREATE_USER
        });

        toast.success('Usuário criado com sucesso', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível criar o usuário: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}

// Atualiza um user
export const editUser = (id, formValues) => async dispatch => {
    dispatch(startLoading("Atualizando dados..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.put(`/users/${id}`, formValues, config);

        dispatch({
            type: EDIT_USER,
            payload: response.data
        });

        toast.success('Usuário atualizado com sucesso', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível atualizar o usuário: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}

// Seta o status do user para bloqueado
export const disableUser = (id) => async dispatch => {
    dispatch(startLoading("Desativando conta..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await api.delete(`/users/${id}`, config);

        dispatch({
            type: DISABLE_USER,
            payload: id
        });

        toast.success('Usuário desativado com sucesso', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível desativar o usuário: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}
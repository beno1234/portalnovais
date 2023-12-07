import quotations from "../../../apis/mockups/quote";

import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_QUOTATION,
    ERROR_QUOTATION,
    CREATE_QUOTATION,
    FETCH_QUOTATION,
    FETCH_QUOTATIONS,
    EDIT_QUOTATION,
    DISABLE_QUOTATION,
    /* TOGGLE_CATEGORY_IS_ANSWERED */
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_QUOTATION,
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
        type: ERROR_QUOTATION,
        payload: err
    }
}

export const toggleCategoryIsAnswered = (id) => async dispatch => {
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
        /* const response =  */await api.patch(`/quote/${id}`, {
            categoryId: id
        }, config);

        /* dispatch({
            type: TOGGLE_CATEGORY_IS_ANSWERED,
            payload: response.data
        }); */

        return true;
    } catch (err) {
        toast.error(`Não foi possível marcar a categoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        return false;
    }
}

// Dá fetch em um único quotation
export const fetchQuotation = (id) => async dispatch => {
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
        const response = await api.get(`/quote/${id}`, config);

        dispatch({
            type: FETCH_QUOTATION,
            payload: response.data
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar os dados da cotação: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível carregar os dados.",
            code: err.code
        }));

        return false;
    }
}

// Lista de todos os categories
export const fetchQuotations = (params) => async dispatch => {
    dispatch(startLoading("Carregando cotações..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/quote";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_QUOTATIONS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar as cotações: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível carregar as cotações.",
            code: err.code
        }));

        return false;
    }
}

// Lista das minhas cotacoes
export const fetchMyQuotations = (params) => async dispatch => {
    dispatch(startLoading("Carregando cotações..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/me/quotes";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = {};
        response.data = quotations;//await api.get(url, config);

        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_QUOTATIONS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível carregar suas cotações.",
            code: err.code
        }));

        return false;
    }
}

// Cria um quotation
export const createQuotation = (formValues) => async dispatch => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');

    // Adiciona o token ao header da request
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    dispatch(startLoading("Carregando..."));

    try {
        await api.post('/quote', formValues, config);

        dispatch({
            type: CREATE_QUOTATION
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível criar a cotação.",
            code: err.code
        }));

        return false;
    }
}

// Atualiza um quotation
export const editQuotation = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/quote/${id}`, formValues, config);

        dispatch({
            type: EDIT_QUOTATION,
            payload: response.data
        });

        toast.success('Categoria atualizada com sucesso', {
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
        toast.error(`Não foi possível atualizar a cotação: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível atualizar os dados.",
            code: err.code
        }));

        return false;
    }
}

// Seta o status do quotation para bloqueado
export const disableQuotation = (id) => async dispatch => {
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

        await api.delete(`/quote/${id}`, config);

        dispatch({
            type: DISABLE_QUOTATION,
            payload: id
        });

        toast.success('Categoria desativada com sucesso', {
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
        toast.error(`Não foi possível desativar a cotação: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível desativar a cotação.",
            code: err.code
        }));

        return false;
    }
}
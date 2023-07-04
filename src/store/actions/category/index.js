import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_CATEGORY,
    ERROR_CATEGORY,
    CREATE_CATEGORY,
    FETCH_CATEGORY,
    FETCH_CATEGORIES,
    EDIT_CATEGORY,
    DISABLE_CATEGORY,

    FETCH_SUBCATEGORY,
    CREATE_SUBCATEGORY,
    EDIT_SUBCATEGORY,
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_CATEGORY,
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
        type: ERROR_CATEGORY,
        payload: err
    }
}

// Dá fetch em um único category
export const fetchCategory = (id) => async dispatch => {
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
        const response = await api.get(`/category/${id}`, config);

        dispatch({
            type: FETCH_CATEGORY,
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

// Dá fetch em um único subcategory
export const fetchSubCategory = (id) => async dispatch => {
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
        const response = await api.get(`/category/${id}`, config);

        dispatch({
            type: FETCH_SUBCATEGORY,
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

// Lista de todos os categories de serviços
export const fetchCategories = (params) => async dispatch => {
    dispatch(startLoading("Carregando categorias..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/category";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_CATEGORIES,
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

// Lista de todos os categories de serviços
export const fetchArticleCategories = (params) => async dispatch => {
    dispatch(startLoading("Carregando categorias..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/article/categories";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_CATEGORIES,
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

// Cria um category
export const createCategory = (formValues) => async dispatch => {
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
        await api.post('/category', formValues, config);

        dispatch({
            type: CREATE_CATEGORY
        });

        toast.success('Categoria criada com sucesso', {
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
        toast.error(`Não foi possível criar a categoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Cria um category
export const createSubCategory = (formValues) => async dispatch => {
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
        await api.post('/category', formValues, config);

        dispatch({
            type: CREATE_SUBCATEGORY
        });

        toast.success('Subcategoria criada com sucesso', {
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
        toast.error(`Não foi possível criar a subcategoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Atualiza um category
export const editCategory = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/category/${id}`, formValues, config);

        dispatch({
            type: EDIT_CATEGORY,
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
        toast.error(`Não foi possível atualizar a categoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Atualiza um category
export const editSubCategory = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/category/${id}`, formValues, config);

        dispatch({
            type: EDIT_SUBCATEGORY,
            payload: response.data
        });

        toast.success('Subcategoria atualizada com sucesso', {
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
        toast.error(`Não foi possível atualizar a subcategoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Seta o status do category para bloqueado
export const disableCategory = (id) => async dispatch => {
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

        await api.delete(`/category/${id}`, config);

        dispatch({
            type: DISABLE_CATEGORY,
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
        toast.error(`Não foi possível desativar a categoria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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
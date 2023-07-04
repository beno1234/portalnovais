import banners from '../../../apis/mockups/banner';

import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_BANNER,
    ERROR_BANNER,
    CREATE_BANNER,
    FETCH_BANNER,
    FETCH_BANNERS,
    FETCH_BANNERS_IN_REVIEW,
    EDIT_BANNER,
    DISABLE_BANNER,
    REVIEW_BANNER
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_BANNER,
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
        type: ERROR_BANNER,
        payload: err
    }
}
// Cria um banner
export const createBanner = (formValues) => async dispatch => {
    dispatch(startLoading("Carregando..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await api.post('/banner', formValues, config);

        dispatch({
            type: CREATE_BANNER
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível criar o banner.",
            code: err.code
        }));

        return false;
    }
}

// Dá fetch em um único banner
export const fetchBanner = (id) => async dispatch => {
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
        const response = await api.get(`/banner/${id}`, config);

        dispatch({
            type: FETCH_BANNER,
            payload: response.data
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar os dados do banner: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Lista de todos os banners fora de review
export const fetchPublicBanners = (params) => async dispatch => {
    dispatch(startLoading("Carregando banners..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/banner";
        params += "&status=posted";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = {};
        response.data = banners;//await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_BANNERS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível carregar os banners.",
            code: err.code
        }));

        return false;
    }
}

// Lista de todos os banners só em review
export const fetchBannersInReview = () => async dispatch => {
    dispatch(startLoading("Carregando banners..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.get("/banner?status=review", config);

        dispatch({
            type: FETCH_BANNERS_IN_REVIEW,
            payload: {
                data: response.data.data,
            }
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível carregar os banners.",
            code: err.code
        }));

        return false;
    }
}

// Lista de todos os banners fora de review
export const fetchMyBanners = (params) => async dispatch => {
    dispatch(startLoading("Carregando banners..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/me/banners";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = {};
        response.data = banners;//await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_BANNERS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível carregar seus banners.",
            code: err.code
        }));

        return false;
    }
}

// Lista de todos os banners
export const fetchBanners = (params) => async dispatch => {
    dispatch(startLoading("Carregando banners..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/admin/banner";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_BANNERS,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar os banners: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível carregar os banners.",
            code: err.code
        }));

        return false;
    }
}

// Aprova um banner
export const allowBanner = (id) => async dispatch => {
    dispatch(startLoading("Aprovando o banner..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.patch(`/banner/${id}`, {
            "status": "posted"
        }, config);

        dispatch({
            type: REVIEW_BANNER,
            payload: response.data
        });

        toast.success('Anúncio aprovado com sucesso', {
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
        toast.error(`Não foi possível aprovar o banner: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível aprovar o banner.",
            code: err.code
        }));

        return false;
    }
}

// Bloqueia um banner
export const blockBanner = (id) => async dispatch => {
    dispatch(startLoading("Bloqueando o banner..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.patch(`/banner/${id}`, {
            "status": "blocked"
        }, config);

        dispatch({
            type: REVIEW_BANNER,
            payload: response.data
        });

        toast.success('Anúncio bloqueado com sucesso', {
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
        toast.error(`Não foi possível bloquear o banner: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível bloquear o banner.",
            code: err.code
        }));

        return false;
    }
}

// Atualiza um banner
export const editBanner = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/banner/${id}`, formValues, config);

        dispatch({
            type: EDIT_BANNER,
            payload: response.data
        });

        toast.success('Anúncio atualizado com sucesso', {
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
        toast.error(`Não foi possível atualizar o banner: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: err.message,
            code: err.code
        }));

        return false;
    }
}

// Seta o status do banner para bloqueado
export const disableBanner = (id) => async dispatch => {
    dispatch(startLoading("Deletando banner..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await api.delete(`/banner/${id}`, config);

        dispatch({
            type: DISABLE_BANNER,
            payload: id
        });

        toast.success('Anúncio desativado com sucesso', {
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
        toast.error(`Não foi possível desativar o banner: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível deletar o banner.",
            code: err.code
        }));

        return false;
    }
}
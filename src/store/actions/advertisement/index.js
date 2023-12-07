import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_ADVERTISEMENT,
    ERROR_ADVERTISEMENT,
    CREATE_ADVERTISEMENT,
    FETCH_ADVERTISEMENT,
    FETCH_ADVERTISEMENTS,
    FETCH_ADVERTISEMENTS_IN_REVIEW,
    FETCH_FEATURED_ADVERTISEMENTS,
    FETCH_IN_REGION_SALE_ADVERTISEMENTS,
    EDIT_ADVERTISEMENT,
    DISABLE_ADVERTISEMENT,
    REVIEW_ADVERTISEMENT
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_ADVERTISEMENT,
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
        type: ERROR_ADVERTISEMENT,
        payload: err
    }
}
// Cria um advertisement
export const createAdvertisement = (formValues) => async dispatch => {
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

        await api.post('/advertisements', formValues, config);

        dispatch({
            type: CREATE_ADVERTISEMENT
        });

        toast.success('Anúncio criado com sucesso', {
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
        dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        }));

        return false;
    }
}

// Dá fetch em um único advertisement
export const fetchAdvertisement = (id) => async dispatch => {
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
        const response = await api.get(`/advertisements/${id}`, config);

        dispatch({
            type: FETCH_ADVERTISEMENT,
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

// Lista de todos os advertisements fora de review
export const fetchPublicAdvertisements = (params) => async dispatch => {
    dispatch(startLoading("Carregando anúncios..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/advertisements";
        params += "&rating=best";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_ADVERTISEMENTS,
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

// Lista de todos os advertisements só em review
export const fetchAdvertisementsInReview = () => async dispatch => {
    dispatch(startLoading("Carregando anúncios..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.get("/advertisements?status=review", config);

        dispatch({
            type: FETCH_ADVERTISEMENTS_IN_REVIEW,
            payload: {
                data: response.data.data,
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

// Lista de todos os advertisements fora de review
export const fetchMyAdvertisements = (params) => async dispatch => {
    dispatch(startLoading("Carregando anúncios..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/me/advertisements";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_ADVERTISEMENTS,
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

// Lista de todos os advertisements só com type="certified"
export const fetchFeaturedAdvertisements = (params) => async dispatch => {
    /* dispatch(startLoading("Carregando anúncios...")); */

    try {
        let url = "/advertisements";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url);

        dispatch({
            type: FETCH_FEATURED_ADVERTISEMENTS,
            payload: {
                data: response.data.data,
            }
        });

        return true;
    } catch (err) {
        /* dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        })); */

        return false;
    }
}

// Lista de todos os advertisements com promocao e da regiao do usuario
export const fetchInRegionSaleAdvertisements = (params) => async dispatch => {
    /* dispatch(startLoading("Carregando anúncios...")); */

    try {
        let url = "/advertisements";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url);

        dispatch({
            type: FETCH_IN_REGION_SALE_ADVERTISEMENTS,
            payload: {
                data: response.data.data,
            }
        });

        return true;
    } catch (err) {
        /* dispatch(setError({
            message: err.response?.data?.message ? err.response?.data?.message : err.message,
            code: err.code
        })); */

        return false;
    }
}

// Lista de todos os advertisements
export const fetchAdvertisements = (params) => async dispatch => {
    dispatch(startLoading("Carregando anúncios..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/admin/advertisements";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_ADVERTISEMENTS,
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

// Aprova um advertisement
export const allowAdvertisement = (id) => async dispatch => {
    dispatch(startLoading("Aprovando o anúncio..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.patch(`/advertisements/${id}`, {
            "status": "posted"
        }, config);

        dispatch({
            type: REVIEW_ADVERTISEMENT,
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
        toast.error(`Não foi possível aprovar o anúncio: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Bloqueia um advertisement
export const blockAdvertisement = (id) => async dispatch => {
    dispatch(startLoading("Bloqueando o anúncio..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const response = await api.patch(`/advertisements/${id}`, {
            "status": "blocked"
        }, config);

        dispatch({
            type: REVIEW_ADVERTISEMENT,
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
        toast.error(`Não foi possível bloquear o anúncio: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Incrementa um view
export const incrementAdvertisementView = (id) => {
    try {
        api.patch(`/advertisements/views/${id}`);
        return true;
    } catch (err) {
        return false;
    }
}

// Incrementa um WhatsApp view
export const incrementAdvertisementWhatsappView = (id) => {
    try {
        api.patch(`/advertisements/whatsappviews/${id}`);
        return true;
    } catch (err) {
        return false;
    }
}

// Avalia o anúncio
export const rateAdvertisement = (id, rating) => {
    try {
        const body = {
            idEntity: parseInt(id, 10),
            value: rating
        }

        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        api.post('/evaluation', body, config);
        return true;
    } catch (err) {
        return false;
    }
}

// Atualiza um advertisement
export const editAdvertisement = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/advertisements/${id}`, formValues, config);

        dispatch({
            type: EDIT_ADVERTISEMENT,
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
        toast.error(`Não foi possível atualizar o anúncio: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Seta o status do advertisement para bloqueado
export const disableAdvertisement = (id) => async dispatch => {
    dispatch(startLoading("Deletando anúncio..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await api.delete(`/advertisements/${id}`, config);

        dispatch({
            type: DISABLE_ADVERTISEMENT,
            payload: id
        });

        toast.success('Anúncio deletado com sucesso', {
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
        toast.error(`Não foi possível deletar o anúncio: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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
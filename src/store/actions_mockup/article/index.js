import { toast } from 'react-toastify';

import api from '../../../apis';
import {
    LOADING_ARTICLE,
    ERROR_ARTICLE,
    CREATE_ARTICLE,
    FETCH_ARTICLE,
    FETCH_ARTICLES,
    EDIT_ARTICLE,
    DISABLE_ARTICLE,
} from '../types';

export const startLoading = (message) => {
    return {
        type: LOADING_ARTICLE,
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
        type: ERROR_ARTICLE,
        payload: err
    }
}
// Cria um article
export const createArticle = (formValues) => async dispatch => {
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

        await api.post('/article', formValues, config);

        dispatch({
            type: CREATE_ARTICLE
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível criar a matéria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível criar a matéria.",
            code: err.code
        }));

        return false;
    }
}

// Dá fetch em um único article
export const fetchArticle = (id) => async dispatch => {
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
        const response = await api.get(`/article/get/${id}`, config);

        dispatch({
            type: FETCH_ARTICLE,
            payload: response.data
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar os dados da matéria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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


// Lista de todos os articles
export const fetchArticles = (params) => async dispatch => {
    dispatch(startLoading("Carreganda matérias..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        let url = "/article";
        if (params) {
            url = `${url}?${params}`;
        }

        const response = await api.get(url, config);
        const totalCount = !!response.data['total'] ?
            response.data['total'] : !!response.data.data.length ?
                response.data.data.length : 0;

        dispatch({
            type: FETCH_ARTICLES,
            payload: {
                data: response.data.data,
                totalCount
            }
        });

        return true;
    } catch (err) {
        toast.error(`Não foi possível carregar as matérias: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível carregar as matérias.",
            code: err.code
        }));

        return false;
    }
}

// Incrementa um view
export const incrementArticleView = (id) => {
    try {
        api.patch(`/article/views/${id}`);
        return true;
    } catch (err) {
        return false;
    }
}

// Avalia a matéria
/* export const rateArticle = (id, rating) => {
    try {
        const body = {
            articleId: parseInt(id, 10),
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
} */

// Atualiza um article
export const editArticle = (id, formValues) => async dispatch => {
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

        const response = await api.put(`/article/${id}`, formValues, config);

        dispatch({
            type: EDIT_ARTICLE,
            payload: response.data
        });

        toast.success('Matéria atualizado com sucesso', {
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
        toast.error(`Não foi possível atualizar a matéria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
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

// Seta o status do article para bloqueado
export const disableArticle = (id) => async dispatch => {
    dispatch(startLoading("Deletanda matéria..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await api.delete(`/article/${id}`, config);

        dispatch({
            type: DISABLE_ARTICLE,
            payload: id
        });

        toast.success('Matéria desativada com sucesso', {
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
        toast.error(`Não foi possível desativar a matéria: ${err.response?.data?.message ? err.response?.data?.message : err.message}`, {
            position: "bottom-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        dispatch(setError({
            message: "Não foi possível deletar a matéria.",
            code: err.code
        }));

        return false;
    }
}
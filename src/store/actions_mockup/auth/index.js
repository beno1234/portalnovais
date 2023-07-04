import jwt_decode from "jwt-decode";

import api from "../../../apis";
import {
    LOADING_ME,
    ERROR_ME,
    SIGN_UP,
    USER_LOGIN,
    USER_LOGOFF,
    FETCH_ME,
    EDIT_ME,
    DISABLE_ME
} from "../types";

export const startLoading = (message) => {
    return {
        type: LOADING_ME,
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
        type: ERROR_ME,
        payload: err
    }
}

// Cria um user
export const signUp = (formValues) => async dispatch => {
    dispatch(startLoading("Cadastrando..."));

    try {
        await api.post('/users', formValues);

        dispatch({
            type: SIGN_UP
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível cadastrar sua conta.",
            code: err.code
        }));

        return false;
    }
}

export const tryLogin = (formValues) => async dispatch => {
    dispatch(startLoading("Entrando..."));

    try {
        const response = await api.post('/login', formValues);

        // Guarda o JWT em localStorage para futuras autorizações
        localStorage.setItem('token', response.data['access_token']);
        const decodedJwt = jwt_decode(response.data['access_token']);

        dispatch({
            type: USER_LOGIN,
            payload: decodedJwt
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "E-mail ou senha incorretos.",
            code: err.code
        }));

        return false;
    }
}

export const tryLogoff = () => {
    // Remove o JWT de localStorage
    localStorage.removeItem('token');

    return {
        type: USER_LOGOFF
    }
}

export const loginFromToken = (token) => {
    return {
        type: USER_LOGIN,
        payload: jwt_decode(token)
    }
}

// Dá fetch nos próprios dados
export const fetchMe = (id) => async dispatch => {
    dispatch(startLoading("Carregando dados da conta..."));

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
            type: FETCH_ME,
            payload: response.data
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível carregar seus dados.",
            code: err.code
        }));

        return false;
    }
}

// Atualiza seus dados
export const editMe = (id, formValues) => async dispatch => {
    dispatch(startLoading("Atualizando seus dados..."));

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
            type: EDIT_ME,
            payload: response.data
        });

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível atualizar seus dados.",
            code: err.code
        }));

        return false;
    }
}

// Seta o status do user que está logado para bloqueado
export const disableMe = (id) => async dispatch => {
    dispatch(startLoading("Desativando sua conta..."));

    try {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');

        // Adiciona o token ao header da request
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        // todo: passando token (autorização)
        await api.delete(`/users/${id}`, config);

        dispatch({
            type: DISABLE_ME
        });

        dispatch(tryLogoff());

        return true;
    } catch (err) {
        dispatch(setError({
            message: "Não foi possível desativar sua conta.",
            code: err.code
        }));

        return false;
    }
}
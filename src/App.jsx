import './App.css';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MainRoutes from './routes/routes';
/*HOTFIX*/
import history from './routes/history';
import { setError as setAuthError, loginFromToken } from './store/actions/auth';
import { setError as setUserError } from './store/actions/user';
import { setError as setAdvertisementError } from './store/actions/advertisement';
/*ENF OF HOTFIX*/

const App = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const onPageLoad = useCallback(() => {
        token && dispatch(loginFromToken(token));
    }, [token, dispatch]);

    useEffect(() => {
        onPageLoad();
    }, [onPageLoad]);

    /*HOTFIX*/
    const userError = useSelector(state => state.user.error);
    const authError = useSelector(state => state.auth.error);
    const advertisementError = useSelector(state => state.advertisement.error);

    // Para evitar que o menu fique aberto ou erros persistam durante a navegação:
    const clearUserError = useCallback(() => {
        dispatch(setUserError(null));
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(setAuthError(null));
    }, [dispatch]);

    const clearAdvertisementError = useCallback(() => {
        dispatch(setAdvertisementError(null));
    }, [dispatch]);

    useEffect(() => {
        const unlisten = history.listen(() => {
            userError && clearUserError();
            authError && clearAuthError();
            advertisementError && clearAdvertisementError();
        });

        return unlisten;
    }, [userError, clearUserError, authError, clearAuthError, advertisementError, clearAdvertisementError]);
    /*ENF OF HOTFIX*/

    return (
        <MainRoutes />
    );
}

export default App;
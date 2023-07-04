import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import formatString from 'format-string-by-pattern';

// Components
import AdminUserForm from '../components/AdminUserForm';
// Action Creator
import { fetchUser, editUser } from '../../../../store/actions/user';

const UserEdit = () => {
    const { id } = useParams();

    const user = useSelector((state) => state.user.list[id]);
    const { isLoading, error } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/admin/users";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        // Limpa string para que só tenha números
        if (formValues.document) {
            formValues.document = formValues.document.replace(/\D/g, "");
        } else {
            formValues.document = null;
        }

        const success = await dispatch(editUser(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchUser = useCallback((id) => {
        dispatch(fetchUser(id));
    }, [dispatch])

    const onSync = () => {
        onFetchUser(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdminUserForm
                edit
                initialValues={{
                    email: user?.email,
                    name: user?.name,
                    /* birthday: user?.birthday && new Date(user?.birthday), */
                    document: user?.document
                        ? user?.document?.length === 14 ? formatString('XX.XXX.XXX/XXXX-XX', user.document) : formatString('XXX.XXX.XXX-XX', user.document)
                        : null,
                    documentType: user?.role === "advertiser"
                        ? user?.document?.length === 14 ? "pj" : "pf"
                        : "pf",
                    locationId: user?.locationId,
                    phone: user?.phone ? formatString('(99) 99999-9999', user.phone) : null,
                    role: user?.role
                }}
                onSubmit={onSubmit}
                disableSubmit={isLoading} // || error
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver user isso quer dizer que o erro é referente à atualização dele
            if (user) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados do usuário.</div>
                        <p>
                            Os dados do usuário não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdminUserForm
                        initialValues={{
                            email: user?.email,
                            name: user?.name,
                            /* birthday: user?.birthday && new Date(user?.birthday), */
                            document: user?.document
                                ? user?.document?.length === 14 ? formatString('XX.XXX.XXX/XXXX-XX', user.document) : formatString('XXX.XXX.XXX-XX', user.document)
                                : null,
                            documentType: user?.role === "advertiser"
                                ? user?.document?.length === 14 ? "pj" : "pf"
                                : "pf",
                            locationId: user?.locationId,
                            phone: user?.phone ? formatString('(99) 99999-9999', user.phone) : null,
                            role: user?.role
                        }}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados do usuário.</div>
                    <p>
                        Os dados do usuário não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!user) {
            onFetchUser(id);
        }
    }, [dispatch, user, id, onFetchUser]);

    return (
        <>
            <h2 className="ui header">Edição do usuário</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{user ? 'Atualizando usuário...' : 'Carregando usuário...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserEdit;
import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import AdminLocationForm from '../components/AdminLocationForm';
// Action Creator
import { fetchLocation, editLocation } from '../../../../store/actions/location';

const LocationEdit = () => {
    const { id } = useParams();

    const location = useSelector((state) => state.location.list[id]);
    const { isLoading, error } = useSelector((state) => state.location);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navLocation = useLocation();

    const from = navLocation.state?.from;
    const pathname = from ? from.pathname : "/admin/locations";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.position) {
            formValues.position = parseInt(formValues.position, 10);
        }
        const success = await dispatch(editLocation(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchLocation = useCallback((id) => {
        dispatch(fetchLocation(id));
    }, [dispatch])

    const onSync = () => {
        onFetchLocation(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdminLocationForm
                edit
                initialValues={{
                    name: location?.name,
                    position: location?.position,
                }}
                onSubmit={onSubmit}
                disableSubmit={isLoading} // || error
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver location isso quer dizer que o erro é referente à atualização dele
            if (location) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados da localização.</div>
                        <p>
                            Os dados da localização não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdminLocationForm
                        edit
                        initialValues={{
                            name: location?.name,
                            position: location?.position,
                        }}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados da localização.</div>
                    <p>
                        Os dados da localização não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!location) {
            onFetchLocation(id);
        }
    }, [dispatch, location, id, onFetchLocation]);

    return (
        <>
            <h2 className="ui header">Edição da localização</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{location ? 'Atualizando localização...' : 'Carregando localização...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LocationEdit;
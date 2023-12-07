import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AdminLocationForm from '../components/AdminLocationForm';
// Action Creator
import { createLocation } from '../../../../store/actions/location';

const LocationCreate = () => {
    const { isLoading } = useSelector((state) => state.location);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/admin/locations";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.position) {
            formValues.position = parseInt(formValues.position, 10);
        }
        formValues.registersAmount = 10;
        const success = await dispatch(createLocation(formValues));
        if (success) navigateToPreviousPage();
    }

    return (
        <>
            <h2 className="ui header">Criação de uma localização</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando a localização...</div>
                        </div>}
                        <AdminLocationForm
                            onSubmit={onSubmit}
                            disableSubmit={isLoading}
                            onCancel={navigateToPreviousPage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LocationCreate;
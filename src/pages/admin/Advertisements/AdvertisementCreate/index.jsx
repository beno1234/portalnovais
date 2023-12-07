import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import AdvertisementForm from '../../../advertiser/CriarAnuncio/components/AdvertisementForm';
// Action Creator
import { createAdvertisement } from '../../../../store/actions/advertisement';

const AdvertisementCreate = () => {
    const { isLoading, error } = useSelector((state) => state.advertisement);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/";
    const search = from ? from.search : '';

    const initialValues = useMemo(() => {
        const categoriesId = [];
        const locationsId = [];

        return {
            categories: categoriesId,
            locations: locationsId,
            images: [],
            status: "posted"
        }
    }, []);

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.document) {
            formValues.document = formValues.document.replace(/\D/g, "");
        }
        if (formValues.expirationDate) {
            formValues.expirationDate = new Date(formValues.expirationDate);
        }

        const success = await dispatch(createAdvertisement(formValues));
        if (success) navigateToPreviousPage();
    }

    return (
        <>
            <h2 className="ui header">Criação do anúncio</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando anúncio</div>
                        </div>}
                        {!!error && <div className="ui error message">
                            <div className="header">Não foi possível criar o anúncio.</div>
                            <p>
                                <b>{error.message}</b>.<br />
                                Por favor, tente novamente.
                            </p>
                        </div>}
                        <AdvertisementForm
                            admin
                            initialValues={initialValues}
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

export default AdvertisementCreate;
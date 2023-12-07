import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import BannerForm from '../../../advertiser/CriarBanner/components/BannerForm';
// Action Creator
import { createBanner } from '../../../../store/actions/banner';

const BannerEdit = () => {
    const { isLoading, error } = useSelector((state) => state.banner);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/";
    const search = from ? from.search : '';

    const initialValues = useMemo(() => {
        const categoriesId = [];
        const locationId = "";

        return {
            categories: categoriesId,
            locations: locationId,
            bannerPlaces: ["home"],
            blockOnDate: false,
            status: "posted"
        }
    }, []);

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.expirationDate) {
            formValues.expirationDate = new Date(formValues.expirationDate);
        }
        /* if (formValues.phone) {
            formValues.phone = formValues.phone.replace(/\D/g, "");
        }
        if (formValues.whatsApp) {
            formValues.whatsApp = formValues.whatsApp.replace(/\D/g, "");
        }

        const mockup = {
            "phone": formValues.whatsApp ? formValues.whatsApp : "11988889999",
        } */

        const success = await dispatch(createBanner(formValues));
        if (success) navigateToPreviousPage();
        
    }

    return (
        <>
            <h2 className="ui header">Criação do banner</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando banner</div>
                        </div>}
                        {!!error && <div className="ui error message">
                            <div className="header">Não foi possível criar o banner.</div>
                            <p>
                                <b>{error.message}</b>.<br />
                                Por favor, tente novamente.
                            </p>
                        </div>}
                        <BannerForm
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

export default BannerEdit;
import React, { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import formatString from 'format-string-by-pattern';

// Components
import AdvertisementForm from '../../../advertiser/CriarAnuncio/components/AdvertisementForm';
// Action Creator
import { fetchAdvertisement, editAdvertisement } from '../../../../store/actions/advertisement';

const AdvertisementEdit = () => {
    const { id } = useParams();

    const advertisement = useSelector((state) => state.advertisement.list[id]);
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

        if (advertisement?.categories) {
            for (let key in advertisement?.categories) {
                categoriesId.push(advertisement.categories[key]["category"]["id"]);
            }
        }

        if (advertisement?.locations) {
            for (let key in advertisement?.locations) {
                locationsId.push(advertisement.locations[key]["location"]["id"]);
            }
        }

        return {
            name: advertisement?.name,
            type: advertisement?.type,
            sale: advertisement?.sale,
            categories: categoriesId,
            locations: locationsId,
            email: advertisement?.email,
            whatsapp: formatString('(99) 99999-9999', advertisement?.whatsapp),
            phone: formatString('(99) 99999-9999', advertisement?.phone),
            site: advertisement?.site,
            facebook: advertisement?.facebook,
            instagram: advertisement?.instagram,
            youtube: advertisement?.youtube,
            expirationDate: advertisement?.expirationDate && new Date(advertisement?.expirationDate),
            blockOnDate: advertisement?.expirationDate ? true : false,
            status: advertisement?.status
        }
    }, [advertisement]);

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

        const success = await dispatch(editAdvertisement(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchAdvertisement = useCallback((id) => {
        dispatch(fetchAdvertisement(id));
    }, [dispatch])

    const onSync = () => {
        onFetchAdvertisement(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdvertisementForm
                admin
                description={advertisement?.description}
                cover={advertisement?.cover}
                images={advertisement?.images}
                initialValues={initialValues}
                onSubmit={onSubmit}
                disableSubmit={isLoading}
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver advertisement isso quer dizer que o erro é referente à atualização dele
            if (advertisement) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados do anúncio.</div>
                        <p>
                            Os dados do anúncio não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdvertisementForm
                        admin
                        description={advertisement?.description}
                        cover={advertisement?.cover}
                        images={advertisement?.images}
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados do anúncio.</div>
                    <p>
                        Os dados do anúncio não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!advertisement) {
            onFetchAdvertisement(id);
        }
    }, [dispatch, advertisement, id, onFetchAdvertisement]);

    return (
        <>
            <h2 className="ui header">Edição do anúncio</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{advertisement ? 'Atualizando anúncio...' : 'Carregando anúncio...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdvertisementEdit;
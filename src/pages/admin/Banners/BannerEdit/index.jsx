import React, { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import BannerForm from '../../../advertiser/CriarBanner/components/BannerForm';
// Action Creator
import { fetchBanner, editBanner } from '../../../../store/actions/banner';

const BannerEdit = () => {
    const { id } = useParams();

    const banner = useSelector((state) => state.banner.list[id]);
    const { isLoading, error } = useSelector((state) => state.banner);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/";
    const search = from ? from.search : '';

    const initialValues = useMemo(() => {
        const categoriesId = [];

        if (banner?.categories) {
            for (let key in banner?.categories) {
                categoriesId.push(banner.categories[key]["category"]["id"]);
            }
        }

        return {
            type: banner?.type,
            categories: categoriesId,
            site: banner?.site,
            name: banner?.name,
            bannerPlaces: banner?.bannerPlaces,
            locations: banner?.locations,
            /* email: banner?.email,
            phone: banner?.phone,
            whatsApp: banner?.whatsApp ? formatString('(99) 99999-9999', banner.whatsApp) : null, */
            expirationDate: banner?.expirationDate && new Date(banner?.expirationDate),
            blockOnDate: banner?.expirationDate ? true : false,
            status: banner?.status
        }
    }, [banner]);

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.expirationDate) {
            formValues.expirationDate = new Date(formValues.expirationDate);
        }

        const success = await dispatch(editBanner(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchBanner = useCallback((id) => {
        dispatch(fetchBanner(id));
    }, [dispatch])

    const onSync = () => {
        onFetchBanner(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <BannerForm
                admin
                cover={banner?.cover}
                initialValues={initialValues}
                onSubmit={onSubmit}
                disableSubmit={isLoading}
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver banner isso quer dizer que o erro é referente à atualização dele
            if (banner) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados do banner.</div>
                        <p>
                            Os dados do banner não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <BannerForm
                        admin
                        cover={banner?.cover}
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados do banner.</div>
                    <p>
                        Os dados do banner não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!banner) {
            onFetchBanner(id);
        }
    }, [dispatch, banner, id, onFetchBanner]);

    return (
        <>
            <h2 className="ui header">Edição do banner</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{banner ? 'Atualizando banner...' : 'Carregando banner...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BannerEdit;
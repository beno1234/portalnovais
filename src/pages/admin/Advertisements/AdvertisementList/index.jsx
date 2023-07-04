import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

// Actions
import { allowAdvertisement, blockAdvertisement, fetchAdvertisementsInReview, fetchAdvertisements } from '../../../../store/actions/advertisement';
import AllAdvertisementList from './components/AllAdvertisementList';

const AdvertisementList = () => {
    const dispatch = useDispatch();
    const { inReviewList } = useSelector((state) => state.advertisement);
    const list = Object.values(inReviewList);

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const onFetchAdvertisementsInReview = useCallback(() => {
        dispatch(fetchAdvertisementsInReview());
    }, [dispatch])

    const onFetchAdvertisements = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchAdvertisements(params));
    }, [dispatch, searchParams])

    const onAllowAdvertisement = async (id) => {
        const success = await dispatch(allowAdvertisement(id));
        if (success) onFetchAdvertisements();
    }

    const onBlockAdvertisement = async (id) => {
        const success = await dispatch(blockAdvertisement(id));
        if (success) onFetchAdvertisements();
    }

    const renderDate = (date) => {
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Sao_Paulo' };
        const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

        return <div className="ui sub header right floated">Publicado em {readableDate}</div>
    }

    useEffect(() => {
        onFetchAdvertisementsInReview();
    }, [onFetchAdvertisementsInReview]);

    return (
        <>{list.length > 0 &&
            <div className='section'>
                <div className='ui header'>
                    Anúncios com avaliação pendente
                </div>
                <div className="ui container">
                    {list.map((ad, index) => {
                        return <div className='ui review card' key={`${ad.name}${index}`}>
                            <div className='content'>
                                {ad.name && <div className="header">
                                    {ad.name}
                                    {ad.publishedAt && renderDate(ad.publishedAt)}
                                </div>}
                                <div className='description'>
                                    <div className="ui list">
                                        {ad.site && <div className="item">
                                            <i className='globe icon' />
                                            <div className="content">
                                                {ad.site}
                                            </div>
                                        </div>}
                                        {ad.whatsapp && <div className="item">
                                            <i className='phone icon' />
                                            <div className="content">
                                                {ad.whatsapp}
                                            </div>
                                        </div>}
                                        {ad.email && <div className="item">
                                            <i className='mail icon' />
                                            <div className="content">
                                                {ad.email}
                                            </div>
                                        </div>}
                                    </div>

                                </div>
                            </div>
                            <div className="extra content">
                                <div className="ui right floated green button" onClick={() => onAllowAdvertisement(ad.id)}>Aprovar</div>
                                <div className="ui right floated red button" onClick={() => onBlockAdvertisement(ad.id)}>Bloquear</div>
                                <p className='ui right floated'>Mais informações na <Link to={`/anuncios/${ad.id}`} className="ui right floated blue button" style={{ marginRight: "1em" }}>Pré-visualização</Link></p>
                            </div>
                        </div>
                    })}
                </div>
            </div>}
            <AllAdvertisementList />
        </>
    );
}

export default AdvertisementList;
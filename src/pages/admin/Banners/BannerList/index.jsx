import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';

// Actions
import { allowBanner, blockBanner, fetchBannersInReview, fetchBanners } from '../../../../store/actions/banner';
import AllBannerList from './components/AllBannerList';

const BannerList = () => {
    const dispatch = useDispatch();
    const { inReviewList } = useSelector((state) => state.banner);
    const list = Object.values(inReviewList);

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const onFetchBannersInReview = useCallback(() => {
        dispatch(fetchBannersInReview());
    }, [dispatch])

    const onFetchBanners = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchBanners(params));
    }, [dispatch, searchParams])

    const onAllowBanner = async (id) => {
        const success = await dispatch(allowBanner(id));
        if (success) onFetchBanners();
    }

    const onBlockBanner = async (id) => {
        const success = await dispatch(blockBanner(id));
        if (success) onFetchBanners();

    }

    const renderDate = (date) => {
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Sao_Paulo' };
        const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

        return <div className="ui sub header right floated">Publicado em {readableDate}</div>
    }

    useEffect(() => {
        onFetchBannersInReview();
    }, [onFetchBannersInReview]);

    return (
        <>{list.length > 0 &&
            <div className='section'>
                <div className='ui header'>
                    Banners com avaliação pendente
                </div>
                <div className="ui container">
                    {list.map((ad, index) => {
                        return <div className="ui review card" key={`${ad.name}${index}`}>
                            <div className='content'>
                                {ad.name && <div className="header">
                                    {ad.name}
                                    {ad.publishedAt && renderDate(ad.publishedAt)}
                                </div>}
                                <div className='description'>
                                    {ad.description && <><h4>Descrição</h4>
                                        {ad.description}</>}
                                    <div className="ui list">
                                        {ad.site && <div className="item">
                                            <i className='globe icon' />
                                            <div className="content">
                                                {ad.site}
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                            <div className="extra content">
                                <div className="ui right floated green button" onClick={() => onAllowBanner(ad.id)}>Aprovar</div>
                                <div className="ui right floated red button" onClick={() => onBlockBanner(ad.id)}>Bloquear</div>
                                <p className='ui right floated'>Veja todas as informações durante a edição <Link to={`${ad.id}/edit/`} className="ui right floated blue button" style={{ marginRight: "1em" }}>Mais informações</Link></p>
                            </div>
                        </div>
                    })}
                </div>
            </div>}
            <AllBannerList />
        </>
    );
}

export default BannerList;
import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import BannerCard from '../../../../components/BannerCard';
import { fetchMyBanners } from '../../../../store/actions/banner';
import AdminDeleteBannerModal from '../../../admin/Banners/components/AdminDeleteBannerModal';
import useModal from '../../../../hooks/useModal';

const MeusBannersList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { list, indexOrder, isLoading } = useSelector((state) => state.banner);
    // Coloca os users na ordem correta
    const banners = indexOrder.map((index) => list[index]);

    // Table
    const { setSelectedItem, openModal } = useModal();

    const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    }

    const onFetchBanners = useCallback(() => {
        // Pegando os parâmetros
        /* const params = searchParams.toString(); */

        dispatch(fetchMyBanners());
    }, [dispatch])

    useEffect(() => {
        onFetchBanners();
    }, [onFetchBanners]);

    return (
        <>
            <AdminDeleteBannerModal />
            {
                banners?.length > 0 ? banners.map((banner, index) => <div className="eight wide tablet five wide computer column" key={banner.name + index}>
                    <BannerCard data={banner} />
                    <div className="ui container" style={{ marginTop: "1em" }}>
                        <Link to={`${banner.id}/edit/`} state={{ from: location }} className='ui yellow icon button'>
                            <i className='edit icon'></i> Editar Banner
                        </Link>
                        <button className="ui negative icon button" onClick={() => onOpenModal(banner)}>
                            <i className='trash alternate icon'></i> Deletar
                        </button></div>
                </div>) : isLoading
                    ? <div className="ui active inverted dimmer">
                        <div className="ui text loader">Carregando banners...</div>
                    </div>
                    : <div className="ui warning message">
                        <div className="header">Você ainda não possui nenhum banner</div>
                        <p>Cadastre um banner <Link to="/anunciante/criar-banner">aqui</Link>.</p>
                    </div>
            }
        </>
    );
}

export default MeusBannersList;
import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import AnuncioCard from '../../../../components/AnuncioCard';
import { fetchMyAdvertisements } from '../../../../store/actions/advertisement';
import AdminDeleteAdvertisementModal from '../../../admin/Advertisements/components/AdminDeleteAdvertisementModal';
import useModal from '../../../../hooks/useModal';

const MeusAnunciosList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const { list, indexOrder, isLoading } = useSelector((state) => state.advertisement);
    // Coloca os users na ordem correta
    const advertisements = indexOrder.map((index) => list[index]);

    // Table
    const { setSelectedItem, openModal } = useModal();

    const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    }

    const onFetchAdvertisements = useCallback(() => {
        // Pegando os parâmetros
        /* const params = searchParams.toString(); */

        dispatch(fetchMyAdvertisements());
    }, [dispatch])

    useEffect(() => {
        onFetchAdvertisements();
    }, [onFetchAdvertisements]);

    return (
        <>
            <AdminDeleteAdvertisementModal />
            {
                advertisements?.length > 0 ? advertisements.map((advertisement, index) => <div className="eight wide tablet five wide computer column" key={advertisement.name + index}>
                    <AnuncioCard data={advertisement} />
                    <div className="ui container" style={{ marginTop: "1em" }}>
                        <Link to={`${advertisement.id}/edit/`} state={{ from: location }} className='ui yellow icon button'>
                            <i className='edit icon'></i> Editar Anúncio
                        </Link>
                        <button className="ui negative icon button" onClick={() => onOpenModal(advertisement)}>
                            <i className='trash alternate icon'></i> Deletar
                        </button></div>
                </div>) : isLoading
                    ? <div className="ui active inverted dimmer">
                        <div className="ui text loader">Carregando anúncios...</div>
                    </div>
                    : <div className="ui warning message">
                        <div className="header">Você ainda não possui nenhum anúncio</div>
                        <p>Cadastre um anúncio <Link to="/anunciante/criar-anuncio">aqui</Link>.</p>
                    </div>
            }
        </>
    );
}

export default MeusAnunciosList;
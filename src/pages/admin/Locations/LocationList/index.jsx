import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table';
import Pagination from '../../../../components/admin/table/Pagination';
import AdminDeleteLocationModal from '../components/AdminDeleteLocationModal';
import AdminLocationFilters from '../components/AdminLocationFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage';
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchLocations } from '../../../../store/actions/location';

const LocationList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.location);
    // Coloca os locations na ordem correta
    const locations = indexOrder.map((index) => list[index]);

    // Table
    const { setSelectedItem, isModalOpen, openModal } = useModal();

    const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    }

    const actions = (item) => {
        return <>
            <Link to={`${item.id}/edit/`} state={{ from: location }} className='ui yellow icon button'>
                <i className='edit icon'></i>
            </Link>
            <button className="ui negative icon button" onClick={() => onOpenModal(item)}>
                <i className='trash alternate icon'></i>
            </button>
        </>
    }

    const onFetchLocations = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchLocations(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchLocations();
    }

    useEffect(() => {
        onFetchLocations();
    }, [onFetchLocations]);

    return (
        <>
            <AdminDeleteLocationModal />

            <h2 className="ui header">Listagem de localizações do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    <div className="sixteen wide column">
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR LOCALIZAÇÃO
                        </Link>
                    </div>

                    <div className='left floated left aligned eight wide column'>
                        <AdminLocationFilters />
                    </div>

                    <div className='right floated right aligned eight wide column'>
                        <div className='ui right aligned basic clearing segment no-padding'>
                            <ItemsPerPage totalCount={totalCount} />
                            <button className='ui black icon button refresh' type="button" onClick={onSync}>
                                <i className='sync icon' />
                            </button>
                        </div>
                    </div>

                    <div className='sixteen wide column'>
                        {(isLoading && !isModalOpen) && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Carregando localizações</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar as localizações.</div>
                            <p>
                                A lista de localizações não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <Table
                            items={locations}
                            fields={FIELDS.location}
                            renderCustomActions={actions}
                        />}
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LocationList;
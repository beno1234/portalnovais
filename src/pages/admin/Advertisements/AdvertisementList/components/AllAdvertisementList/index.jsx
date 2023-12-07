import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

/* import { FIELDS } from '../../../../config';
import Table from '../../../../../../components/admin/table/Table'; */
import Pagination from '../../../../../../components/admin/table/Pagination';
import ItemsPerPage from '../../../../../../components/admin/table/ItemsPerPage';
import AdminDeleteAdvertisementModal from '../../../components/AdminDeleteAdvertisementModal';
import AdminAdvertisementFilters from '../../../components/AdminAdvertisementFilters';
// Hooks
import useModal from '../../../../../../hooks/useModal';
// Actions
import { fetchAdvertisements } from '../../../../../../store/actions/advertisement';

const AllAdvertisementList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.advertisement);
    // Coloca os advertisements na ordem correta
    const allAdvertisements = indexOrder.map((index) => list[index]);

    // Table
    const { setSelectedItem, isModalOpen, openModal } = useModal();

    const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    }

    const formatDate = (date) => {
        if (!date) return null;
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Sao_Paulo' };
        return publishDate.toLocaleDateString('pt-BR', dateOptions);
    }

    const formatStatus = (value) => {
        switch (value) {
            case "posted":
                return <span className="green table label">Publicado</span>;
            case "blocked":
                return <span className="red table label">Bloqueado</span>;
            case "review":
                return <span className="yellow table label">Em análise</span>;
            default:
                return null;
        }
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

    const onFetchAdvertisements = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchAdvertisements(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchAdvertisements();
    }

    useEffect(() => {
        onFetchAdvertisements();
    }, [onFetchAdvertisements]);

    return (
        <>
            <AdminDeleteAdvertisementModal />

            <div className='section'>

                <h2 className="ui header">Todos os anúncios</h2>

                <div className='ui bottom aligned stackable grid'>
                    <div className='left floated left aligned sixteen wide column'>
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR ANÚNCIO
                        </Link>
                    </div>

                    <div className='left aligned eight wide column'>
                        <AdminAdvertisementFilters />
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
                            <div className="ui text loader">Carregando anúncios</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar os anúncios.</div>
                            <p>
                                A lista de anúncios não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <table className="ui striped padded table">
                                <thead>
                                    <tr>
                                        <th className='center aligned'>Nome</th>
                                        <th className='center aligned'>E-mail</th>
                                        <th className='center aligned'>WhatsApp</th>
                                        <th className='center aligned'>Cliques no WhatsApp</th>
                                        <th className='center aligned'>Avaliação</th>
                                        <th className='center aligned'>Visualizações</th>
                                        <th className='center aligned'>Status</th>
                                        <th className='center aligned'>Data de expiração</th>
                                        <th className='center aligned'>Certificado</th>
                                        <th className='center aligned'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allAdvertisements?.length > 0
                                        ? allAdvertisements.map((item) => (
                                            <tr key={`advertisement${item.id}`}>
                                                <td className='single line center aligned'><b>{item.name}</b></td>
                                                <td className='single line center aligned'>{item.email}</td>
                                                <td className='single line center aligned'>{item.whatsapp}</td>
                                                <td className='single line center aligned'>{item.whatsappViews}</td>
                                                <td className='single line center aligned'>{item.rating}</td>
                                                <td className='single line center aligned'>{item.views}</td>
                                                <td className='single line center aligned'>{formatStatus(item.status)}</td>
                                                <td className='single line center aligned'>{formatDate(item.expirationDate)}</td>
                                                <td className='single line center aligned'>{item.type === "certified" ? <i className="green check icon"></i> : <i className="red x icon"></i>}</td>
                                                <td className='single line center aligned'>{actions(item)}</td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={9}>Não há nenhum registro.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        }
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllAdvertisementList;
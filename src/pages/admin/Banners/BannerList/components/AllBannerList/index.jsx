import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

/* import { FIELDS } from '../../../../config';
import Table from '../../../../../../components/admin/table/Table'; */
import Pagination from '../../../../../../components/admin/table/Pagination';
import ItemsPerPage from '../../../../../../components/admin/table/ItemsPerPage';
import AdminDeleteBannerModal from '../../../components/AdminDeleteBannerModal';
import AdminBannerFilters from '../../../components/AdminBannerFilters';
// Hooks
import useModal from '../../../../../../hooks/useModal';
// Actions
import { fetchBanners } from '../../../../../../store/actions/banner';

const AllBannerList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.banner);
    // Coloca os banners na ordem correta
    const allBanners = indexOrder.map((index) => list[index]);

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

    const formatType = (value) => {
        switch (value) {
            case "maxBanner":
                return "Max Banner";
            case "featured":
                return "Destaque";
            case "miniBanner":
                return "Mini Banner";
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

    const onFetchBanners = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchBanners(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchBanners();
    }

    useEffect(() => {
        onFetchBanners();
    }, [onFetchBanners]);

    return (
        <>
            <AdminDeleteBannerModal />

            <div className='section'>

                <h2 className="ui header">Todos os banners</h2>

                <div className='ui bottom aligned stackable grid'>
                    <div className='left floated left aligned sixteen wide column'>
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR BANNER
                        </Link>
                    </div>

                    <div className='left aligned eight wide column'>
                        <AdminBannerFilters />
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
                            <div className="ui text loader">Carregando banners</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar os banners.</div>
                            <p>
                                <b>{error.message}</b><br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <table className="ui striped padded table">
                                <thead>
                                    <tr>
                                        <th className='center aligned'>Nome da empresa</th>
                                        {/* <th className='center aligned'>E-mail</th>
                                        <th className='center aligned'>WhatsApp</th> */}
                                        <th className='center aligned'>Tipo</th>
                                        <th className='center aligned'>Link</th>
                                        <th className='center aligned'>Status</th>
                                        <th className='center aligned'>Data de expiração</th>
                                        <th className='center aligned'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBanners?.length > 0
                                        ? allBanners.map((item) => (
                                            <tr key={`banner${item.id}`}>
                                                <td className='single line center aligned'><b>{item.name}</b></td>
                                                {/* <td className='single line center aligned'>{item.email}</td>
                                                <td className='single line center aligned'>{item?.whatsApp ? formatString('(99) 99999-9999', item.whatsApp) : null}</td> */}
                                                <td className='single line center aligned'>{formatType(item.type)}</td>
                                                <td className='single line center aligned'>{item.site}</td>
                                                <td className='single line center aligned'>{formatStatus(item.status)}</td>
                                                <td className='single line center aligned'>{formatDate(item.expirationDate)}</td>
                                                <td className='single line center aligned'>{actions(item)}</td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={6}>Não há nenhum registro.</td></tr>}
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

export default AllBannerList;
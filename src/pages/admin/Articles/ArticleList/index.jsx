import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

/* import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table'; */
import Pagination from '../../../../components/admin/table/Pagination';
import AdminDeleteArticleModal from '../components/AdminDeleteArticleModal';
import AdminArticleFilters from '../components/AdminArticleFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage';
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchArticles } from '../../../../store/actions/article';

const ArticleList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.article);
    // Coloca os articles na ordem correta
    const articles = indexOrder.map((index) => list[index]);

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

    const onFetchArticles = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchArticles(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchArticles();
    }

    useEffect(() => {
        onFetchArticles();
    }, [onFetchArticles]);

    return (
        <>
            <AdminDeleteArticleModal />

            <h2 className="ui header">Listagem de matérias do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    <div className="sixteen wide column">
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR MATÉRIA
                        </Link>
                    </div>

                    <div className='left floated left aligned eight wide column'>
                        <AdminArticleFilters />
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
                            <div className="ui text loader">Carregando matérias</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar as matérias.</div>
                            <p>
                                A lista de matérias não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <table className="ui striped padded table">
                                <thead>
                                    <tr>
                                        <th className='center aligned'>Título</th>
                                        <th className='center aligned'>Visualizações</th>
                                        <th className='center aligned'>Categoria</th>
                                        <th className='center aligned'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles?.length > 0
                                        ? articles.map((item) => (
                                            <tr key={`articles${item.id}`}>
                                                <td className='single line center aligned'><b>{item.title}</b></td>
                                                <td className='single line center aligned'>{item.views}</td>
                                                <td className='single line center aligned'>{item.category?.name && item.category?.name}</td>
                                                <td className='single line center aligned'>{actions(item)}</td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={4}>Não há nenhum registro.</td></tr>}
                                </tbody>
                            </table>
                        </div>}
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArticleList;
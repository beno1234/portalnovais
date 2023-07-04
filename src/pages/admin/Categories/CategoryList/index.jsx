import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

/* import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table'; */
import Pagination from '../../../../components/admin/table/Pagination';
import AdminDeleteCategoryModal from '../components/AdminDeleteCategoryModal';
import AdminCategoryFilters from '../components/AdminCategoryFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage';
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchCategories } from '../../../../store/actions/category';

const CategoryList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.category);
    // Coloca os categorys na ordem correta
    const categories = indexOrder.map((index) => list[index]);

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

    const onFetchCategories = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchCategories(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchCategories();
    }

    useEffect(() => {
        onFetchCategories();
    }, [onFetchCategories]);

    return (
        <>
            <AdminDeleteCategoryModal />

            <h2 className="ui header">Listagem de categorias do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    <div className="sixteen wide column">
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR CATEGORIA
                        </Link>
                    </div>

                    <div className='left floated left aligned eight wide column'>
                        <AdminCategoryFilters />
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
                            <div className="ui text loader">Carregando categorias</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar as categorias.</div>
                            <p>
                                A lista de categorias não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <table className="ui striped padded table">
                                <thead>
                                    <tr>
                                        <th className='center aligned'>Nome</th>
                                        <th className='center aligned'>Quantidade máxima de envios por cotação</th>
                                        <th className='center aligned'>Destaque na Home</th>
                                        <th className='center aligned'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.length > 0
                                        ? categories.map((item) => (
                                            <tr key={`category${item.id}`}>
                                                <td className='single line center aligned'><b>{item.name}</b></td>
                                                <td className='single line center aligned'>{item.maxQuotes}</td>
                                                <td className='single line center aligned'>{item.isFeatured ? <i className="green check icon"></i> : <i className="red x icon"></i>}</td>
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

export default CategoryList;
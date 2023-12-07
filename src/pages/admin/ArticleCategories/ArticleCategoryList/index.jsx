import _ from 'lodash';
import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table';
import Pagination from '../../../../components/admin/table/Pagination';
import AdminDeleteArticleCategoryModal from '../components/AdminDeleteArticleCategoryModal';
/* import AdminArticleCategoryFilters from '../components/AdminArticleCategoryFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage'; */
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchArticleCategories } from '../../../../store/actions/category';

const ArticleCategoryList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.category);
    // Coloca os categorys na ordem correta
    const categories = indexOrder.map((index) => list[index]);

    // Deep copy para perder a referência
    const allCategories = _.cloneDeep(categories);
    const subCategories = [];

    for (let i = 0; i < categories.length; i++) {
        if (allCategories[i].categories?.length > 0) {
            for (let j = 0; j < allCategories[i].categories.length; j++) {
                allCategories[i].categories[j].parentCategory = allCategories.find(category => category.id === allCategories[i].categories[j].idCategoryParent).name;
                subCategories.push(allCategories[i].categories[j]);
            }
        }
    }

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
            <button className={`ui negative icon button ${item.categories?.length > 0 && 'disabled'}`} onClick={() => onOpenModal(item)}>
                <i className='trash alternate icon'></i>
            </button>
        </>
    }

    const subCategoryActions = (item) => {
        return <>
            <Link to={`${item.id}/edit-sub/`} state={{ from: location }} className='ui yellow icon button'>
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

        dispatch(fetchArticleCategories(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchCategories();
    }

    useEffect(() => {
        onFetchCategories();
    }, [onFetchCategories]);

    return (
        <>
            <AdminDeleteArticleCategoryModal />

            <h2 className="ui header">Listagem de categorias de matérias do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    {/* <div className="sixteen wide column">
                        
                    </div> */}

                    <div className='left floated left aligned eight wide column'>
                        {/* <AdminArticleCategoryFilters /> */}
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR CATEGORIA
                        </Link>

                        <Link to="create-sub" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR SUBCATEGORIA
                        </Link>
                    </div>

                    <div className='right floated right aligned eight wide column'>
                        <div className='ui right aligned basic clearing segment no-padding'>
                            {/* <ItemsPerPage totalCount={totalCount} /> */}
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
                        </div> : <>
                            <div className="ui header">Categorias</div>
                            <Table
                                items={categories}
                                fields={FIELDS.articleCategory}
                                renderCustomActions={actions}
                            />
                            <div className="ui header">Subcategorias</div>
                            <Table
                                items={subCategories}
                                fields={FIELDS.subCategory}
                                renderCustomActions={subCategoryActions}
                                tableKey={"SUBCATEGORIA"}
                            />
                        </>}
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArticleCategoryList;
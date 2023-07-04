import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import AdminArticleSubCategoryForm from '../components/AdminArticleSubCategoryForm';
// Action Creator
import { fetchSubCategory, editSubCategory } from '../../../../store/actions/category';

const ArticleSubCategoryEdit = () => {
    const { id } = useParams();

    const { selectedSubCategory, isLoading, error } = useSelector((state) => state.category);

    const initialValues = {
        name: selectedSubCategory?.name
    }
    if (selectedSubCategory?.idCategoryParent) initialValues.idCategoryParent = selectedSubCategory.idCategoryParent;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/admin/article-categories";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        const success = await dispatch(editSubCategory(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchCategory = useCallback((id) => {
        dispatch(fetchSubCategory(id));
    }, [dispatch])

    const onSync = () => {
        onFetchCategory(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdminArticleSubCategoryForm
                edit
                initialValues={initialValues}
                onSubmit={onSubmit}
                disableSubmit={isLoading} // || error
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver category isso quer dizer que o erro é referente à atualização dele
            if (selectedSubCategory) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados da categoria.</div>
                        <p>
                            Os dados da categoria não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdminArticleSubCategoryForm
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados da categoria.</div>
                    <p>
                        Os dados da categoria não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!selectedSubCategory) {
            onFetchCategory(id);
        }
    }, [dispatch, selectedSubCategory, id, onFetchCategory]);

    return (
        <>
            <h2 className="ui header">Edição da categoria</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{selectedSubCategory ? 'Atualizando categoria...' : 'Carregando categoria...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArticleSubCategoryEdit;
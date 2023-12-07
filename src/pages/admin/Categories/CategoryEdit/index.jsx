import React, { useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import AdminCategoryForm from '../components/AdminCategoryForm';
// Action Creator
import { fetchCategory, editCategory } from '../../../../store/actions/category';

const CategoryEdit = () => {
    const { id } = useParams();

    const category = useSelector((state) => state.category.list[id]);
    const { isLoading, error } = useSelector((state) => state.category);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/admin/categories";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        formValues.maxQuotes = parseInt(formValues.maxQuotes, 10);
        const success = await dispatch(editCategory(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const initialValues = useMemo(() => {
        return {
            name: category?.name,
            maxQuotes: category?.maxQuotes,
            isFeatured: category?.isFeatured,
            description: category?.description
        }
    }, [category]);

    const onFetchCategory = useCallback((id) => {
        dispatch(fetchCategory(id));
    }, [dispatch])

    const onSync = () => {
        onFetchCategory(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdminCategoryForm
                edit
                image={category?.image}
                initialValues={initialValues}
                onSubmit={onSubmit}
                disableSubmit={isLoading} // || error
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver category isso quer dizer que o erro é referente à atualização dele
            if (category) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados da categoria.</div>
                        <p>
                            Os dados da categoria não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdminCategoryForm
                        image={category?.image}
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
        if (!category) {
            onFetchCategory(id);
        }
    }, [dispatch, category, id, onFetchCategory]);

    return (
        <>
            <h2 className="ui header">Edição da categoria</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{category ? 'Atualizando categoria...' : 'Carregando categoria...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryEdit;
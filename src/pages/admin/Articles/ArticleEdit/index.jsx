import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import AdminArticleForm from '../components/AdminArticleForm';
// Action Creator
import { fetchArticle, editArticle } from '../../../../store/actions/article';

const ArticleEdit = () => {
    const { id } = useParams();

    const article = useSelector((state) => state.article.list[id]);
    const { isLoading, error } = useSelector((state) => state.article);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        const success = await dispatch(editArticle(id, formValues));
        if (success) navigateToPreviousPage();
    }

    const onFetchArticle = useCallback((id) => {
        dispatch(fetchArticle(id));
    }, [dispatch])

    const onSync = () => {
        onFetchArticle(id);
    }

    const renderContent = () => {
        // Se não houver erro, mostra apenas o formulário
        if (!error) {
            return <AdminArticleForm
                image={article?.image}
                description={article?.description}
                initialValues={{
                    title: article?.title,
                    categoryId: article?.categoryId
                }}
                onSubmit={onSubmit}
                disableSubmit={isLoading} // || error
                onCancel={navigateToPreviousPage}
            />
        } else {
            // Se houver article isso quer dizer que o erro é referente à atualização dele
            if (article) {
                return <>
                    {!isLoading && <div className="ui error message">
                        <div className="header">Não foi possível atualizar os dados da matéria.</div>
                        <p>
                            Os dados da matéria não foram atualizados por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                    <AdminArticleForm
                        image={article?.image}
                        description={article?.description}
                        initialValues={{
                            title: article?.title,
                            categoryId: article?.categoryId
                        }}
                        onSubmit={onSubmit}
                        disableSubmit={isLoading}
                        onCancel={navigateToPreviousPage}
                    />
                </>
            } else {
                return <div className="ui error message">
                    <div className="header">Não foi possível carregar os dados da matéria.</div>
                    <p>
                        Os dados da matéria não foram carregados por <b>{error.message}</b>.<br />
                        Por favor, tente carregar os dados novamente.
                    </p>
                    <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                </div>
            }
        }
    }

    useEffect(() => {
        if (!article) {
            onFetchArticle(id);
        }
    }, [dispatch, article, id, onFetchArticle]);

    return (
        <>
            <h2 className="ui header">Edição da matéria</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{article ? 'Atualizando matéria...' : 'Carregando matéria...'}</div>
                        </div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArticleEdit;
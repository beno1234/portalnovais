import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AdminArticleForm from '../components/AdminArticleForm';
// Action Creator
import { createArticle } from '../../../../store/actions/article';

const ArticleCreate = () => {
    const { isLoading } = useSelector((state) => state.article);

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
        const success = await dispatch(createArticle(formValues));
        if (success) navigateToPreviousPage();
    }

    return (
        <>
            <h2 className="ui header">Criação de uma matéria</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando a matéria...</div>
                        </div>}
                        <AdminArticleForm
                            onSubmit={onSubmit}
                            disableSubmit={isLoading}
                            onCancel={navigateToPreviousPage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ArticleCreate;
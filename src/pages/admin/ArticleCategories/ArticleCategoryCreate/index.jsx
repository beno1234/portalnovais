import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AdminArticleCategoryForm from '../components/AdminArticleCategoryForm';
// Action Creator
import { createCategory } from '../../../../store/actions/category';

const ArticleCategoryCreate = () => {
    const { isLoading } = useSelector((state) => state.category);

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
        const mockup = {
            "maxQuotes": 0
        }
        formValues = { ...mockup, ...formValues };
        formValues.type = "Article";
        const success = await dispatch(createCategory(formValues));
        if (success) navigateToPreviousPage();
    }

    return (
        <>
            <h2 className="ui header">Criação de uma categoria</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando a categoria...</div>
                        </div>}
                        <AdminArticleCategoryForm
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

export default ArticleCategoryCreate;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AdminCategoryForm from '../components/AdminCategoryForm';
// Action Creator
import { createCategory } from '../../../../store/actions/category';

const CategoryCreate = () => {
    const { isLoading } = useSelector((state) => state.category);

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
                        <AdminCategoryForm
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

export default CategoryCreate;
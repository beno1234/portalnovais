import _ from 'lodash';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AdminUserForm from '../components/AdminUserForm';
// Action Creator
import { createUser } from '../../../../store/actions/user';

const UserCreate = () => {
    const { isLoading } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/admin/users";
    const search = from ? from.search : '';

    const navigateToPreviousPage = () => {
        navigate(pathname + search, { replace: true });
    }

    const onSubmit = async (formValues) => {
        if (formValues.document) {
            formValues.document = formValues.document.replace(/\D/g, "");
        }

        const success = await dispatch(createUser(_.omit(formValues, "confirmPassword")));
        if (success) navigateToPreviousPage();
    }

    return (
        <>
            <h2 className="ui header">Criação de um usuário</h2>
            <div className='section'>
                <div className='ui grid'>
                    <div className='column'>
                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Criando o usuário...</div>
                        </div>}
                        <AdminUserForm
                            create
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

export default UserCreate;
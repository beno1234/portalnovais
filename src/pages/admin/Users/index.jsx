import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Users = () => {
    return (
        <>
            <Header title="Usuários" subHeader="Manipulando e visualizando os usuários." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Users;
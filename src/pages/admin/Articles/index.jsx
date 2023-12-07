import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Articles = () => {
    return (
        <>
            <Header title="Matérias" subHeader="Manipulando e visualizando as matérias." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Articles;
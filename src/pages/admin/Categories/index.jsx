import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Categories = () => {
    return (
        <>
            <Header title="Categorias de serviços" subHeader="Manipulando e visualizando as categorias dos serviços." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Categories;
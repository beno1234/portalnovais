import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const ArticleCategories = () => {
    return (
        <>
            <Header title="Categorias de matérias" subHeader="Manipulando e visualizando as categorias das matérias." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default ArticleCategories;
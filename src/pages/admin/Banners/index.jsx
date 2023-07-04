import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Banners = () => {
    return (
        <>
            <Header title="Banners" subHeader="Manipulando e visualizando os banners dos anunciantes." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Banners;
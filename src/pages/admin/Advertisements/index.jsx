import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Advertisements = () => {
    return (
        <>
            <Header title="Anúncios" subHeader="Manipulando e visualizando os anúncios." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Advertisements;
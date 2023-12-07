import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Quotations = () => {
    return (
        <>
            <Header title="Cotações" subHeader="Manipulando e visualizando as cotações." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Quotations;
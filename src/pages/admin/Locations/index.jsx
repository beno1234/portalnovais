import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../../../components/admin/Header';

const Locations = () => {
    return (
        <>
            <Header title="Localizações" subHeader="Manipulando e visualizando as localizações." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Locations;
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import { Outlet } from 'react-router-dom';

import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';

const MeusBanners = () => {
    return (
        <>
            <Masthead />

            <div className='ui inverted vertical masthead secondary profile banner center aligned segment'>
                <div className="ui container">
                    <div className="ui equal width stackable grid">
                        <div className='center aligned row'>
                            <div className='column'>
                                <h1 className="ui inverted header">
                                    Meus banners
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='ui vertical section segment'>
                <div className='ui stackable centered grid'>
                    <div className='fifteen wide tablet custom ten wide computer column'>
                        <div className="ui stackable grid">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default MeusBanners;
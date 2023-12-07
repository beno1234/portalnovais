import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import useMenu from '../../hooks/useMenu';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import SideBarMenu from '../../components/SideBarMenu';

const NoMatchPage = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui login section container'>
                    <div className='ui middle aligned center aligned grid'>
                        <div className="ui warning message">Ops, você se perdeu? Essa página não existe.</div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default NoMatchPage;
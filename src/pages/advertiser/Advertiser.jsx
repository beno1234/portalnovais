import React from 'react';
import { Outlet } from 'react-router-dom';

import useMenu from '../../hooks/useMenu';
import SideBarMenu from '../../components/SideBarMenu';

const Advertiser = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();
    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Outlet />
            </div>
        </>
    );
}

export default Advertiser;

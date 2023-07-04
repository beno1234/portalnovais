import './admin.css';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

import history from '../../routes/history';
import AdminSideBarMenu from '../../components/admin/menu/AdminSideBarMenu';
import { openMenu, closeMenu } from '../../store/actions/menu';

const Admin = () => {
  const isSideBarOpen = useSelector((state) => state.menu.isSideBarOpen);
  const dispatch = useDispatch();

  const openSideBar = () => {
    dispatch(openMenu());
  }

  const closeSideBar = useCallback(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      isSideBarOpen && closeSideBar();
    });

    return unlisten;
  }, [isSideBarOpen, closeSideBar]);

  return (
    <div id="main">

      <AdminSideBarMenu mobile isSideBarOpen={isSideBarOpen} onClose={closeSideBar} />

      <div className="ui fixed inverted main menu">
        <div className="ui container">
          <button className="icon item link" onClick={openSideBar}>
            <i className="content icon"></i>
          </button>

          <div className="item">
            Portal Noivas
          </div>
        </div>
      </div>

      <div className='pusher' onClick={isSideBarOpen ? closeSideBar : undefined}>
        <div className='full height'>
          <div className='toc'>
            <AdminSideBarMenu />
          </div>
          <div className="article">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

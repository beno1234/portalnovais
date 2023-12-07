import React, { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import history from '../routes/history';
import { closeMenu, openMenu } from '../store/actions/menu';
import { tryLogoff } from '../store/actions/auth';

const SideBarMenu = (/* { isSideBarOpen, onClose } */) => {
  const isSideBarOpen = useSelector((state) => state.menu.isSideBarOpen);
  const { user, isSignedIn } = useSelector((state) => state.auth);
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

  const onLogOutClick = () => {
    isSideBarOpen && closeSideBar();
    dispatch(tryLogoff());
  }

  return (
    <>
      <div className='gap'></div>
      <div className="ui fixed inverted main menu menulateral">
        <div className="ui container">
          <button className="hamburger icon item link" onClick={openSideBar}>
            <i className="content icon"></i>
          </button>

          <div className="">
            <img alt="Portal Noivas" className="logo image" src="/logo.png" />
          </div>
        </div>
      </div>

      <div className={`ui vertical inverted sidebar menu left ${isSideBarOpen && 'overlay visible'} menu-lateral-aberto`}>
        <Link to="/" className="active item link">Home</Link>
        <Link to="/anuncios" className="item link">Guia de empresas</Link>
        <Link to="/materias" className="item link">Matérias</Link>
        <Link to="/anuncie-aqui" className="item link">Anuncie aqui</Link>
        {
          (isSignedIn && user?.role !== "advertiser") && <>
            <Link to="/minhas-cotacoes" className="item link">
              Minhas cotações
            </Link>
          </>
        }
        <Link to="/cotacao" className="item link">Cotação Express</Link>
        {
          (isSignedIn && user.role === "advertiser") && <>
            <Link to="/anunciante/meus-anuncios" className="item link">
              Meus Anúncios
            </Link>
            <Link to="/anunciante/criar-anuncio" className="item link">
              <b>Enviar Anúncio</b>
            </Link>
            <Link to="/anunciante/meus-banners" className="item link">
              Meus Banners
            </Link>
            <Link to="/anunciante/criar-banner" className="item link">
              <b>Enviar Banner</b>
            </Link>
          </>
        }
        {
          isSignedIn
            ? <>
              {["admin", "editor", "internal"].includes(user.role) && <Link to={`/${user.role}`} className="item link">
                <i className="cog icon"></i>
                Dashboard
              </Link>}
              <Link to="/perfil" className="item link">
                <i className="user icon"></i>
                {user.name}
              </Link>
              <div className='item'>
                <button className='ui fluid logout button' onClick={onLogOutClick}>
                  <i className='sign-out icon' />
                  Logout
                </button>
              </div>
            </>
            : <>
              <Link to="/cadastro" className="item link">
                <i className="user icon"></i>
                Cadastrar
              </Link>
              <div className="item">
                <Link to="/login" className="ui fluid button">
                  <i className="icon sign-in"></i>
                  Log in
                </Link>
              </div>
            </>
        }
      </div>

    </>);
}

export default SideBarMenu;

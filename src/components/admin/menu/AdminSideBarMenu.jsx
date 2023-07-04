import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { tryLogoff } from '../../../store/actions/auth';
import MenuItem from './MenuItem';

const AdminSideBarMenu = ({ isSideBarOpen, mobile, onClose }) => {
  const { user } = useSelector(state => state.auth);

  const classes = mobile
    ? `ui vertical inverted sidebar menu left ${isSideBarOpen && 'overlay visible'}`
    : 'ui left fixed vertical inverted menu';

  const dispatch = useDispatch();

  const onLogOutClick = () => {
    isSideBarOpen && onClose();
    dispatch(tryLogoff());
  }

  if (isSideBarOpen && !mobile) {
    return null;
  }

  const renderOptions = () => {
    if (user) {
      switch (user.role) {
        case "admin":
          return <>
            <MenuItem toPage="/admin">Início</MenuItem>
            <MenuItem toPage="/admin/users">Usuários</MenuItem>
            <MenuItem toPage="/admin/advertisements">Anúncios</MenuItem>
            <MenuItem toPage="/admin/categories">Categorias de serviços</MenuItem>
            <MenuItem toPage="/admin/locations">Localizações</MenuItem>
            <MenuItem toPage="/admin/quotations">Cotações</MenuItem>
            <MenuItem toPage="/admin/articles">Matérias</MenuItem>
            <MenuItem toPage="/admin/article-categories">Categorias de matéria</MenuItem>
            <MenuItem toPage="/admin/banners">Banners</MenuItem>
          </>
        case "editor":
          return <>
            <MenuItem toPage="/editor">Início</MenuItem>
            <MenuItem toPage="/editor/articles">Matérias</MenuItem>
          </>
        case "internal":
          return <>
            <MenuItem toPage="/internal">Início</MenuItem>
            <MenuItem toPage="/internal/advertisements">Anúncios</MenuItem>
            <MenuItem toPage="/internal/quotations">Cotações</MenuItem>
            <MenuItem toPage="/internal/banners">Banners</MenuItem>
          </>
        default:
          return null;
      }
    }
  }

  return (
    <div className={classes}>
      <Link to="/">
        <div className='item link'>
          <img alt="Portal Noivas" className="admin logo image" src="/logo.png" />
          <p>Retornar ao Portal Noivas</p>
        </div>
      </Link>

      <div className='item'>
        <button className='ui fluid logout button' onClick={onLogOutClick}>
          <i className='sign-out icon' />
          Sair da conta
        </button>
      </div>

      {renderOptions()}
    </div>
  )
}

export default AdminSideBarMenu;
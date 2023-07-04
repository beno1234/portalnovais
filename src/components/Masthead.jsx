import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { tryLogoff } from '../store/actions/auth';

const Masthead = () => {
    const { user, isSignedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const onLogOut = () => {
        dispatch(tryLogoff());
    }

    return (
        <div className='masthead menuprincipal'>
            <div className="ui inverted vertical masthead top center aligned segment">
                <div className="ui text container">
                    <h1 className="ui inverted header">
                        <img alt="Portal Noivas" className="logo image" src="/logo.png" />
                    </h1>
                </div>
            </div>

            <div className="ui container">
                <div className="ui large secondary menu">
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
                    <div className="right item">
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
                                    <button className="ui basic button" onClick={onLogOut}>
                                        <i className="icon sign-out"></i>
                                        Log out
                                    </button>
                                </>
                                : <Link to="/login" className="ui basic button">
                                    <i className="icon sign-in"></i>
                                    Log in
                                </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Masthead;
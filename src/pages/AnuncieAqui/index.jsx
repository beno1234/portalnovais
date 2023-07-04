import 'semantic-ui-css/semantic.min.css';
import './index.css';
import React from 'react';
import { Link } from 'react-router-dom';

import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import SideBarMenu from '../../components/SideBarMenu';
import useMenu from '../../hooks/useMenu';

const AnuncieAqui = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();
    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui advertise section container'>
                    <div className='ui secondary raised segment'>
                        <div className='ui dividing header'>Anuncie no Portal Noivas</div>
                        <p className='title'>Comemorando <b>14 anos no ar, Portal Noivas</b> inaugura novo layout e muitas novidades.</p>
                        <p>Visita de <b>Milhares de noivas por mês, de todo o Brasil!!! Sua empresa não pode ficar de fora desse mercado.</b></p>
                        <div className='ui list'>
                            <div className='item'>
                                <i className='exclamation triangle icon'></i>{' '}
                                Altere seu anúncio quando quiser
                            </div>
                            <div className='item'>
                                <i className='exclamation triangle icon'></i>{' '}
                                Logotipo + 10 Fotos de seus produtos/serviços
                            </div>
                        </div>
                        <p className='types'>Tipos de Anúncios</p>
                        <div className='ui list'>
                            <div className='item'>
                                <i className='exclamation triangle icon'></i>{' '}
                                Anúncio
                            </div>
                            <div className='bold item'>
                                <i className='exclamation triangle icon'></i>{' '}
                                Mini-banner
                            </div>
                            <div className='item'>
                                <i className='exclamation triangle icon'></i>{' '}
                                Destaque
                            </div>
                        </div>
                        <h3>Anúncio no Guia de Empresas</h3>
                        <Link to='/login' className='link'>Para mais informações, clique aqui</Link>
                        <h3>Mini-banner (174x70 pixels) no Guia de Empresas</h3>
                        <p><b>Promoção</b>: Contratando o mini-banner, sua empresa ganha 1 anúncio no Guia de Empresas, para receber cotações de noivas por e-mail.</p>
                        <Link to='/login' className='link'>Para mais informações, clique aqui</Link>
                        <h3>Destaque (174x280 pixels) no Guia de Empresas</h3>
                        <p><b>Promoção</b>: Contratando o destaque, sua empresa ganha 1 anúncio no Guia de Empresas, para receber cotações de noivas por e-mail.</p>
                        <Link to='/login' className='link'>Para mais informações, clique aqui</Link>

                        <h3>Para mais informações e preços, acesse a sua conta.</h3>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default AnuncieAqui;
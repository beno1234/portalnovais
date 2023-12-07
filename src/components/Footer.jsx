import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="ui inverted vertical footer segment">
            <div className="ui container">
                <div className="ui stackable inverted divided equal height stackable grid">
                    <div className='row'>
                        <div className='left floated four wide column'>
                            <img alt="Portal Noivas" className="footer logo image" src="/logo.png" />
                        </div>
                    </div>
                    <div className="three wide column">
                        <h4 className="ui inverted header">Sobre</h4>
                        <div className="ui inverted link list">
                            <Link to="/anuncios" className="item link">Guia de empresas</Link>
                            <Link to="/materias" className="item link">Matérias</Link>
                            <Link to="/cotacao" className="item link">Cotação Express</Link>
                            <Link to="/anuncie-aqui" className="item link">Anuncie aqui</Link>
                        </div>
                    </div>
                    {/* <div className="three wide column">
                        <h4 className="ui inverted header">Serviços</h4>
                        <div className="ui inverted link list">
                            <div className="item">Fotografia</div>
                            <div className="item">Locais</div>
                            <div className="item">Essenciais para lista de casamento</div>
                            <div className="item">Bolos</div>
                            <div className="item">Decoração</div>
                            <div className="item">Acomodação</div>
                            <div className="item">Alianças</div>
                            <div className="item">Acessórios</div>
                            <div className="item">Vestidos</div>
                        </div>
                    </div> */}
                    <div className="seven wide column">
                        <h4 className="ui inverted header">Fique por dentro</h4>
                        <p>
                            <a href="https://www.instagram.com/portal_noivas/"><i className='instagram large link icon'></i></a>
                            <a href="https://www.facebook.com/portalnoivas/"><i className='facebook large link icon'></i></a>
                            {/* <i className='mail large link icon'></i> */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
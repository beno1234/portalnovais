import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/admin/Header';

const NoMatch = () => {
    return (
        <>
            <Header title="Página não encontrada" subHeader="Não foi possível encontrar essa página." />
            <div className='main ui intro basic container'>
                <div className='section'>
                    <h3 className="ui header">
                        Parece que você está em uma página que não pertence ao sistema.{' '}
                        <Link to="/admin">Voltar à página inicial.</Link>
                    </h3>
                </div>
            </div>
        </>
    )
}

export default NoMatch;

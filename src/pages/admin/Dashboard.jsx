import React from 'react';

import Header from '../../components/admin/Header';

export default function Dashboard() {
  return (
    <>
      <Header title="Bem vindo!" subHeader="Página principal do sistema." />
      <div className='main ui intro basic container'>
        <div className='section'>
          <div className="ui icon message">
            <i className="chart bar icon"></i>
            <div className="content">
              <div className="header">
                Boas vindas ao sistema administrativo do <b>Portal Noivas</b>.
              </div>
              <p>Por este sistema você visualiza e manipula os dados do negócio.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

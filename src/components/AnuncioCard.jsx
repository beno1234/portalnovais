import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { incrementAdvertisementWhatsappView } from '../store/actions/advertisement';
import { getFile } from '../store/actions/file';

const AnuncioCard = ({ data }) => {
    const [image, setImage] = useState('');

    const onFetchImage = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) setImage(response);
    }, []);

    const onWhatsAppClick = (id) => {
        incrementAdvertisementWhatsappView(id);
    }

    useEffect(() => {
        data && onFetchImage(data.cover);
    }, [data, onFetchImage]);

    return <div className='ui segment link anuncio card'>
        {/* {data.sale && <div className="ui yellow ribbon label sale">PROMOÇÃO</div>} */}
        {data.sale && <div className="ui yellow right corner label"><i className='icon tag'></i></div>}
        <Link to={`/anuncios/${data.id}`}>
            <div className='image'>
                <img alt="Capa do Anúncio" className="ui centered medium image" src={image} />
            </div>
        </Link>

        <div className='content'>
            <Link to={`/anuncios/${data.id}`}>
                <div className='header'>
                    {data.type === "certified" && <p className='certified title'><i className='icon blue certificate'></i>Certificado</p>}
                    {data.name}
                </div>
            </Link>

            <div className='meta' style={{ marginTop: "2em" }}>
                <div className='categories-card-text'>
                    {/* <div className='category-text'></div> */}
                    {
                        data.categories && Object.values(data.categories).map((item, index) => <div className="ui tag category label" key={`cardCategory${index}`}>{item.category.name}</div>)
                    }
                </div>
                <div className="locations-card-text">
                    <i className='icon map marker' />{' '}
                    {
                        data.locations && Object.values(data.locations).map((item, index) => <span style={{ marginRight: "1em" }} key={`cardLocation${index}`}>{item.location.name}</span>)
                    }
                </div>
            </div>
            {data.whatsapp && <div className='item' style={{ marginTop: "1em" }}>
                <div className='content'>
                    <a href={`https://web.whatsapp.com/send?phone=55${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="ui green button" onClick={() => onWhatsAppClick(data?.id)}>
                        <i className='whatsapp alternate icon'></i>
                        Iniciar Conversa
                    </a>
                </div>
            </div>}
            {data.sale && <div className='description' style={{ marginTop: "1em" }}>
                <div className="ui warning message">
                    <i className="icon tag" />
                    <b>PROMOÇÃO</b>: {data.sale}
                </div>
            </div>}
        </div>

        <div className='extra content'>
            {data.status === "review" && <div style={{ fontSize: "1.2em" }}>
                <b style={{ color: "#eab676" }}>
                    <i className="warning icon"></i>
                    EM ANÁLISE
                </b><br />
                Seu anúncio está sob análise. Caso seja aprovado, o anúncio irá a público no Guia de Empresas.
            </div>
            }
            {data.status === "blocked" && <div style={{ fontSize: "1.2em" }}>

                <b style={{ color: "#FF0000" }} b>
                    <i className="x icon"></i>
                    BLOQUEADO
                </b><br />
                O seu anúncio foi analisado e não foi aprovado. Por favor faça alterações e envie novamente.
            </div>
            }
            <div className='left floated'>
                {(data.status !== "blocked" && data.status !== "review") && <Link to={`/anuncios/${data.id}`} className='ui button'>Mais informações</Link>}
            </div>
            <div className='right floated'>
                <div className="item">
                    <i className='star icon'></i>{' '}
                    {Math.round(data.rating * 10) / 10}
                </div>
                <div className="item">
                    <i className='eye icon'></i>{' '}
                    {data.views}
                </div>
            </div>
        </div>
    </div>;
}

export default AnuncioCard;
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { getFile } from '../store/actions/file';

const BannerCard = ({ data }) => {
    const [image, setImage] = useState('');

    const onFetchImage = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) setImage(response);
    }, []);

    useEffect(() => {
        data && onFetchImage(data.cover);
    }, [data, onFetchImage]);

    return <Link to={`${data.id}/edit/`}>
        <div className='ui segment link anuncio card'>
            <div className='image'>
                <img alt="Capa do Anúncio" className="ui centered medium image" src={image} />
            </div>
            <div className='content'>
                <div className='header'>{data.name}</div>
                <div className='meta'>
                    <div className='categories-card-text'>
                        {
                            data.categories && Object.values(data.categories).map((item, index) => <div className="ui tag category label" key={`cardCategory${index}`}>{item.category.name}</div>)
                        }
                    </div>
                </div>
                <div className='description'>
                    Link: {data.site}<br />
                    {/* E-mail: {data.email}<br />
                    WhatsApp: {data?.whatsApp ? formatString('(99) 99999-9999', data.whatsApp) : null} */}
                </div>
            </div>
            <div className='extra content'>
                {data.status === "review" && <div style={{ fontSize: "1.2em" }}>
                    <b style={{ color: "#eab676" }}>
                        <i className="warning icon"></i>
                        EM ANÁLISE
                    </b><br />
                    Seu banner está sob análise. Caso seja aprovado, o banner irá a público.
                </div>
                }
                {data.status === "blocked" && <div style={{ fontSize: "1.2em" }}>

                    <b style={{ color: "#FF0000" }}>
                        <i className="x icon"></i>
                        BLOQUEADO
                    </b><br />
                    O seu banner foi analisado e não foi aprovado. Por favor faça alterações e envie novamente.
                </div>
                }
                {(data.status !== "blocked" && data.status !== "review") && <button className='ui button'>Mais informações</button>}
            </div>
        </div>
    </Link>;
}

export default BannerCard;
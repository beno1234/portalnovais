import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFile } from '../store/actions/file';
/* import { Editor, EditorState, convertFromRaw } from 'draft-js';

import { isJsonString } from '../utils'; */

const ArticleCard = ({ data }) => {
    const publishDate = new Date(data?.publishedAt);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Sao_Paulo' };
    const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

    const [image, setImage] = useState('');

    const onFetchImage = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) setImage(response);
    }, []);

    useEffect(() => {
        data && onFetchImage(data.image);
    }, [data, onFetchImage]);

    return <Link to={`/materias/${data.id}`}>
        <div className='ui segment link anuncio card'>
            <div className='image'>
                <img alt="Matéria" className="ui centered medium image" src={image} />
            </div>
            <div className='content'>
                <div className='header'>
                    {data.title}
                    <p className='meta' style={{ fontSize: "0.75em" }}>{readableDate}</p>
                </div>
                <div className='meta'>
                    <div className="ui tag label" style={{ marginTop: "1em", marginBottom: "1em" }}>{data.category?.name}</div>

                </div>{/* 
                <div className='description'>
                    {isJsonString(data.description)
                        ? <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(data?.description)))} readOnly={true} />
                        : <p>{data.description}</p>
                    }
                </div> */}
            </div>
            <div className='extra content'>
                <span className='right floated'>
                    <i className="eye icon"></i>
                    {data.views}
                </span>
            </div>
        </div>
    </Link>
}

export default ArticleCard;
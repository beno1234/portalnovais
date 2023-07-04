import React, { useEffect, useState, useCallback } from 'react';

import { getFile } from '../store/actions/file';

const FaturedCategoryCard = ({ data, onSearch }) => {
    const [image, setImage] = useState('');

    const onFetchImage = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) setImage(response);
    }, []);

    useEffect(() => {
        data && onFetchImage(data.image);
    }, [data, onFetchImage]);

    return <div className='category card' key={`featCategoryCard${data.id}`} onClick={() => onSearch({ category: data.id })}>
        <div className='streched image'>
            {image && <img alt="Fotografia" className="ui centered streched image" src={image} />}
            <div className='category center aligned title'>
                <div className='category content'>
                    <h3>{data.name && data.name}</h3>
                    <h4>{data.description && data.description}</h4>
                </div>
            </div>
        </div>
    </div>
}

export default FaturedCategoryCard;
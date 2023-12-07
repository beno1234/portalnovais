import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInRegionSaleAdvertisements } from '../../../../store/actions/advertisement';
import AnuncioCard from '../../../../components/AnuncioCard';

const InRegionSaleAdvertisementList = ({ category }) => {
    const dispatch = useDispatch();
    const { inSaleList } = useSelector((state) => state.advertisement);
    // Coloca os anúncios na ordem correta
    const advertisements = Object.values(inSaleList);

    const { user } = useSelector((state) => state.auth);

    const onFetchAdvertisements = useCallback(() => {
        const params = new URLSearchParams("rating=best&sale=true&limit=4&");
        category && params.append("category", category.toString());
        user?.locationId && params.append("location", user.locationId);

        dispatch(fetchInRegionSaleAdvertisements(params.toString()));
    }, [dispatch, category, user])

    useEffect(() => {
        onFetchAdvertisements();
    }, [onFetchAdvertisements]);

    // Se o usuario nao tiver um location registrado, nao mostra nada
    if (!user || !user?.locationId) {
        return null;
    }

    return <>
        {
            advertisements.length > 0 && <div className='ui container'>
                <div className='ui vertical section segment'>
                    <h2 className='ui header'>Promoções em sua região</h2>
                    <div className="ui stackable centered grid">
                        {advertisements.map((advertisement, index) => <div className="eight wide tablet four wide computer column" key={advertisement.name + index}>
                            <AnuncioCard data={advertisement} />
                        </div>)}
                    </div>
                </div>
            </div>
        }
    </>
}

export default InRegionSaleAdvertisementList;
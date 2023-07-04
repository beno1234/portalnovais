import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFeaturedAdvertisements } from '../../../../store/actions/advertisement';
import AnuncioCard from '../../../../components/AnuncioCard';

const FeaturedAdvertisementList = ({ category, location }) => {
    const dispatch = useDispatch();
    const { featuredList } = useSelector((state) => state.advertisement);
    // Coloca os anúncios na ordem correta
    const advertisements = Object.values(featuredList);

    const onFetchAdvertisements = useCallback(() => {
        const params = new URLSearchParams("rating=best&type=certified&limit=3&");
        category && params.append("category", category.toString());
        location && params.append("location", location.toString());

        dispatch(fetchFeaturedAdvertisements(params.toString()));
    }, [dispatch, category, location])

    useEffect(() => {
        onFetchAdvertisements();
    }, [onFetchAdvertisements]);

    return <>
        {
            advertisements.length > 0 && <div className='ui inverted vertical recommendation banner center aligned segment'>
                <div className='rotated'>
                    <img alt="Portal Noivas" className="image" src="/logo.png" />
                </div>
                <div className='ui container'>
                    <div className='ui vertical segment'>
                        <h2 className='ui recommendation header'>Anunciantes certificados</h2>
                        <div className="ui stackable centered grid">
                            {advertisements.map((advertisement, index) => <div className="eight wide tablet four wide computer column" key={advertisement.name + index}>
                                <AnuncioCard data={advertisement} />
                            </div>)}
                            {/* <div className='ui link card'>
                                        <div className='image'>
                                            <img alt="Matéria" className="ui centered medium image" src="/categorias/destaque1.png" />
                                        </div>
                                        <div className='content'>
                                            <div className='header'>Anúncio</div>
                                            <div className='meta'>
                                                Bolos | São Paulo
                                                <div className='right floated'>
                                                    <i className='star icon'></i>{' '}
                                                    4.5
                                                </div>
                                            </div>
                                            <div className='description'>
                                                Lorem ipsum do texto da matéria lorem ipsum.
                                            </div>
                                        </div>
                                        <div className='extra content'>
                                            <button className='ui button fluid'>Mais informações</button>
                                        </div>
                                    </div> */}
                        </div>
                    </div>
                </div>
            </div>

        }
    </>
}

export default FeaturedAdvertisementList;
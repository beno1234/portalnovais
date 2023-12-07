import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { fetchPublicBannersLateral } from '../store/actions/banner';
import PublicidadeBannerLateral  from './PublicidadeBannerLateral';

const PublicidadeLateral = ({ category, types, limit, place, random }) => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.banner);
    const banners = Object.values(list);

    const onFetchBanners = useCallback(() => {
        const params = new URLSearchParams();

        types && params.append("type", types.toString());
        place && params.append("bannerPlace", place);
        category && params.append("category", category.toString());
        random && params.append("random", random);
        Number.isInteger(limit) && params.append("limit", limit);

        dispatch(fetchPublicBannersLateral(params.toString()));
    }, [dispatch, category, limit, place, types, random])

    useEffect(() => {
        onFetchBanners();
    }, [onFetchBanners]);

    console.log(banners)

    return (<>
        {
            banners?.length > 0 ?
                place ? <div className="ui container">
                    <div className="ui publicidade center aligned centered">
                        {banners && banners.map(banner => <PublicidadeBannerLateral data={banner} key={`publi${banner.id}`} />)}
                    </div>
                </div> : <>
                    {banners && banners.map(banner => <PublicidadeBannerLateral data={banner} key={`publi${banner.id}`} />)}
                </> : null
        }
    </>);
}

export default PublicidadeLateral;
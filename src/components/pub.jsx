import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { fetchPublicBanners } from '../store/actions/banner';
import PublicidadeBanner from './PublicidadeBanner';

const Publicidade = ({ category, types, limit, place, random }) => {
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

        dispatch(fetchPublicBanners(params.toString()));
    }, [dispatch, category, limit, place, types, random])

    useEffect(() => {
        onFetchBanners();
    }, [onFetchBanners]);

    // Renderiza banners apenas se houver banners e a categoria/localidade correspondente
    const renderBanners = () => {
        if (banners?.length > 0) {
            let filteredBanners = [...banners];

            if (category) {
                filteredBanners = filteredBanners.filter(banner => banner.category === category);
            }

            if (place) {
                filteredBanners = filteredBanners.filter(banner => banner.bannerPlace === place);
            }

            return (
                <div className="ui container">
                    <div className="ui publicidade center aligned centered">
                        {filteredBanners.map(banner => (
                            <PublicidadeBanner data={banner} key={`publi${banner.id}`} />
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    }

    return <>{renderBanners()}</>;
}

export default Publicidade;

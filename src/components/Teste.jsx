import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { fetchPublicBanners } from "../store/actions/banner";

import PublicidadeBanner from "./PublicidadeBanner";
import PublicidadeBannerLateral from "./PublicidadeBannerLateral";

const Teste = ({ category, types, limit, place, random }) => {
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
  }, [dispatch, category, limit, place, types, random]);

  useEffect(() => {
    onFetchBanners();
  }, [onFetchBanners]);

  console.log(banners);

  return (
    <>
      {banners?.length > 0 && (
        <div className="ui container">
          <div className="ui publicidade center aligned centered">
            {types
              ? // Se tipos estiver definido, renderize banners de tipo específico
                banners
                  .filter((banner) => types.includes(banner.type))
                  .map((banner) => (
                    <PublicidadeBanner
                      data={banner}
                      key={`publi${banner.id}`}
                      type={banner.type}
                    />
                  ))
              : // Se tipos não estiver definido, renderize ambos os banners
                banners.map((banner) => (
                  <React.Fragment key={`publi${banner.id}`}>
                    <PublicidadeBanner data={banner} />
                    <PublicidadeBannerLateral data={banner} />
                  </React.Fragment>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Teste;

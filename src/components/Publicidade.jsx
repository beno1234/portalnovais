import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { fetchPublicBanners } from "../store/actions/banner";

import PublicidadeBanner from "./PublicidadeBanner";

const Publicidade = ({ category, types, limit, locations, place }) => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector((state) => state.banner);
  const banners = Object.values(list);

  const [bannersLoaded, setBannersLoaded] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const onFetchBanners = useCallback(() => {
    const params = new URLSearchParams();

    types && params.append("type", types.toString());
    place && params.append("bannerPlace", place);

    // Filtra os banners apenas se houver localizações selecionadas
    if (locations && locations.length > 0) {
      locations.forEach((location) => params.append("location", location));
    }

    category && params.append("category", category.toString());

    Number.isInteger(limit) && params.append("limit", limit.toString());

    dispatch(fetchPublicBanners(params.toString()));
  }, [dispatch, category, limit, types, locations, place]);

  useEffect(() => {
    onFetchBanners();
  }, [onFetchBanners]);

  useEffect(() => {
    if (!isLoading) {
      setBannersLoaded(true);
    }
  }, [isLoading]);

  const filterBanners = (bannerTypes) => {
    return banners
      ?.filter((banner) => bannerTypes.includes(banner.type))
      .filter((banner) =>
        selectedLocations.length === 0
          ? true
          : selectedLocations.includes(banner.location)
      );
  };

  useEffect(() => {
    setBannersLoaded(true);
  }, []);

  const maxBanners = filterBanners(["maxBanner"]);
  const randomMaxBanner =
    maxBanners.length > 0
      ? maxBanners[Math.floor(Math.random() * maxBanners.length)]
      : null;

  return (
    <>
      {bannersLoaded && (
        <div className="ui container">
          <div className="ui publicidade center aligned centered">
            {types.includes("maxBanner") && randomMaxBanner && (
              <PublicidadeBanner
                data={randomMaxBanner}
                key={`publi${randomMaxBanner.id}`}
              />
            )}
            {["featured", "miniBanner"].some((type) => types.includes(type)) &&
              filterBanners(["featured", "miniBanner"])?.map((banner) => (
                <PublicidadeBanner data={banner} key={`publi${banner.id}`} />
              ))}
            {/* Adicione mais tipos aqui, se necessário */}
          </div>
        </div>
      )}
    </>
  );
};

export default Publicidade;

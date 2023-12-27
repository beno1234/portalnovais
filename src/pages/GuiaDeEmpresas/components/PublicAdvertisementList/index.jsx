import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPublicAdvertisements } from "../../../../store/actions/advertisement";
import AnuncioCard from "../../../../components/AnuncioCard";
import Pagination from "../../../../components/admin/table/Pagination";

const PublicAdvertisementList = ({ searchParams }) => {
  const dispatch = useDispatch();
  const { list, totalCount, indexOrder, isLoading } = useSelector(
    (state) => state.advertisement
  );
  // Coloca os anúncios na ordem correta
  const advertisements = indexOrder.map((index) => list[index]);

  const onFetchAdvertisements = useCallback(() => {
    // Pegando os parâmetros
    const params = searchParams.toString();

    dispatch(fetchPublicAdvertisements(params));
  }, [dispatch, searchParams]);

  useEffect(() => {
    onFetchAdvertisements();
  }, [onFetchAdvertisements]);

  return (
    <>
      {advertisements.length > 0 && !isLoading ? (
        <>
          <div className="sixteen wide column">
            <div className="ui header">{advertisements.length} Anúncio(s)</div>
          </div>
          {advertisements.map((advertisement, index) => (
            <div
              className="eight wide tablet five wide computer column"
              key={advertisement.name + index}
            >
              <AnuncioCard data={advertisement} />
            </div>
          ))}
        </>
      ) : isLoading ? (
        <div className="ui active inverted dimmer">
          <div className="ui text loader">Carregando serviços...</div>
        </div>
      ) : (
        <div className="sixteen wide column">
          <div className="ui warning message">Nenhum serviço encontrado.</div>
        </div>
      )}
      <div className="sixteen wide center aligned column">
        <Pagination totalCount={totalCount} />
      </div>
    </>
  );
};

export default PublicAdvertisementList;

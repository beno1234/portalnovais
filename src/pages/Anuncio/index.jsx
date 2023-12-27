import "semantic-ui-css/semantic.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./index.css";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Rating } from "semantic-ui-react";
import { Carousel } from "react-responsive-carousel";
import { EditorState, convertFromRaw } from "draft-js";
import { HiOutlineShieldCheck } from "react-icons/hi";

import Publicidade from "../../components/Publicidade";
import Masthead from "../../components/Masthead";
import Footer from "../../components/Footer";
import {
  fetchAdvertisement,
  incrementAdvertisementView,
  incrementAdvertisementWhatsappView,
  rateAdvertisement,
} from "../../store/actions/advertisement";
import useMenu from "../../hooks/useMenu";
import SideBarMenu from "../../components/SideBarMenu";
import RichTextEditor from "../admin/Articles/components/RichTextEditor";
import { isJsonString } from "../../utils";
import { getFile } from "../../store/actions/file";

const Anuncio = () => {
  const [image, setImage] = useState("");
  const [imagesCarousel, setImagesCarousel] = useState([]);

  const { isSideBarOpen, closeSideBar } = useMenu();

  const { id } = useParams();
  const dispatch = useDispatch();

  const advertisement = useSelector((state) => state.advertisement.list[id]);

  const publishDate = new Date(advertisement?.publishedAt);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Sao_Paulo",
  };
  const readableDate = publishDate.toLocaleDateString("pt-BR", dateOptions);

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const { isLoading, error } = useSelector((state) => state.advertisement);

  const onFetchAdvertisement = useCallback(
    (id) => {
      dispatch(fetchAdvertisement(id));
    },
    [dispatch]
  );

  const onRateClick = (e, { rating }) => {
    rateAdvertisement(id, rating);
  };

  const onWhatsAppClick = (id) => {
    incrementAdvertisementWhatsappView(id);
  };

  const onFetchImage = useCallback(async (id) => {
    const response = await getFile(id);
    if (response) setImage(response);
  }, []);

  const onFetchCarousel = useCallback(async (ids) => {
    ids.forEach(async (id) => {
      const response = await getFile(id);
      if (response) {
        setImagesCarousel((srcs) => [...srcs, response]);
      }
    });
  }, []);

  useEffect(() => {
    if (!advertisement) {
      onFetchAdvertisement(id);
    } else {
      // Anúncio existe, incrementa sua visualização
      incrementAdvertisementView(id);
      // Busca as imagens
      advertisement.cover.length > 0 && onFetchImage(advertisement.cover[0]);
      advertisement.images.length > 0 && onFetchCarousel(advertisement.images);
    }
  }, [advertisement, id, onFetchAdvertisement, onFetchImage, onFetchCarousel]);

  return (
    <>
      <SideBarMenu />
      <div onClick={isSideBarOpen ? closeSideBar : undefined}>
        <Masthead />

        <div className="ui vertical section segment">
          <div className="ui stackable centered grid">
            {isLoading && (
              <div className="ui active inverted dimmer">
                <div className="ui text loader">Carregando anúncio...</div>
              </div>
            )}
            {!error ? (
              advertisement && (
                <>
                  <div className="ten wide column">
                    <div className="ui very padded segment">
                      <div className="ui basic clearing segment">
                        <div className="ui left floated materia header">
                          <div className="ui anuncio header">
                            {advertisement.name}
                            <div className="ui sub header">
                              Publicado em: {readableDate}
                            </div>
                          </div>
                        </div>
                        <div className="ui right floated sub header">
                          <div className="ui large middle aligned feature list">
                            <div className="item">
                              <i className="golden star icon" />
                              <div className="middle aligned content">
                                <div className="middle aligned content">
                                  <b>
                                    {Math.round(advertisement.rating * 10) / 10}
                                  </b>
                                  /5 de avaliação
                                </div>
                              </div>
                            </div>
                            <div className="item">
                              <i className="eye golden icon"></i>
                              <div className="middle aligned content">
                                <b>{advertisement.views}</b> visualizações
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Carousel>
                        <div>
                          <img
                            alt="Capa"
                            src={image}
                            style={{ maxHeight: "800px" }}
                          />
                        </div>
                        {imagesCarousel.map((image, index) => {
                          return (
                            <div key={`carouselImage${index}`}>
                              <img
                                alt={index}
                                src={image}
                                style={{ maxHeight: "800px" }}
                              />
                            </div>
                          );
                        })}
                      </Carousel>

                      {isSignedIn ? (
                        <>
                          <div className="field">
                            <p style={{ fontSize: "1.3em" }}>
                              Avalie o serviço!
                            </p>
                          </div>
                          <Rating
                            icon="star"
                            maxRating={5}
                            onRate={onRateClick}
                            defaultRating={Math.floor(advertisement.rating)}
                          />
                        </>
                      ) : (
                        <div className="ui warning message">
                          Você precisa fazer login para avaliar esse anunciante.
                        </div>
                      )}

                      {advertisement.type === "certified" && (
                        <>
                          <div
                            className="ui basic segment"
                            style={{ marginTop: "5em" }}
                          >
                            <div className="ui center aligned icon header">
                              CERTIFICADO
                              <HiOutlineShieldCheck className="ui blue icon" />
                              <div className="content">
                                <h3>Esse anunciante é certificado.</h3>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {advertisement.sale && (
                        <>
                          <div
                            className="ui raised segment"
                            style={{ marginBottom: "5em" }}
                          >
                            <div className="ui orange ribbon label">
                              PROMOÇÃO
                            </div>
                            <h3>Esse anunciante está fazendo uma promoção!</h3>
                            <p>{advertisement.sale}</p>
                          </div>
                        </>
                      )}

                      <div
                        className="ui header"
                        style={{ marginBottom: "1em" }}
                      >
                        Informações do anunciante
                      </div>

                      <span style={{ marginRight: "1em" }}>
                        <i className="book golden icon"></i>
                        Serviços:
                      </span>
                      {Object.values(advertisement.categories).map(
                        (item, index) => (
                          <div
                            className="ui tag category label"
                            key={`infoCategory${index}`}
                          >
                            {item.category.name}
                          </div>
                        )
                      )}

                      <div className="ui basic secondary segment">
                        <div className="ui big middle aligned feature list">
                          {advertisement.phone && (
                            <div className="item">
                              <i className="phone golden icon"></i>
                              <div className="middle aligned content">
                                <b>Telefone</b>
                                <br />
                                {advertisement.phone}
                              </div>
                            </div>
                          )}

                          {advertisement.whatsapp && (
                            <div className="item">
                              <i className="whatsapp alternate golden icon"></i>
                              <div className="content">
                                <p>
                                  <a
                                    href={`https://web.whatsapp.com/send?phone=55${advertisement.whatsapp.replace(
                                      /\D/g,
                                      ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ui green right floated button"
                                    onClick={() =>
                                      onWhatsAppClick(advertisement?.id)
                                    }
                                  >
                                    <i className="whatsapp alternate icon"></i>
                                    Iniciar Conversa
                                  </a>
                                  <b>WhatsApp</b>
                                  <br />
                                  {advertisement.whatsapp}
                                </p>
                              </div>
                            </div>
                          )}

                          {advertisement.locations && (
                            <div className="item">
                              <i className="location arrow golden icon"></i>
                              <div className="content">
                                <p>
                                  <b>Região</b>
                                  <br />
                                  {advertisement.locations &&
                                    Object.values(advertisement.locations).map(
                                      (item, index) => (
                                        <span
                                          style={{ marginRight: "1em" }}
                                          key={`infoLocation${index}`}
                                        >
                                          {item.location.name}
                                        </span>
                                      )
                                    )}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* {advertisement.category && <div className='item'>
                                                    <i className='certificate golden icon'></i>
                                                    <div className='content'>
                                                        <p>
                                                            <b>Serviços</b><br />
                                                            {advertisement.category?.name}
                                                        </p>
                                                    </div>
                                                </div>} */}

                          {advertisement.email && (
                            <div className="item">
                              <i className="mail golden icon"></i>
                              <div className="content">
                                <p>
                                  <b>E-mail</b> {advertisement.email}
                                </p>
                              </div>
                            </div>
                          )}

                          {advertisement.site && (
                            <div className="item">
                              <i className="globe golden icon"></i>
                              <div className="content">
                                <p>
                                  <b>Website</b>{" "}
                                  <a href={advertisement.site}>
                                    {advertisement.site}
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}

                          {advertisement.facebook && (
                            <div className="item">
                              <i className="facebook golden icon"></i>
                              <div className="content">
                                <p>
                                  <b>Facebook</b>{" "}
                                  <a href={advertisement.facebook}>
                                    {advertisement.facebook}
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}

                          {advertisement.instagram && (
                            <div className="item">
                              <i className="instagram golden icon"></i>
                              <div className="content">
                                <p>
                                  <b>Instagram</b>{" "}
                                  <a href={advertisement.instagram}>
                                    {advertisement.instagram}
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ui anuncio sub header">Descrição</div>
                      <RichTextEditor
                        editorState={
                          isJsonString(advertisement?.description)
                            ? EditorState.createWithContent(
                                convertFromRaw(
                                  JSON.parse(advertisement?.description)
                                )
                              )
                            : EditorState.createEmpty()
                        }
                        readOnly={true}
                      />
                    </div>
                  </div>

                  <div className="two wide column">
                    <Link to="/cotacao" className="ui fluid button">
                      COTAÇÂO EXPRESS GRÁTIS
                    </Link>

                    <div className="ui container">
                      <div className="ui header" style={{ marginTop: "1em" }}>
                        Publicidade
                      </div>
                      <Publicidade
                        types={["featured", "miniBanner"]}
                        category={Object.values(advertisement.categories).map(
                          (item) => item.category.id
                        )}
                        limit={15}
                      />
                      {/* <img alt="Fotografia" className="ui centered image" src="/banners/destaque_aranda.gif" />
                                        <img alt="Fotografia" className="ui centered image" src="/banners/destaque_buffetlavide.gif" /> */}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="ui error message">
                <div className="header">
                  Não foi possível carregar os dados do anúncio.
                </div>
                <p>
                  Os dados do anúncio não foram carregados por{" "}
                  <b>{error.message}</b>.<br />
                  Por favor, tente carregar os dados novamente.
                </p>
                <button
                  className="ui button"
                  type="button"
                  onClick={() => onFetchAdvertisement(id)}
                >
                  Carregar os dados
                </button>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Anuncio;

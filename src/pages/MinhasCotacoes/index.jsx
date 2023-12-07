import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import { fetchMyQuotations, toggleCategoryIsAnswered } from '../../store/actions/quotation';
import SideBarMenu from '../../components/SideBarMenu';
import useMenu from '../../hooks/useMenu';

const MeusAnuncios = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const location = useLocation();

    const formatPeriod = (period) => {
        switch (period) {
            case "morning":
                return "Manhã";
            case "afternoon":
                return "Tarde";
            case "night":
                return "Noite";
            default:
                return null;
        }
    }

    const dispatch = useDispatch();

    const { list, indexOrder, isLoading } = useSelector((state) => state.quotation);
    // Coloca os users na ordem correta
    const quotations = indexOrder.map((index) => list[index]);

    const onCategoryClick = async (quotationId, categoryId, value) => {
        const success = await dispatch(toggleCategoryIsAnswered(quotationId, categoryId, value));
        if (success) onFetchMyQuotations();
    }

    const onFetchMyQuotations = useCallback(() => {
        dispatch(fetchMyQuotations());
    }, [dispatch])

    const renderDate = (date) => {
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'America/Sao_Paulo' };
        const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

        return readableDate;
    }

    useEffect(() => {
        onFetchMyQuotations();
    }, [onFetchMyQuotations]);

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui inverted vertical masthead secondary profile banner center aligned segment'>
                    <div className="ui container">
                        <div className="ui equal width stackable grid">
                            <div className='center aligned row'>
                                <div className='column'>
                                    <h1 className="ui inverted header">
                                        Minhas cotações
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='ui vertical section segment'>
                    <div className='ui stackable centered grid'>
                        <div className='fifteen wide tablet custom ten wide computer column'>
                            {location?.state?.quotationCreated && <div style={{ paddingBottom: "6em" }}>
                                <div className='ui link two stackable cards'>

                                    <Link to="/anuncios" className='category card'>
                                        <div className='streched image'>
                                            <img alt="Fotografia" className="ui centered streched image" src={'./banner.png'} />
                                            <div className='category center aligned title' style={{ color: "#000" }}>
                                                <div className='category content'>
                                                    <h3>GUIA DE EMPRESAS</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link to="/materias" className='category card' style={{ fontSize: "5em !important" }}>
                                        <div className='streched image'>
                                            <img alt="Fotografia" className="ui centered streched image" src={'./banner2.jfif'} />
                                            <div className='category center aligned title' style={{ color: "#000" }}>
                                                <div className='category content'>
                                                    <h3>MATÉRIAS</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                </div>
                            </div>}
                            <div className="ui stackable grid">
                                {quotations?.length > 0 ? quotations.map((quotation, index) => <div className="sixteen wide column" key={`quotation${index}`}>
                                    <div className="ui segment">
                                        <div className="ui header">{quotation.title}</div>
                                        <div className="ui equal width form">
                                            {quotation.noteMessage && <div className="field">
                                                <label>Mensagem</label>
                                                {quotation.noteMessage}
                                            </div>}
                                            <div className="fields">
                                                {quotation.dateEvent && <div className="field">
                                                    <label>Data da festa</label>
                                                    {renderDate(quotation.dateEvent)}
                                                </div>}
                                                {quotation.publishedAt && <div className="field">
                                                    <label>Data da cotação</label>
                                                    {renderDate(quotation.publishedAt)}
                                                </div>}

                                                {quotation.period && <div className="field">
                                                    <label>Período para contato</label>
                                                    {formatPeriod(quotation.period)}
                                                </div>}

                                                {quotation.amountGuest && <div className="field">
                                                    <label>Quantidade de Convidados</label>
                                                    {quotation.amountGuest}
                                                </div>}

                                                {quotation.eventPlace && <div className="field">
                                                    <label>Local do evento</label>
                                                    {quotation.eventPlace}
                                                </div>}
                                            </div>

                                            {quotation.address && <>
                                            {/*    <div className="ui sub header">Endereço</div> */ }
                                                <div className="fields">
                                                    {/* {quotation.address?.street && <div className="field">
                                                    <label>Rua</label>
                                                    {quotation.address?.street}
                                                </div>}

                                                {quotation.address?.number && <div className="field">
                                                    <label>Número</label>
                                                    {quotation.address?.number}
                                                </div>}

                                                {quotation.address?.neighborhood && <div className="field">
                                                    <label>Bairro</label>
                                                    {quotation.address?.neighborhood}
                                                </div>} */}

                                                    {quotation.address?.state && <div className="field">
                                                        <label>Estado</label>
                                                        {quotation.address?.state}
                                                    </div>}

                                                    {quotation.address?.city && <div className="field">
                                                        <label>Cidade</label>
                                                        {quotation.address?.city}
                                                    </div>}

                                                    {/* {quotation.address?.postalCode && <div className="field">
                                                    <label>CEP</label>
                                                    {quotation.address?.postalCode}
                                                </div>} */}
                                                </div>
                                            </>}

                                            <div className="field">
                                                <label>Marque os serviços já contratados</label>
                                                {quotation.categories?.map((item, index) => <div className="list" key={`categ${index}`}>
                                                    <div className="item">
                                                        <div className="ui checkbox">
                                                            <input id={`${quotation.id}labelCateg${index}`} type="checkbox" tabIndex="0" className="hidden" checked={item.answered} onClick={() => onCategoryClick(quotation.id, item.category.id, !item.answered)} readOnly />
                                                            <label htmlFor={`${quotation.id}labelCateg${index}`}>{item.category.name}</label>
                                                        </div>
                                                    </div>
                                                </div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>) : isLoading
                                    ? <div className="ui active inverted dimmer">
                                        <div className="ui text loader">Carregando cotações...</div>
                                    </div>
                                    : <div className="ui warning message">
                                        <div className="header">Você ainda não possui nenhuma cotação</div>
                                        <p>Faça uma cotação <Link to="/cotacao">aqui</Link>.</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default MeusAnuncios;
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

/* import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table'; */
import Pagination from '../../../../components/admin/table/Pagination';
import AdminQuotationFilters from '../components/AdminQuotationFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage';
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchQuotations } from '../../../../store/actions/quotation';
import { toggleCategoryIsAnswered } from '../../../../store/actions/quotation';

const QuotationList = () => {
    const dispatch = useDispatch();
    /* const location = useLocation(); */

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.quotation);
    // Coloca os quotations na ordem correta
    const quotations = indexOrder.map((index) => list[index]);

    const renderDate = (date) => {
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'America/Sao_Paulo' };
        const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

        return readableDate;
    }

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


    // Table
    const { /* setSelectedItem, */ isModalOpen/* , openModal */ } = useModal();

    /* const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    } */

    /* const actions = (item) => {
        return <>
            <Link to={`${item.id}/edit/`} state={{ from: location }} className='ui yellow icon button'>
                <i className='edit icon'></i>
            </Link>
            <button className="ui negative icon button" onClick={() => onOpenModal(item)}>
                <i className='trash alternate icon'></i>
            </button>
        </>
    } */

    const onFetchQuotations = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchQuotations(params));
    }, [dispatch, searchParams]);

    const onCategoryClick = async (quotationId, categoryId, value) => {
        const success = await dispatch(toggleCategoryIsAnswered(quotationId, categoryId, value));
        if (success) onFetchQuotations();
    }

    const onSync = () => {
        onFetchQuotations();
    }

    useEffect(() => {
        onFetchQuotations();
    }, [onFetchQuotations]);

    return (
        <>
            <h2 className="ui header">Listagem de cotações do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    <div className='left floated left aligned eight wide column'>
                        <AdminQuotationFilters />
                    </div>

                    <div className='right floated right aligned eight wide column'>
                        <div className='ui right aligned basic clearing segment no-padding'>
                            <ItemsPerPage totalCount={totalCount} />
                            <button className='ui black icon button refresh' type="button" onClick={onSync}>
                                <i className='sync icon' />
                            </button>
                        </div>
                    </div>

                    <div className='sixteen wide column'>
                        {(isLoading && !isModalOpen) && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Carregando cotações</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar as cotações.</div>
                            <p>
                                A lista de cotações não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <div className='ui vertical section segment'>
                                <div className="ui stackable grid">
                                    {quotations?.length > 0 ? quotations.map((quotation, index) => <div className="sixteen wide column" key={`quotation${index}`}>
                                        <div className="ui segment">
                                            <div className="ui header">{quotation.title}</div>
                                            <div className="ui equal width form">
                                                <div className="fields">
                                                    {quotation.name && <div className="field">
                                                        <label>Nome</label>
                                                        {quotation.name}
                                                    </div>}
                                                    {quotation.email && <div className="field">
                                                        <label>E-mail</label>
                                                        {quotation.email}
                                                    </div>}
                                                </div>
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
                                                    <div className="ui sub header">Endereço</div>
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
                                    </div>) : <div className="header">Nenhuma cotação encontrada.</div>}
                                </div>
                            </div>
                        </div>}
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuotationList;
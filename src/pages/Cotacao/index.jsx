import 'semantic-ui-css/semantic.min.css';
import './index.css';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';

import Input from '../../components/form/Input';
import DatePicker from '../../components/form/DatePicker';
import Select from '../../components/form/Select';

import SideBarMenu from '../../components/SideBarMenu';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import { fetchCategories } from '../../store/actions/category';
import { fetchLocations } from '../../store/actions/location';
import { createQuotation } from '../../store/actions/quotation';
import useMenu from '../../hooks/useMenu';

const Cotacao = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const { error: errorQuotation, isLoading: isLoadingQuotation } = useSelector((state) => state.quotation);
    const { list: listCategory, isLoading: isLoadingCategory, error: errorCategory } = useSelector((state) => state.category);
    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    const categories = Object.values(listCategory);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const { isSignedIn, user } = useSelector((state) => state.auth);

    const periodOptions = [
        { key: "morningPeriod", value: "morning", text: "Manhã" },
        { key: "afternoonPeriod", value: "afternoon", text: "Tarde" },
        { key: "nightPeriod", value: "night", text: "Noite" }
    ]

    const categoryOptions = categories.map((category) => {
        return {
            key: `category${category.id}`,
            value: category.id,
            text: category.name
        }
    });

    const locationOptions = locations.map((location) => {
        return {
            key: `location${location.id}`,
            value: location.id,
            text: location.name
        }
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (formValues) => {

        const mockup = {
            "userId": user?.id,
            "name": user?.name,
            "email": user?.email,
            "address": {
                /* "street": formValues.street,
                "number": parseInt(formValues.number),
                "neighborhood": formValues.neighborhood, */
                "city": formValues.city,
                "state": formValues.state,
                /* "postalCode": formValues.postalCode */
            }
        }

        formValues.amountGuest = parseInt(formValues.amountGuest);

        if (formValues.dateEvent) {
            formValues.dateEvent = new Date(formValues.dateEvent);
        }

        /* if (formValues.street) delete formValues.street;
        if (formValues.number) delete formValues.number;
        if (formValues.neighborhood) delete formValues.neighborhood; */
        if (formValues.city) delete formValues.city;
        if (formValues.state) delete formValues.state;
        /* if (formValues.postalCode) delete formValues.postalCode; */

        const success = await dispatch(createQuotation({ ...mockup, ...formValues }));
        if (success) navigate('/minhas-cotacoes', {
            state: {
                quotationCreated: true
            }
        });
    }

    const validateValues = (values) => {
        const errors = {};

        if (!values.title) {
            errors.title = "Insira o título.";
        }
        if (!values.dateEvent) {
            errors.dateEvent = "Insira uma data";
        }
        if (!values.period) {
            errors.period = "Selecione um período.";
        }
        if (!values.amountGuest) {
            errors.amountGuest = "Insira uma quantidade de convidados.";
        } else if (parseInt(values.amountGuest) <= 0) {
            errors.amountGuest = "Insira uma quantidade válida de convidados.";
        }
        if (!values.noteMessage) {
            errors.noteMessage = "Insira uma mensagem.";
        }
        // address
        /* if (!values.street) {
            errors.street = "Insira a rua.";
        }
        if (!values.number) {
            errors.number = "Insira o número.";
        } else if (parseInt(values.number) <= 0) {
            errors.number = "Insira um número válido.";
        }
        if (!values.neighborhood) {
            errors.neighborhood = "Insira o bairro.";
        } */
        if (!values.city) {
            errors.city = "Insira a cidade.";
        }
        if (!values.state) {
            errors.state = "Insira o estado.";
        }
        /* if (!values.postalCode) {
            errors.postalCode = "Insira o CEP.";
        } */

        if (!values.period) {
            errors.period = "Insira um período.";
        }
        if (!values.categories || values.categories?.length <= 0) {
            errors.categories = "Selecione ao menos uma categoria"
        }
        if (!values.locationId) {
            errors.locationId = "Selecione uma localização"
        }

        return errors;
    }

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchLocations());
    }, [dispatch]);


    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui signup section container'>
                    <div className='ui middle aligned center aligned grid'>
                        <div className='ui raised login clearing segment'>
                            <div className='ui center aligned header'>
                                Bem-vindo(a) ao Portal Noivas
                            </div>
                            <div className="ui info message">
                                * Preencha o formulário com seus dados.<br />
                                ** Selecione todos os produtos e serviços que você precisa.<br />
                                *** Pronto! É só aguardar você vai receber orçamentos de várias empresas em seu email.<br />
                            </div>
                            {(isSignedIn && user.role !== "advertiser") ? <>
                                <div className='ui center aligned sub header'>
                                    Complete os seguintes campos para melhor poder ajudar com o seu casamento
                                </div>
                                {errorQuotation && <div className="ui error message">
                                    <div className="header">{errorQuotation.message}</div>
                                    <p>Por favor, tente novamente.</p>
                                </div>}
                                {isLoadingQuotation && <div className="ui active inverted dimmer">
                                    <div className="ui text loader">{isLoadingQuotation.message}</div>
                                </div>}
                                <Form
                                    keepDirtyOnReinitialize
                                    initialValues={{
                                        categories: []
                                    }}
                                    onSubmit={onSubmit}
                                    validate={validateValues}
                                    render={({ handleSubmit }) => (
                                        <form className="ui form" onSubmit={handleSubmit}>
                                            <Field
                                                name="title"
                                                component={Input}
                                                type="text"
                                                label="Título *"
                                                placeholder=""
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="dateEvent"
                                                placeholder="Insira aqui a data"
                                                component={DatePicker}
                                                label="Data e hora da festa *"
                                                disabled={!!isLoadingQuotation}
                                                showTimeSelect
                                                timeIntervals={15}
                                                minDate={new Date()}
                                                dateFormat="dd/MM/yyyy H:mm"
                                                timeCaption="Hora:"
                                            /* format={date => isValid(date) ? format(new Date(date), "dd/MM/yyyy H:mm") : null}
                                            parse={date => isValid(date) ? toDate(date) : null} */
                                            />

                                            <Field
                                                name="period"
                                                component={Select}
                                                placeholder="Escolha uma opção"
                                                options={periodOptions}
                                                label="Em que período deseja ser contactado *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="amountGuest"
                                                type="number"
                                                component={Input}
                                                placeholder=""
                                                label="Número de convidados *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="noteMessage"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Mensagem *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="eventPlace"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Local do evento"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            {(!isLoadingCategory && categoryOptions.length <= 0)
                                                ? errorCategory
                                                    ? <div className='field'>
                                                        <label>Serviços desejados</label>
                                                        <div className='ui error message visible'>
                                                            <i className='warning icon'></i>
                                                            As categorias não foram carregadas corretamente.
                                                        </div>
                                                    </div>
                                                    : <div className='field'>
                                                        <label>Serviços desejados</label><div className='ui error message visible'>
                                                            <i className='warning icon'></i>
                                                            Não há nenhuma categoria cadastrada.
                                                        </div>
                                                    </div>
                                                : <Field
                                                    name="categories"
                                                    component={Select}
                                                    placeholder="Escolha uma opção"
                                                    options={categoryOptions}
                                                    label="Serviços desejados *"
                                                    isMultiple
                                                    loading={!!isLoadingCategory}
                                                    disabled={(errorCategory || isLoadingQuotation) ? true : false}
                                                />
                                            }


                                            {(!isLoadingLocation && locationOptions.length <= 0)
                                                ? errorLocation
                                                    ? <div className='field'>
                                                        <label>Localização</label>
                                                        <div className='ui error message visible'>
                                                            <i className='warning icon'></i>
                                                            As localizações não foram carregadas corretamente.
                                                        </div>
                                                    </div>
                                                    : <div className='field'>
                                                        <label>Localização</label><div className='ui error message visible'>
                                                            <i className='warning icon'></i>
                                                            Não há nenhuma localização cadastrada.
                                                        </div>
                                                    </div>
                                                : <Field
                                                    name="locationId"
                                                    component={Select}
                                                    placeholder="Escolha uma opção"
                                                    options={locationOptions}
                                                    label="Localização"
                                                    loading={!!isLoadingLocation}
                                                    disabled={(errorLocation || isLoadingQuotation) ? true : false}
                                                />
                                            }

                                            <div className="ui header">Endereço</div>

                                            {/* <Field
                                                name="street"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Rua *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="number"
                                                type="number"
                                                component={Input}
                                                placeholder=""
                                                label="Número *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="neighborhood"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Bairro *"
                                                disabled={!!isLoadingQuotation}
                                            /> */}

                                            <Field
                                                name="city"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Cidade *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            <Field
                                                name="state"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="Estado *"
                                                disabled={!!isLoadingQuotation}
                                            />

                                            {/* <Field
                                                name="postalCode"
                                                type="text"
                                                component={Input}
                                                placeholder=""
                                                label="CEP *"
                                                disabled={!!isLoadingQuotation}
                                            /> */}

                                            <div className='ui right floated basic segment'>
                                                <button className={`ui button ${(isLoadingQuotation || isLoadingCategory || isLoadingLocation || categoryOptions.length <= 0 || locationOptions.length <= 0) && 'disabled'}`} type="submit">Enviar</button>
                                            </div>
                                        </form>
                                    )} />
                            </>
                                : <div className='ui warning message'>
                                    Você precisa realizar o
                                    {isSignedIn ? " login como um(a) noivo(a) " : <Link to='/login'> login </Link>}
                                    para pedir uma cotação.
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default Cotacao;
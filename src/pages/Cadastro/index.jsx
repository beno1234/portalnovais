import 'semantic-ui-css/semantic.min.css';
import './index.css';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import Checkbox from '../../components/form/Checkbox';
import { tryLogin, signUp } from '../../store/actions/auth';
import useMenu from '../../hooks/useMenu';
import { fetchLocations } from '../../store/actions/location';

import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import SideBarMenu from '../../components/SideBarMenu';

const Cadastro = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const locationOptions = locations.map((location) => {
        return {
            key: `location${location.id}`,
            value: location.id,
            text: location.name
        }
    });

    const { error, isLoading: isAuthLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialValues = {
        name: searchParams.get("name"),
        email: searchParams.get("email")
    };

    const onSubmit = async (formValues) => {
        const signUpSuccess = await dispatch(signUp(_.omit(formValues, "confirmPassword")));
        if (signUpSuccess) {
            const loginSuccess = await dispatch(tryLogin({
                email: formValues.email,
                password: formValues.password
            }));

            if (loginSuccess) {
                navigate('/cotacao');
            } else {
                navigate('/login');
            }
        }
    }

    const validateValues = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Insira seu nome completo.";
        }

        if (!values.email) {
            errors.email = "Insira o e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }

        if (!values.password) {
            errors.password = "Insira a senha.";
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = "Insira a confirmação de senha.";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "A confirmação de senha não corresponde.";
        }

        return errors;
    }

    useEffect(() => {
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
                            <div className='ui center aligned header'>Cadastro</div>
                            {error && <div className="ui error message">
                                <div className="header">{error.message}</div>
                                <p>Por favor, tente novamente.</p>
                            </div>}
                            {isAuthLoading && <div className="ui active inverted dimmer">
                                <div className="ui text loader">{isAuthLoading.message}</div>
                            </div>}
                            <Form
                                onSubmit={onSubmit}
                                initialValues={initialValues}
                                validate={validateValues}
                                render={({ handleSubmit }) => (
                                    <form className="ui form" onSubmit={handleSubmit}>
                                        <Field
                                            name="name"
                                            component={Input}
                                            type="text"
                                            label="Nome completo *"
                                            placeholder=""
                                            disabled={isAuthLoading}
                                        />
                                        <Field
                                            name="email"
                                            component={Input}
                                            type="email"
                                            label="E-mail *"
                                            placeholder=""
                                            disabled={isAuthLoading}
                                        />
                                        {(isLoadingLocation || locationOptions.length > 0) && <Field
                                            name="locationId"
                                            component={Select}
                                            placeholder="Escolha uma opção"
                                            options={locationOptions}
                                            label="Localização"
                                            loading={!!isLoadingLocation}
                                            disabled={(errorLocation || isAuthLoading) ? true : false}
                                        />
                                        }
                                        {/* <Field
                                            name="birthday"
                                            component={Input}
                                            type="date"
                                            label="Data de Nascimento"
                                            placeholder=""
                                            parse={v => new Date()}
                                            disabled={isAuthLoading}
                                        /> */}
                                        <Field
                                            name="password"
                                            component={Input}
                                            type="password"
                                            label="Senha *"
                                            placeholder=""
                                            disabled={isAuthLoading}
                                        />
                                        <Field
                                            name="confirmPassword"
                                            component={Input}
                                            type="password"
                                            label="Confirme sua senha"
                                            placeholder=""
                                            disabled={isAuthLoading}
                                        />
                                        <Field
                                            name="role"
                                            component={Checkbox}
                                            type="checkbox"
                                            label="Você é um anunciante?"
                                            disabled={isAuthLoading}
                                            id="roleCheckbox"
                                            format={v => v === "advertiser"}
                                            parse={v => v ? "advertiser" : "engaged"}
                                        />
                                        <div className='ui right floated basic segment'>
                                            <Link to="/login" className="ui secondary button" type="button">Cancelar</Link>
                                            <button className={`ui button ${isAuthLoading && 'disabled'}`} type="submit">Cadastrar</button>
                                        </div>
                                    </form>
                                )} />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default Cadastro;
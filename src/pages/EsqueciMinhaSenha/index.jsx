import 'semantic-ui-css/semantic.min.css';
import './index.css';
import _ from 'lodash';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import Input from '../../components/form/Input';
import useMenu from '../../hooks/useMenu';
import { requestResetPassword, resetPassword } from '../../store/actions/auth';

import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import SideBarMenu from '../../components/SideBarMenu';

const EsqueciMinhaSenha = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();
    const [resetRequested, setResetRequested] = useState(false);
    const [email, setEmail] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const onRequestForgotPasswordSubmit = async (formValues) => {
        // Para garantir
        if (formValues.resetPasswordToken) delete formValues.resetPasswordToken;
        setLoading(true);
        const success = await requestResetPassword(formValues);
        if (success) {
            setResetRequested(true);
            setEmail(formValues.email);
            setError(false);
        } else {
            setError(true);
        }
        setLoading(false);
    }

    const onResetPassword = async (formValues) => {
        // Para garantir
        if (formValues.email) delete formValues.email;
        formValues.resetPasswordToken = formValues.resetPasswordToken.replace(/\s+/g, '');
        setLoading(true);
        const success = await resetPassword(_.omit(formValues, "confirmPassword"));
        if (success) {
            navigate('/login');
        } else {
            setError(true);
        }
        setLoading(false);
    }

    const onResetForm = () => {
        setError(false);
        setResetRequested(false);
    }

    const validateRequest = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = "Insira o e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }

        return errors;
    }

    const validateChange = (values) => {
        const errors = {};

        if (!values.resetPasswordToken) {
            errors.resetPasswordToken = "Insira o código recebido no seu e-mail.";
        }

        if (!values.password) {
            errors.password = "Insira a nova senha.";
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = "Insira a confirmação de senha.";
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "A confirmação de senha não corresponde.";
        }

        return errors;
    }

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui signup section container'>
                    <div className='ui middle aligned center aligned grid'>
                        <div className='ui raised login clearing segment'>
                            <div className='ui center aligned header'>Recuperação de Senha</div>
                            {loading && <div className="ui active inverted dimmer">
                                <div className="ui text loader"></div>
                            </div>}
                            {!resetRequested ? <>
                                {error && <div className="ui error active message">Houve um erro, tente novamente.</div>}
                                <Form
                                    onSubmit={onRequestForgotPasswordSubmit}
                                    validate={validateRequest}
                                    initialValues={{
                                        email: email
                                    }}
                                    render={({ handleSubmit }) => (
                                        <form className="ui form" onSubmit={handleSubmit}>
                                            <Field
                                                name="email"
                                                component={Input}
                                                type="email"
                                                label="E-mail da sua conta"
                                                placeholder="mail@provedor.com"
                                            />
                                            <div className='ui right floated basic segment'>
                                                <Link to="/login" className="ui secondary button" type="button">Cancelar</Link>
                                                <button className="ui button" type="submit">Enviar código para o e-mail</button>
                                            </div>
                                        </form>
                                    )} />
                            </>
                                : <>
                                    <div className="ui success message">
                                        Um código foi enviado no e-mail <b>{email}</b>.<br />
                                        Preencha o seguinte formulário com o código recebido para redefinir sua senha.
                                    </div>
                                    {error && <div className="ui error active message">Houve um erro, certifique-se que o token está correto e tente novamente.</div>}
                                    <Form
                                        onSubmit={onResetPassword}
                                        validate={validateChange}
                                        render={({ handleSubmit }) => (
                                            <form className="ui form" onSubmit={handleSubmit}>
                                                <Field
                                                    name="resetPasswordToken"
                                                    component={Input}
                                                    type="text"
                                                    label="Código (token) de recuperação *"
                                                    placeholder="Copie e cole aqui o token recebido no seu e-mail"
                                                />
                                                <Field
                                                    name="password"
                                                    component={Input}
                                                    type="password"
                                                    label="Nova senha *"
                                                    placeholder=""
                                                />
                                                <Field
                                                    name="confirmPassword"
                                                    component={Input}
                                                    type="password"
                                                    label="Confirme sua senha"
                                                    placeholder=""
                                                />
                                                <div className='ui right floated basic segment'>
                                                    <button className="ui secondary button no-outline" type="button" onClick={onResetForm}>Não recebi meu código</button>
                                                    <Link to="/login" className="ui secondary button" type="button">Cancelar</Link>
                                                    <button className="ui button" type="submit">Redefinir senha</button>
                                                </div>
                                            </form>
                                        )} />
                                </>}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default EsqueciMinhaSenha;
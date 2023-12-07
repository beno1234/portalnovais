import 'semantic-ui-css/semantic.min.css';
import './index.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import Input from '../../components/form/Input';
import { tryLogin } from '../../store/actions/auth';
import useMenu from '../../hooks/useMenu';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import SideBarMenu from '../../components/SideBarMenu';

const Login = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const { isSignedIn, isLoading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from;
    const pathname = from ? from.pathname : "/";
    const search = from ? from.search : '';

    useEffect(() => {
        isSignedIn && navigate(pathname + search, { replace: true });
    }, [isSignedIn, navigate, pathname, search]);

    const onSubmit = (values) => {
        dispatch(tryLogin(values));
    }

    const validateValues = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = "Insira o e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }
        if (!values.password) {
            errors.password = "Insira a senha.";
        }
        return errors;
    }

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui login section container'>
                    <div className='ui middle aligned center aligned grid'>
                        <div className='ui raised login segment'>
                            <div className='ui center aligned header'>Login</div>
                            {error && <div className="ui error message">
                                <div className="header">{error.message}</div>
                                <p>Por favor, tente novamente.</p>
                            </div>}
                            {isLoading && <div className="ui active inverted dimmer">
                                <div className="ui text loader">{isLoading.message}</div>
                            </div>}
                            <Form
                                onSubmit={onSubmit}
                                validate={validateValues}
                                render={({ handleSubmit }) => (
                                    <form className="ui form" onSubmit={handleSubmit}>
                                        <Field
                                            name="email"
                                            component={Input}
                                            type="email"
                                            placeholder="E-mail"
                                            icon="user"
                                            disabled={isLoading}
                                        />
                                        <Field
                                            name="password"
                                            component={Input}
                                            type="password"
                                            placeholder="Senha"
                                            icon="lock"
                                            disabled={isLoading}
                                        />
                                        <button className={`ui button right floated ${isLoading && 'disabled'}`} type="submit">Entrar</button>
                                    </form>
                                )} />
                            Não tem um cadastro? <Link to="/cadastro" className="ui sign up button" type="button">Cadastre-se</Link>
                            <Link to="/esqueci-minha-senha">
                                <div className='forgot password'>
                                    Esqueci minha senha
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default Login;
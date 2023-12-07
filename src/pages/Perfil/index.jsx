import 'semantic-ui-css/semantic.min.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import formatString from "format-string-by-pattern";

import useModal from '../../hooks/useModal';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import UserForm from './components/UserForm';
import { editMe, fetchMe, setError } from '../../store/actions/auth';
import DeleteUserModal from './components/DeleteUserModal';
import SideBarMenu from '../../components/SideBarMenu';
import useMenu from '../../hooks/useMenu';

const Perfil = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();
    const { user, error, isLoading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [editSuccess, setEditSuccess] = useState(null);
    const [canEdit, setCanEdit] = useState(false);

    const { isModalOpen, openModal } = useModal();

    const formRef = useRef(null);

    const onOpenModal = () => {
        dispatch(setError(null));
        openModal();
    }

    const onFetchMe = useCallback((id) => {
        dispatch(fetchMe(id));
    }, [dispatch]);

    useEffect(() => {
        if (user.id) {
            onFetchMe(user.id);
        }
    }, [user.id, onFetchMe]);

    const onSubmit = async (formValues) => {
        // Limpa string para que só tenha números
        if (formValues.document) {
            formValues.document = formValues.document.replace(/\D/g, "");
        } else {
            formValues.document = null;
        }

        /* if (formValues.phone) {
            formValues.phone = formValues.phone.replace(/\D/g, "");
        } */

        const result = dispatch(editMe(user.id, formValues));
        setEditSuccess(result);

        if (result) {
            setCanEdit(false);
        }
    }

    const onToggleEdit = () => {
        if (formRef) {
            formRef.current.restart();
        }
        setEditSuccess(null);
        setCanEdit(!canEdit);
    }

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                {user ? <>
                    <DeleteUserModal />

                    <div className='ui inverted vertical masthead secondary profile banner center aligned segment'>
                        <div className="ui container">
                            <div className="ui equal width stackable grid">
                                <div className='center aligned row'>
                                    <div className='column'>
                                        <h1 className="ui inverted header">
                                            <i className='ui user icon'></i>
                                            {user.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='ui container'>
                        <div className='ui vertical section segment'>
                            <div className="ui stackable grid container">
                                {(isLoading && !isModalOpen)
                                    ? <div className="ui active inverted dimmer">
                                        <div className="ui text loader">{isLoading.message}</div>
                                    </div>
                                    : <>
                                        <div className='sixteen wide column'>
                                            <button className="ui button" type="button" onClick={() => onToggleEdit()}>
                                                <i className='ui edit icon'></i>
                                                {canEdit ? 'Parar de editar' : 'Editar'}
                                            </button>
                                            {/* <button className="ui button" type="button" disabled>
                                                <i className='ui key icon'></i>
                                                Senha
                                            </button> */}
                                            <button className={`ui button ${isLoading && 'disabled'}`} disabled={isLoading} type="button" onClick={onOpenModal}>
                                                <i className='ui trash alternate icon'></i>
                                                Excluir
                                            </button>
                                        </div>
                                        <div className='sixteen wide column'>
                                            {(editSuccess && !isModalOpen) && <div className="ui success message">
                                                <div className="header">Dados atualizados com sucesso</div>
                                                <p>Os seus dados foram atualizados.</p>
                                            </div>}

                                            {(canEdit && !isModalOpen) && <div className="ui warning message">
                                                <div className="header">Edição de dados habilitada</div>
                                                <p>Você pode agora alterar seus dados.</p>
                                            </div>}

                                            {(error && !isModalOpen) && <div className="ui error message">
                                                <div className="header">{error.message}</div>
                                                <p>Por favor, tente novamente.</p>
                                            </div>}

                                            <UserForm
                                                role={user?.role}
                                                initialValues={{
                                                    email: user?.email,
                                                    name: user?.name,
                                                    /* birthday: user?.birthday && new Date(user?.birthday), */
                                                    locationId: user?.locationId,
                                                    document: user?.document
                                                        ? user?.document?.length === 14 ? formatString('XX.XXX.XXX/XXXX-XX', user.document) : formatString('XXX.XXX.XXX-XX', user.document)
                                                        : null,
                                                    documentType: user?.role === "advertiser"
                                                        ? user?.document?.length === 14 ? "pj" : "pf"
                                                        : "pf",
                                                    phone: user?.phone ? formatString('(99) 99999-9999', user.phone) : null
                                                }}
                                                onSubmit={onSubmit}
                                                disableSubmit={isLoading || !canEdit}
                                                formRef={formRef}
                                            />
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </>
                    : <div className='ui container'>
                        <div className='ui vertical section segment'>
                            <div className="ui stackable grid container">
                                <div className='sixteen wide column'>
                                    <div className="ui warning message">
                                        <div className="header">Usuário não encontrado</div>
                                        <p>Acesse uma conta para ver e editar seus dados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <Footer />
            </div>
        </>
    );
}

export default Perfil;
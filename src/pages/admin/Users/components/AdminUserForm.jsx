import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import formatString from "format-string-by-pattern";
import { useSelector, useDispatch } from "react-redux";
/* import { subYears } from 'date-fns';

import DatePicker from '../../../../components/form/DatePicker'; */
import Condition from '../../../../components/form/Condition';
import CustomField from '../../../../components/form/CustomField';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { fetchLocations } from '../../../../store/actions/location';

const AdminUserForm = ({ initialValues, onSubmit, disableSubmit, formRef, create, onCancel }) => {
    const dispatch = useDispatch();

    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    // Coloca os locations na ordem correta
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const locationOptions = locations.map((location) => {
        return {
            key: `location${location.id}`,
            value: location.id,
            text: location.name
        }
    });

    const documentTypeOptions = [
        {
            key: 'typePf',
            value: 'pf',
            text: 'Pessoa física'
        },
        {
            key: 'typePJ',
            value: 'pj',
            text: 'Pessoa jurídica'
        }
    ];

    const onFormSubmit = (formValues) => {
        if (formValues.documentType) delete formValues.documentType;
        onSubmit(formValues);
    }

    const validateValues = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Insira um nome completo.";
        }
        if (!values.email) {
            errors.email = "Insira um e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido.";
        }

        if (values.document) {
            if (values.documentType === "pj") {
                if (!/^([0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2})$/.test(values.document)) {
                    errors.document = "Insira um CNPJ válido."
                }
            } else {
                if (!/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2})$/.test(values.document)) {
                    errors.document = "Insira um CPF válido."
                }
            }
        }

        if (values.phone && !/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(values.phone)) {
            errors.phone = "Insira um telefone celular válido.";
        }
        // Apenas no formulário de criação de usuário
        if (create) {
            if (!values.password) {
                errors.password = "Insira a senha.";
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = "Insira a confirmação de senha.";
            } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = "A confirmação de senha não corresponde.";
            }
        } else {
            if (!values.role) {
                errors.role = "Selecione uma permissão.";
            }
        }

        return errors;
    }

    const roleOptions = [
        { key: 'ADMIN', value: 'admin', text: 'Administrador(a)' },
        { key: 'ADVERTISER', value: 'advertiser', text: 'Anunciante' },
        { key: 'ENGAGED', value: 'engaged', text: 'Noivo(a)' },
        { key: 'EDITOR', value: 'editor', text: 'Editor(a)' },
        { key: 'INTERNAL', value: 'internal', text: 'Interno(a)' },
    ];

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    return (
        <>
            <Form
                onSubmit={onFormSubmit}
                initialValues={initialValues}
                validate={validateValues}
                render={({ handleSubmit, pristine, form, invalid }) => {
                    if (formRef) formRef.current = form;
                    return <form className="ui equal width form" onSubmit={handleSubmit}>
                        <h4 className="ui header">Acesso</h4>
                        {create && <div className="fields">
                            <Field
                                name="password"
                                component={Input}
                                type="password"
                                label="Senha *"
                                placeholder="Insira uma senha"
                                disabled={disableSubmit}
                            />
                            <Field
                                name="confirmPassword"
                                component={Input}
                                type="password"
                                label="Confirme a senha *"
                                placeholder="Confirme a senha"
                                disabled={disableSubmit}
                            />
                        </div>}
                        {!create && <div className='fields'>
                            <Field
                                name='role'
                                component={Select}
                                placeholder='Selecione uma permissão'
                                label='Permissão'
                                options={roleOptions}
                                required
                            />
                        </div>}
                        <h4 className="ui header">Informações Pessoais</h4>
                        <div className="fields">
                            <Field
                                name='name'
                                component={Input}
                                type="text"
                                placeholder='Insira um nome completo'
                                label='Nome *'
                                disabled={disableSubmit}
                            />

                            <Condition when="role" is="advertiser">
                                <CustomField
                                    name="documentType"
                                    component={Select}
                                    placeholder="Escolha uma opção"
                                    options={documentTypeOptions}
                                    label="Pessoa *"
                                    onChange={(val, prevVal) => {
                                        if (val !== prevVal) {
                                            form.change("document", null);
                                        }
                                    }}
                                    disabled={disableSubmit}
                                />
                            </Condition>

                            <Field
                                name='document'
                                component={Input}
                                type="text"
                                placeholder='Insira seu documento'
                                label={form.getFieldState("documentType")?.value === "pj" ? "CNPJ" : "CPF"}
                                disabled={disableSubmit}
                                parse={form.getFieldState("documentType")?.value === "pj" ? formatString('XX.XXX.XXX/XXXX-XX') : formatString('XXX.XXX.XXX-XX')}
                                format={form.getFieldState("documentType")?.value === "pj" ? formatString('XX.XXX.XXX/XXXX-XX') : formatString('XXX.XXX.XXX-XX')}
                            />

                            {/* <Field
                                name="birthday"
                                placeholder="Insira aqui a data"
                                component={DatePicker}
                                label="Data de nascimento"
                                disabled={disableSubmit}
                                minDate={subYears(new Date(), 150)}
                                maxDate={subYears(new Date(), 18)}
                                showYearDropdown
                                dateFormat="dd/MM/yyyy"

                                Not used:
                            format={date => isValid(date) ? format(new Date(date), "dd/MM/yyyy") : null}
                            parse={date => isValid(date) ? toDate(date) : null}
                            /> */}

                            {(isLoadingLocation || locationOptions.length > 0) && <Field
                                name="locationId"
                                component={Select}
                                placeholder="Escolha uma opção"
                                options={locationOptions}
                                label="Localização"
                                loading={!!isLoadingLocation}
                                disabled={(errorLocation || disableSubmit) ? true : false}
                            />
                            }
                        </div>

                        <h4 className="ui header">Contato</h4>
                        <div className="fields">
                            <Field
                                name='email'
                                component={Input}
                                type="email"
                                placeholder='Insira um e-mail'
                                label='E-mail *'
                                disabled={disableSubmit}
                            />

                            <Field
                                name='phone'
                                component={Input}
                                type="text"
                                placeholder='Insira um telefone celular'
                                label='Telefone'
                                parse={formatString('(99) 99999-9999')}
                                format={formatString('(99) 99999-9999')}
                                disabled={disableSubmit}
                            />
                        </div>
                        <button className={`ui right floated secondary submit button ${(disableSubmit || invalid) && 'disabled'}`} type="submit">
                            ENVIAR
                        </button>
                    </form>
                }} />
            {onCancel && <button onClick={onCancel} className='ui right floated secondary button'>
                CANCELAR
            </button>}
        </>
    );
}

export default AdminUserForm;
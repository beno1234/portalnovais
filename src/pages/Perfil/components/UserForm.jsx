import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import formatString from "format-string-by-pattern";
import { useSelector, useDispatch } from "react-redux";
/* import { subYears } from 'date-fns';

import DatePicker from '../../../components/form/DatePicker'; */
import CustomField from '../../../components/form/CustomField';
/* import Condition from '../../../components/form/Condition'; */
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import { fetchLocations } from '../../../store/actions/location';

const UserForm = ({ initialValues, onSubmit, disableSubmit, formRef, onCancel, role }) => {
    const dispatch = useDispatch();

    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
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
            errors.name = "Insira seu nome completo.";
        }
        if (!values.email) {
            errors.email = "Insira um e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }
        //cpf /(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/
        /* if (values.document && !/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2})$/.test(values.document)) {
            errors.document = "Insira um documento válido."
        } */
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
            errors.phone = "Insira um telefone celular válido."
        }

        return errors;
    }

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
                        <h4 className="ui header">Informações Pessoais</h4>
                        <div className="fields">
                            <Field
                                name='name'
                                component={Input}
                                type="text"
                                placeholder='Insira seu nome completo'
                                label='Nome *'
                                disabled={disableSubmit}
                            />

                            {role === "advertiser" && <CustomField
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
                            />}

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
                                placeholder='Insira seu e-mail'
                                label='E-mail *'
                                disabled={disableSubmit}
                            />

                            <Field
                                name='phone'
                                component={Input}
                                type="text"
                                placeholder='Insira seu telefone celular'
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
            {
                onCancel && <button onClick={onCancel} className='ui right floated secondary button'>
                    CANCELAR
                </button>
            }
        </>
    );
}

export default UserForm;
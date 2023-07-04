import React from 'react';
import { Form, Field } from 'react-final-form';

import Input from '../../../../components/form/Input';

const AdminArticleCategoryForm = ({ initialValues, onSubmit, disableSubmit, formRef, onCancel }) => {

    const validateValues = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Insira um nome para a categoria.";
        }

        return errors;
    }

    return (
        <>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validateValues}
                render={({ handleSubmit, pristine, form, invalid }) => {
                    if (formRef) formRef.current = form;
                    return <form className="ui equal width form" onSubmit={handleSubmit}>
                        <h4 className="ui header">Informações</h4>
                        <div className="fields">
                            <Field
                                name='name'
                                component={Input}
                                type="text"
                                placeholder='Insira um nome para a categoria'
                                label='Nome *'
                                disabled={disableSubmit}
                            />
                        </div>
                        <button className={`ui right floated secondary submit button ${(disableSubmit || pristine || invalid) && 'disabled'}`} type="submit">
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

export default AdminArticleCategoryForm;
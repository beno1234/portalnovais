import React from 'react';
import { Form, Field } from 'react-final-form';
import { useSearchParams } from 'react-router-dom';

import Radio from '../form/Radio';

const Filters = ({ fields, children }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Por padrão, o filtro de nome fica selecionado
    const initialValues = {
        filter: fields[0].property
    }

    // Verifica se já havia algum parâmetro na URL para corretamente adequar o formulário
    fields.forEach(field => {
        if (searchParams.has(field.property)) {
            initialValues.filter = field.property;
            initialValues.input = searchParams.get(field.property);
        }
    });

    const onSubmit = (values) => {
        // Remove o filtro anterior
        fields.forEach(field => {
            searchParams.has(field.property) && searchParams.delete(field.property);
        });

        // Remove ordenação e sort, se houver
        if (searchParams.has("order")) searchParams.delete("order");
        if (searchParams.has("sort")) searchParams.delete("sort");

        // Busca sempre a primeira página, para evitar buscar em uma página inexistente
        searchParams.set("page", 1);

        // Adiciona o novo filtro caso haja algum valor
        values?.input && searchParams.set(values.filter, values.input);
        setSearchParams(searchParams);
    }

    const onSearchClear = () => {
        // Submit sem valor → apenas remove o filtro
        // Como searchParams é alterado, busca novamente os dados
        onSubmit();
    }

    // validate={validateValues} em Form

    /* const validateValues = (values) => {
        const errors = {};
        if (!values.input) {
            errors.input = "Insira algum valor antes de fazer a busca.";
        }
        return errors;
    } */

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            render={({ handleSubmit, form }) => (
                <form className="ui form" onSubmit={handleSubmit}>

                    <div className="inline fields">
                        <label>Buscar por:</label>
                        {fields.map((field) => {
                            return (
                                <Field
                                    key={`radio-${field.property}`}
                                    name="filter"
                                    label={field.label}
                                    value={field.property}
                                    component={Radio}
                                    type="radio"
                                    form={form}
                                />
                            );
                        })}
                    </div>

                    <div className="inline fields" style={{ height: '40px', marginBottom: 0 }}>
                        {children}
                        <div className="field">
                            <button className='ui fluid submit icon search button' type="submit">
                                <i className='search icon' />
                            </button>
                        </div>
                        <div className="field">
                            <button className='ui fluid secondary button' type="button" onClick={onSearchClear}>
                                Limpar
                            </button>
                        </div>
                    </div>

                </form>
            )} />
    );
}

export default Filters;
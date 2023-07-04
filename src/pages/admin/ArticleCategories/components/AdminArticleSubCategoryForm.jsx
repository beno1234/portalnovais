import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';

import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { fetchArticleCategories } from '../../../../store/actions/category';

const AdminArticleSubCategoryForm = ({ initialValues, onSubmit, disableSubmit, formRef, onCancel }) => {

    const dispatch = useDispatch();

    const { list, isLoading, error } = useSelector((state) => state.category);
    const categories = Object.values(list);

    const categoryOptions = categories.map((category) => {
        return {
            key: `category${category.id}`,
            value: category.id,
            text: category.name
        }
    });

    const validateValues = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Insira um nome para a categoria.";
        }
        if (!values.idCategoryParent) {
            errors.idCategoryParent = "Selecione uma categoria pai"
        }
        return errors;
    }

    const onFetchCategories = useCallback(() => {
        // Pegando os parâmetros

        dispatch(fetchArticleCategories());
    }, [dispatch])

    const onSync = () => {
        onFetchCategories();
    }

    useEffect(() => {
        onFetchCategories();
    }, [onFetchCategories]);

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

                            {(!isLoading && categoryOptions.length <= 0)
                                ? error
                                    ? <div className='field'>
                                        <label>Categoria</label>
                                        <div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            As categorias não foram carregadas corretamente.
                                            <button className='ui button' onClick={() => onSync()}>Recarregar</button>
                                        </div>
                                    </div>
                                    : <div className='field'>
                                        <label>Categoria</label><div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            Não há nenhuma categoria cadastrada.
                                        </div>
                                    </div>
                                : <Field
                                    name="idCategoryParent"
                                    component={Select}
                                    placeholder="Escolha uma categoria"
                                    options={categoryOptions}
                                    label="Categoria"
                                    loading={!!isLoading}
                                    disabled={(error || isLoading) ? true : false}
                                />
                            }
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

export default AdminArticleSubCategoryForm;
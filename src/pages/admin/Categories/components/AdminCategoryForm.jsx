import React, { useEffect, useState, useCallback } from 'react';
import { Form, Field } from 'react-final-form';

import Condition from '../../../../components/form/Condition';
import Checkbox from '../../../../components/form/Checkbox';
import Input from '../../../../components/form/Input';
import { uploadFile, getFile } from '../../../../store/actions/file';
import { dataURLtoFile } from '../../../../utils';

const AdminCategoryForm = ({ initialValues, onSubmit, disableSubmit, formRef, onCancel, image }) => {
    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(undefined);
    const [coverImageId, setCoverImageId] = useState(image);
    const [coverImageName, setCoverImageName] = useState(image && "Capa");
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);


    const validateValues = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Insira um nome para a categoria.";
        }
        if (!values.maxQuotes) {
            errors.maxQuotes = "Insira uma quantidade de cadastros máximo.";
        }

        return errors;
    }

    const onCoverUploadClick = async (file) => {
        setCoverImageLoading(true);
        setCoverImageError(false);
        const response = await uploadFile(file)
        if (response) {
            setCoverImageId(response);
        } else {
            setCoverImageError(true);
        }
        setCoverImageLoading(false)
    }

    const selectCover = (event) => {
        event.preventDefault();
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.onloadend = () => {
                setCoverImageFile(file);//reader.result
                setCoverImageName(file.name);
                onCoverUploadClick(file);
            }
            reader.readAsDataURL(file);
        }
    }

    const onFormSubmit = (formValues) => {
        const mockup = {
            "image": formValues.isFeatured ? coverImageId : null,
        }

        onSubmit({ ...mockup, ...formValues });
    }

    useEffect(() => {
        if (!coverImageFile) {
            setCoverImageURL(undefined);
            return;
        }

        // create the preview
        const objectUrl = URL.createObjectURL(coverImageFile);
        setCoverImageURL(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [coverImageFile])

    const onFetchCover = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) {
            setCoverImageFile(dataURLtoFile(response));
        } else {
            setCoverImageError(true);
        }
    }, []);

    useEffect(() => {
        image && onFetchCover(image);
    }, [image, onFetchCover]);

    return (
        <>
            <Form
                onSubmit={onFormSubmit}
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
                            <Field
                                name='maxQuotes'
                                component={Input}
                                type="number"
                                placeholder='Insira uma quantidade de cadastros máximo'
                                label='Quantidade máxima de envios por cotação *'
                                disabled={disableSubmit}
                            />
                        </div>
                        <h4 className="ui header">Detalhes de destaque</h4>
                        <div className="field">
                            <label>Destaque</label>
                            <Field
                                name="isFeatured"
                                component={Checkbox}
                                type="checkbox"
                                label="Categoria de destaque"
                                disabled={disableSubmit}
                                id="isFeatured"
                            />
                        </div>
                        <Condition when="isFeatured" is={true}>
                            <Field
                                name='description'
                                component={Input}
                                type="text"
                                placeholder='Insira uma pequena descrição'
                                label='Descrição'
                                disabled={disableSubmit}
                            />
                            <div>
                                <label htmlFor="coverImage" className="ui icon button">
                                    <i className="file icon"></i> Enviar Imagem*
                                </label>
                                {coverImageError && <>
                                    <div className="ui basic segment error message visible left aligned">
                                        Ocorreu um erro, troque a imagem ou tente novamente.
                                    </div>
                                </>}
                                <div className="ui middle aligned list">
                                    <div className="item">
                                        {coverImageLoading && <div className="ui active inverted dimmer">
                                            <div className="ui text loader">Carregando imagem...</div>
                                        </div>}
                                        <input id="coverImage" type="file" accept="image/*" onChange={(e) => selectCover(e)} style={{ display: 'none' }} />
                                        {!coverImageFile && <div className='error label' style={{ display: 'inline' }}>
                                            <i className="warning icon" />Selecione uma imagem
                                        </div>}
                                        <div className="content">
                                            {coverImageURL && <div className="ui left floated">
                                                <img alt={coverImageName} className="ui middle aligned mini image" src={coverImageURL} style={{ marginRight: "1em" }} />
                                                Imagem selecionada: <b>{coverImageName}</b>
                                            </div>}
                                            {coverImageError && <div className="ui right floated">
                                                <div className="ui button" onClick={() => onCoverUploadClick(coverImageFile)}>Tentar novamente</div>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Condition>
                        <button className={`ui right floated secondary submit button ${(disableSubmit || invalid || (form.getState().values?.isFeatured && (coverImageError || coverImageLoading || !coverImageId))) && 'disabled'}`} type="submit">
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

export default AdminCategoryForm;
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { fetchArticleCategories } from '../../../../store/actions/category';
import { uploadFile, getFile } from '../../../../store/actions/file';
import RichTextEditor from '../components/RichTextEditor';
import { isJsonString, dataURLtoFile } from '../../../../utils';

const AdminArticleForm = ({ image, description, initialValues, onSubmit, disableSubmit, formRef, onCancel }) => {

    const dispatch = useDispatch();

    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(undefined);
    const [coverImageId, setCoverImageId] = useState(image);
    const [coverImageName, setCoverImageName] = useState(image && "Capa");
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

    const [editorState, setEditorState] = useState(
        isJsonString(description)
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(description)))
            : EditorState.createEmpty()
    );

    const { list, isLoading, error } = useSelector((state) => state.category);
    const categories = Object.values(list);

    const subCategoriesOptions = [];
    /* const mainCategoryOptions =  */categories.map((category) => {
        if (category.categories?.length > 0) {
            for (let i = 0; i < category.categories.length; i++) {
                subCategoriesOptions.push({
                    key: `category${category.categories[i].id}`,
                    value: category.categories[i].id,
                    text: category.categories[i].name
                });
            }
        }
        return {
            key: `category${category.id}`,
            value: category.id,
            text: category.name
        }
    });

    //const categoryOptions = [...mainCategoryOptions, ...subCategoriesOptions];

    const onFormSubmit = (formValues) => {
        const textJSON = convertToRaw(editorState.getCurrentContent());
        const textString = JSON.stringify(textJSON);

        const mockup = {
            "site": "site",
            "image": coverImageId,
            "description": textString,
        }

        onSubmit({ ...mockup, ...formValues });
    }

    const validateValues = (values) => {
        const errors = {};
        if (!values.title) {
            errors.title = "Insira um nome para a matéria.";
        }
        if (!values.categoryId) {
            errors.categoryId = "Selecione uma categoria"
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
                                name='title'
                                component={Input}
                                type="text"
                                placeholder='Insira um título para a matéria'
                                label='Título *'
                                disabled={disableSubmit}
                            />

                            {(!isLoading && subCategoriesOptions.length <= 0)
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
                                    name="categoryId"
                                    component={Select}
                                    placeholder="Escolha uma categoria"
                                    options={subCategoriesOptions}
                                    label="Categoria"
                                    loading={!!isLoading}
                                    disabled={(error || isLoading) ? true : false}
                                />
                            }
                        </div>

                        <h4 className='ui header'>Texto</h4>
                        <RichTextEditor editorState={editorState} onEditorChange={setEditorState} />

                        <h4 className="ui header">Imagem</h4>
                        <div className='field'>
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

                        <button className={`ui right floated secondary submit button ${(disableSubmit || invalid || coverImageError || coverImageLoading || !coverImageId) && 'disabled'}`} type="submit">
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

export default AdminArticleForm;
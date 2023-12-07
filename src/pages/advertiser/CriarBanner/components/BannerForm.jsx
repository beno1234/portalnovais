import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Field } from 'react-final-form';

import DatePicker from '../../../../components/form/DatePicker';
import Condition from '../../../../components/form/Condition';
import Checkbox from '../../../../components/form/Checkbox';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { dataURLtoFile } from '../../../../utils';


import { fetchLocations } from '../../../../store/actions/location';

import { fetchCategories } from '../../../../store/actions/category';
import { uploadFile, getFile } from '../../../../store/actions/file';

const BannerForm = ({ admin, cover, initialValues, onSubmit, disableSubmit, formRef, onCancel }) => {

    const dispatch = useDispatch();

    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(undefined);
    const [coverImageId, setCoverImageId] = useState(cover);
    const [coverImageName, setCoverImageName] = useState(cover && "Capa");
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);    
    const { list: listCategory, isLoading: isLoadingCategory, error: errorCategory } = useSelector((state) => state.category);
    const categories = Object.values(listCategory);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const statusOptions = [
        {
            key: 'postedOption',
            value: 'posted',
            text: 'Ativo'
        },
        {
            key: 'blockedOption',
            value: 'blocked',
            text: 'Bloqueado (Inativo)'
        },
        {
            key: 'reviewOption',
            value: 'review',
            text: 'Em análise'
        },
    ];

    const typeOptions = [
        {
            key: 'maxBanner',
            value: 'maxBanner',
            text: 'Max Banner'
        },
        {
            key: 'featuredBanner',
            value: 'featured',
            text: 'Destaque'
        },
        {
            key: 'miniBanner',
            value: 'miniBanner',
            text: 'Mini Banner'
        }
    ];

    const pageOptions = [
        {
            key: 'homepage',
            value: 'home',
            text: 'Home'
        },
        {
            key: 'guiadeempresaspage',
            value: 'guiaDeEmpresas',
            text: 'Guia De Empresas'
        }
    ];

    const categoryOptions = categories.map((category) => {
        return {
            key: `category${category.id}`,
            value: category.id,
            text: category.name
        }
    });

    const locationOptions = locations.map((location) => {
        return {
            key: `location${location.id}`,
            value: location.id,
            text: location.name
        }
    });


    const onFormSubmit = (formValues) => {
        /* if (formValues.phone) {
            formValues.phone = formValues.phone.replace(/\D/g, "");
        }

        if (formValues.whatsApp) {
            formValues.whatsApp = formValues.whatsApp.replace(/\D/g, "");
        } */

        const mockup = {
            "cover": coverImageId,
        }

        if (formValues.blockOnDate) {
            delete formValues.blockOnDate;
        } else {
            delete formValues.blockOnDate;
            formValues.expirationDate = null;
        }

        onSubmit({ ...mockup, ...formValues });
    }

    const validateValues = (values) => {
        const errors = {};

        if (!values.site) {
            errors.site = "Insira um link."
        } else {
            if (!/^(ftp|http|https|HTTP|HTTPS):\/\/[^ "]+$/.test(values.site)) {
                errors.site = "Insira um link válido."
            }
        }

        if (!values.type) {
            errors.type = "Insira o tipo do banner.";
        } else {
            if (values.type === "maxBanner" && (!values.bannerPlaces || values.bannerPlaces?.length <= 0)) {
                errors.bannerPlaces = "Selecione o(s) local(is) do banner.";
            }
        }
        if (!values.categories || values.categories?.length <= 0) {
            errors.categories = "Selecione ao menos uma categoria"
        }
        if (!values.name) {
            errors.name = "Insira o nome da empresa para identificação"
        }
        if (values.blockOnDate && !values.expirationDate) {
            errors.expirationDate = "Insira uma data."
        }
        if (admin && !values.status) {
            errors.status = "Selecione um status";
        }
        /* if (!values.email) {
            errors.email = "Insira o e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }
        if (!values.whatsApp) {
            errors.whatsApp = "Insira um telefone celular."
        } else if (!/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(values.whatsApp)) {
            errors.whatsApp = "Insira um telefone celular válido."
        } */

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

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchLocations());
    }, [dispatch]);

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
        cover && onFetchCover(cover);
    }, [cover, onFetchCover]);

    return (
        <>
            <Form
                onSubmit={onFormSubmit}
                initialValues={initialValues}
                validate={validateValues}
                render={({ handleSubmit, pristine, form, invalid }) => {
                    if (formRef) formRef.current = form;
                    return <form className="ui equal width form" onSubmit={handleSubmit}>
                        {/* <div className="ui header">
                            Informações de contato
                        </div>

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
                                name='whatsApp'
                                component={Input}
                                type="text"
                                placeholder='Insira seu WhatsApp'
                                label='WhatsApp *'
                                parse={formatString('(99) 99999-9999')}
                                format={formatString('(99) 99999-9999')}
                                disabled={!!disableSubmit}
                            />
                        </div> */}
                        <h4 className="ui header">Informações do banner</h4>
                        <div className="fields">
                            <Field
                                name="name"
                                component={Input}
                                type="text"
                                label="Nome da empresa *"
                                placeholder="Nome"
                                disabled={disableSubmit}
                            />

                            <Field
                                name="site"
                                component={Input}
                                type="text"
                                label="Link *"
                                placeholder="Coloque o link para seu Site ou Instagram"
                                disabled={disableSubmit}
                            />

                            {(!isLoadingCategory && categoryOptions.length <= 0)
                                ? errorCategory
                                    ? <div className='field'>
                                        <label>Categoria</label>
                                        <div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            As categorias não foram carregadas corretamente.
                                        </div>
                                    </div>
                                    : <div className='field'>
                                        <label>Categoria</label><div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            Não há nenhuma categoria cadastrada.
                                        </div>
                                    </div>
                                : <Field
                                    name="categories"
                                    component={Select}
                                    placeholder="Escolha uma opção"
                                    options={categoryOptions}
                                    label="Serviços *"
                                    loading={!!isLoadingCategory}
                                    isMultiple
                                    disabled={(errorCategory || disableSubmit) ? true : false}
                                />
                            }
                        </div>

                        <div className="fields">
                            <Field
                                name="type"
                                component={Select}
                                placeholder="Escolha uma opção"
                                options={typeOptions}
                                label="Tipo do banner *"
                                disabled={disableSubmit}
                            />

                            <Condition when="type" is="maxBanner">
                                <Field
                                    name="bannerPlaces"
                                    component={Select}
                                    options={pageOptions}
                                    placeholder="Escolha uma opção"
                                    label="Em qual local *"
                                    disabled={disableSubmit}
                                    isMultiple
                                />
                            </Condition>
                        </div>

                        {(!isLoadingLocation && locationOptions.length <= 0)
                                ? errorLocation
                                    ? <div className='field'>
                                        <label>Localização</label>
                                        <div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            As localizações não foram carregadas corretamente.
                                        </div>
                                    </div>
                                    : <div className='field'>
                                        <label>Localização</label><div className='ui error message visible'>
                                            <i className='warning icon'></i>
                                            Não há nenhuma localização cadastrada.
                                        </div>
                                    </div>
                                : <Field
                                    name="locations"
                                    component={Select}
                                    placeholder="Escolha uma opção"
                                    options={locationOptions}
                                    label="Localização *"
                                    loading={!!isLoadingLocation}
                                    isMultiple
                                    disabled={(errorLocation || disableSubmit) ? true : false}
                                />
                            }


                        <h4 className="ui header">Imagens</h4>
                        <div className='field'>
                            <label htmlFor="coverImage" className="ui icon button">
                                <i className="file icon"></i> Enviar Capa*
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
                                        <i className="warning icon" />Selecione uma imagem de capa
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
                            <p style={{ fontSize: "0.85em" }}>Formato de arquivo recomendado: GIF animado</p>
                            <Condition when="type" is="maxBanner">
                                <p style={{ fontSize: "0.85em" }}>Tamanho recomendado: <b>800x96 pixels</b></p>
                            </Condition>
                            <Condition when="type" is="featured">
                                <p style={{ fontSize: "0.85em" }}>Tamanho recomendado: <b>174x280 pixels</b></p>
                            </Condition>
                            <Condition when="type" is="miniBanner">
                                <p style={{ fontSize: "0.85em" }}>Tamanho recomendado: <b>174x70 pixels</b></p>
                            </Condition>
                        </div>

                        {admin && <>
                            <div className="ui header">Para o controle do sistema</div>
                            <div className="fields">
                                <Field
                                    name="status"
                                    component={Select}
                                    placeholder="Escolha uma opção"
                                    options={statusOptions}
                                    label="Status *"
                                    disabled={!!disableSubmit}
                                />
                                <div className="field">
                                    <label>Despublicação</label>
                                    <Field
                                        name="blockOnDate"
                                        component={Checkbox}
                                        type="checkbox"
                                        label="Programar para despublicar?"
                                        disabled={disableSubmit}
                                        id="blockOnDateCheckbox"
                                    />
                                </div>
                                <Condition when="blockOnDate" is={true}>
                                    <Field
                                        name="expirationDate"
                                        placeholder="Insira aqui a data"
                                        component={DatePicker}
                                        label="Data de despublicação"
                                        disabled={disableSubmit}
                                        minDate={new Date()}
                                        dateFormat="dd/MM/yyyy"
                                    /* format={date => isValid(date) ? format(new Date(date), "dd/MM/yyyy") : null}
                                    parse={date => isValid(date) ? toDate(date) : null} */
                                    />
                                </Condition>
                            </div>
                        </>}

                        <button className={`ui right floated secondary submit button ${(disableSubmit || invalid || coverImageError || coverImageLoading || !coverImageId || isLoadingCategory|| isLoadingLocation || categoryOptions.length <= 0 || locationOptions.length <= 0) && 'disabled'}`} type="submit">
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

export default BannerForm;
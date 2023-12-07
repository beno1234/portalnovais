import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import Input from '../../../components/form/Input';
import Condition from '../../../components/form/Condition';
import Select from '../../../components/form/Select';
import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';

import { createBanner } from '../../../store/actions/banner';
import { fetchCategories } from '../../../store/actions/category';
import { fetchLocations } from '../../../store/actions/location';
import { uploadFile } from '../../../store/actions/file';

const CriarBanner = () => {
    const { error: errorBanner, isLoading: isLoadingBanner } = useSelector((state) => state.banner);
    const { list: listCategory, isLoading: isLoadingCategory, error: errorCategory } = useSelector((state) => state.category);

    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    const locations = indexOrderLocation.map((index) => listLocation[index]);


    const categories = Object.values(listCategory);

    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(undefined);
    const [coverImageId, setCoverImageId] = useState(undefined);
    const [coverImageName, setCoverImageName] = useState(undefined);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

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
    

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (formValues) => {
        /* if (formValues.phone) {
            formValues.phone = formValues.phone.replace(/\D/g, "");
        }

        if (formValues.whatsApp) {
            formValues.whatsApp = formValues.whatsApp.replace(/\D/g, "");
        } */

       

        const mockup = {
            "cover": coverImageId,
            "bannerPlaces": ["home"]
            /* "phone": formValues.whatsApp ? formValues.whatsApp : "11988889999", */
        }

        const success = await dispatch(createBanner({ ...mockup, ...formValues }));
        if (success) navigate('/anunciante/meus-banners');
       
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
        if (!values.locations || values.locations?.length <= 0) {
            errors.locations = "Selecione ao menos uma localização"
        }
        if (!values.categories || values.categories?.length <= 0) {
            errors.categories = "Selecione ao menos uma categoria"
        }
        if (!values.name) {
            errors.name = "Insira o nome da empresa para identificação"
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

    return (
        <>
            <Masthead />

            <div className='ui signup section container'>
                <div className='ui middle aligned center aligned grid'>
                    <div className='ui raised login clearing segment'>
                        <div className='ui center aligned header'>Criação de Banner</div>
                        {errorBanner && <div className="ui error message">
                            <div className="header">{errorBanner.message}</div>
                            <p>Por favor, tente novamente.</p>
                        </div>}
                        {isLoadingBanner && <div className="ui active inverted dimmer">
                            <div className="ui text loader">{isLoadingBanner.message}</div>
                        </div>}
                        <Form
                            onSubmit={onSubmit}
                            keepDirtyOnReinitialize
                            initialValues={{
                                categories: [],
                                locations: [],
                                bannerPlaces: ["home"]
                            }}
                            validate={validateValues}
                            render={({ handleSubmit }) => (
                                <form className="ui form" onSubmit={handleSubmit}>
                                    {/* <div className="ui header">
                                        Informações de contato
                                    </div>

                                    <Field
                                        name='email'
                                        component={Input}
                                        type="email"
                                        placeholder='Insira seu e-mail'
                                        label='E-mail *'
                                        disabled={!!isLoadingBanner}
                                    />

                                    <Field
                                        name='whatsApp'
                                        component={Input}
                                        type="text"
                                        placeholder='Insira seu WhatsApp'
                                        label='WhatsApp *'
                                        parse={formatString('(99) 99999-9999')}
                                        format={formatString('(99) 99999-9999')}
                                        disabled={!!isLoadingBanner}
                                    /> */}

                                    <div className="ui header">
                                        Informações do banner
                                    </div>

                                    <Field
                                        name="name"
                                        component={Input}
                                        type="text"
                                        label="Nome da empresa *"
                                        placeholder="Nome"
                                        disabled={!!isLoadingBanner}
                                    />

                                    <Field
                                        name="site"
                                        component={Input}
                                        type="text"
                                        label="Link *"
                                        placeholder="Coloque o link para seu Site ou Instagram"
                                        disabled={!!isLoadingBanner}
                                    />

                                    <Field
                                        name="type"
                                        component={Select}
                                        placeholder="Escolha uma opção"
                                        options={typeOptions}
                                        label="Tipo do banner *"
                                        disabled={!!isLoadingBanner}
                                    />

                                    <Condition when="type" is="maxBanner">
                                        <Field
                                            name="bannerPlaces"
                                            component={Select}
                                            options={pageOptions}
                                            placeholder="Escolha uma opção"
                                            label="Em qual local *"
                                            disabled={!!isLoadingBanner}
                                            isMultiple
                                        />
                                    </Condition>

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
                                            isMultiple
                                            loading={!!isLoadingCategory}
                                            disabled={(errorCategory || isLoadingBanner) ? true : false}
                                        />
                                    }

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
                                            disabled={(errorLocation ||isLoadingBanner) ? true : false}
                                        />
                                    }

                                    <div className='ui header'>
                                        Banner
                                    </div>
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

                                    <div className='ui right floated basic segment'>
                                        <button className={`ui button ${(coverImageError || coverImageLoading || !coverImageId || isLoadingBanner || isLoadingCategory || isLoadingLocation || categoryOptions.length <= 0 || locationOptions.length<=0) && 'disabled'}`} type="submit">Cadastrar</button>
                                    </div>
                                </form>
                            )} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default CriarBanner;
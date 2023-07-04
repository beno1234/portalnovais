import 'semantic-ui-css/semantic.min.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Field } from 'react-final-form';
import formatString from 'format-string-by-pattern';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

import DatePicker from '../../../../components/form/DatePicker';
import Condition from '../../../../components/form/Condition';
import Checkbox from '../../../../components/form/Checkbox';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import RichTextEditor from '../../../admin/Articles/components/RichTextEditor';
import { isJsonString, dataURLtoFile } from '../../../../utils';

import { fetchCategories } from '../../../../store/actions/category';
import { fetchLocations } from '../../../../store/actions/location';
import { uploadFile, getFile } from '../../../../store/actions/file';

const AdvertisementForm = ({ description, admin, cover, images, initialValues, onSubmit, disableSubmit, formRef, onCancel }) => {

    const dispatch = useDispatch();

    const [coverImageURL, setCoverImageURL] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(undefined);
    const [coverImageId, setCoverImageId] = useState(cover?.length > 0 && cover[0]);
    const [coverImageName, setCoverImageName] = useState(cover && "Capa");
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

    const [carouselImagesURL, setCarouselImagesURL] = useState([]);
    const [carouselImagesFile, setCarouselImagesFile] = useState([]);
    const [carouselImagesId, setCarouselImagesId] = useState(images);
    const [carouselImagesName, setCarouselImagesName] = useState(images?.map((image, index) => `Carrossel ${index}`));
    const [carouselImagesLoading, setCarouselImagesLoading] = useState(false);
    const [carouselImagesError, setCarouselImagesError] = useState(images?.map(image => false));

    const [editorState, setEditorState] = useState(
        isJsonString(description)
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(description)))
            : EditorState.createEmpty()
    );

    const { list: listCategory, isLoading: isLoadingCategory, error: errorCategory } = useSelector((state) => state.category);
    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    const categories = Object.values(listCategory);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const typeOptions = [
        {
            key: 'defaultOption',
            value: 'default',
            text: 'Padrão'
        },
        {
            key: 'featOption',
            value: 'certified',
            text: 'Certificado'
        }
    ];

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
        const textJSON = convertToRaw(editorState.getCurrentContent());
        const textString = JSON.stringify(textJSON);

        const mockup = {
            "price": 1.1,
            "cover": coverImageId,
            "images": carouselImagesId,
            "description": textString
        }

        if (!formValues.sale) formValues.sale = null;
        if (formValues.phone === "") delete formValues.phone;
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

        if (!values.name) {
            errors.name = "Insira o nome da empresa.";
        }
        if (!values.email) {
            errors.email = "Insira o e-mail.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Insira um e-mail válido."
        }
        if (!values.whatsapp) {
            errors.whatsapp = "Insira um número de telefone para comunicação por WhatsApp.";
        } else if (!/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(values.whatsapp)) {
            errors.whatsapp = "Insira um número de telefone celular válido."
        }
        if (values.phone && values.phone !== "" && !/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(values.phone)) {
            errors.phone = "Insira um número de telefone celular válido."
        }
        if (!values.categories || values.categories?.length <= 0) {
            errors.categories = "Selecione ao menos uma categoria"
        }
        if (!values.locations || values.locations?.length <= 0) {
            errors.locations = "Selecione ao menos uma localização"
        }
        if (values.site && !/^(ftp|http|https|HTTP|HTTPS):\/\/[^ "]+$/.test(values.site)) {
            errors.site = "Insira um link válido para o site."
        }
        if (values.facebook && !/^(ftp|http|https|HTTP|HTTPS):\/\/[^ "]+$/.test(values.facebook)) {
            errors.facebook = "Insira um link válido para o facebook."
        }
        if (values.instagram && !/^(ftp|http|https|HTTP|HTTPS):\/\/[^ "]+$/.test(values.instagram)) {
            errors.instagram = "Insira um link válido para o instagram."
        }
        if (values.youtube && !/^(ftp|http|https|HTTP|HTTPS):\/\/[^ "]+$/.test(values.youtube)) {
            errors.youtube = "Insira um link válido para o YouTube."
        }
        if (values.blockOnDate && !values.expirationDate) {
            errors.expirationDate = "Insira uma data."
        }
        if (admin && !values.status) {
            errors.status = "Selecione um status";
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

    const onCarouselUploadClick = async (file) => {
        setCarouselImagesLoading(true);
        const response = await uploadFile(file)

        if (response) {
            setCarouselImagesId((ids) => [...ids, response]);
            setCarouselImagesError((errors) => [...errors, false]);
        } else {
            setCarouselImagesError((errors) => [...errors, 'Ocorreu um erro, remova a imagem ou tente novamente.']);
        }
        setCarouselImagesLoading(false);
    }

    const onCarouselReuploadClick = async (file, index) => {
        setCarouselImagesLoading(true);

        setCarouselImagesError((errors) => {
            errors[index] = false;
            return errors;
        });

        const response = await uploadFile(file)

        if (response) {
            setCarouselImagesId((ids) => {
                ids[index] = response;
                return ids;
            });
        } else {
            setCarouselImagesError((errors) => {
                errors[index] = true;
                return errors;
            });
        }
        setCarouselImagesLoading(false);
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

    const selectCarousel = async (event) => {
        event.preventDefault();
        const reader = new FileReader();
        if (event.target.files) {
            const file = event.target.files[0];
            reader.onloadend = () => {
                setCarouselImagesFile(prev => [...prev, file]);
                setCarouselImagesName(prev => [...prev, file.name])
                onCarouselUploadClick(file);
            }
            reader.readAsDataURL(file);
        }
    }

    const removeImageFromList = (index) => {
        const splicedFiles = [...carouselImagesFile];
        const splicedNames = [...carouselImagesName];
        const splicedURLs = [...carouselImagesURL];
        const splicedIds = [...carouselImagesId];
        const splicedErrors = [...carouselImagesError];
        splicedFiles.splice(index, 1)
        splicedNames.splice(index, 1)
        splicedURLs.splice(index, 1)
        splicedIds.splice(index, 1)
        splicedErrors.splice(index, 1)
        setCarouselImagesFile(splicedFiles);
        setCarouselImagesName(splicedNames);
        setCarouselImagesURL(splicedURLs);
        setCarouselImagesId(splicedIds);
        setCarouselImagesError(splicedErrors);
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

    useEffect(() => {
        if (!carouselImagesFile || carouselImagesFile?.length <= 0) {
            setCarouselImagesURL([]);
            return;
        }

        const objectUrls = carouselImagesFile.map(file => URL.createObjectURL(file));

        setCarouselImagesURL(objectUrls);

        // free memory when ever this component is unmounted
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [carouselImagesFile])

    const onFetchCover = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) {
            setCoverImageFile(dataURLtoFile(response));
        } else {
            setCoverImageError(true);
        }
    }, []);

    const onFetchCarousel = useCallback(async (ids) => {
        ids.forEach(async id => {
            const response = await getFile(id);
            if (response) {
                setCarouselImagesFile(files => [...files, dataURLtoFile(response)]);
                setCarouselImagesError(errors => [...errors, false]);
            } else {
                setCarouselImagesFile(files => [...files, new File()])
                setCarouselImagesError(errors => [...errors, true]);
            }
        })
    }, []);

    useEffect(() => {
        cover && onFetchCover(cover);
    }, [cover, onFetchCover]);

    useEffect(() => {
        images && onFetchCarousel(images);
    }, [images, onFetchCarousel]);

    return (
        <>
            <Form
                onSubmit={onFormSubmit}
                initialValues={initialValues}
                validate={validateValues}
                render={({ handleSubmit, pristine, form, invalid }) => {
                    if (formRef) formRef.current = form;
                    return <form className="ui equal width form" onSubmit={handleSubmit}>
                        <h4 className="ui header">Informações do anúncio</h4>
                        <div className="fields">
                            <Field
                                name="name"
                                component={Input}
                                type="text"
                                label="Nome da empresa *"
                                placeholder=""
                                disabled={disableSubmit}
                            />
                            <Field
                                name="sale"
                                component={Input}
                                type="text"
                                label="Alguma promoção vigente?"
                                placeholder="Descreva a promoção que seu serviço está oferencendo."
                                disabled={disableSubmit}
                            />
                        </div>

                        <h4 className='ui header'>Descrição</h4>
                        <div className="field">
                            <RichTextEditor editorState={editorState} onEditorChange={setEditorState} />
                        </div>

                        <div className="fields">
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

                            {admin && <Field
                                name="type"
                                component={Select}
                                placeholder="Escolha uma opção"
                                options={typeOptions}
                                label="Classificação *"
                                disabled={!!disableSubmit}
                            />}
                        </div>

                        <h4 className="ui header">Contato</h4>
                        <div className="fields">
                            <Field
                                name="email"
                                component={Input}
                                type="email"
                                label="E-mail *"
                                placeholder=""
                                disabled={disableSubmit}
                            />
                            <Field
                                name="whatsapp"
                                component={Input}
                                type="text"
                                label="WhatsApp *"
                                placeholder=""
                                disabled={disableSubmit}
                                parse={formatString('(99) 99999-9999')}
                                format={formatString('(99) 99999-9999')}
                            />
                            <Field
                                name="phone"
                                component={Input}
                                type="text"
                                label="Telefone celular"
                                placeholder=""
                                disabled={disableSubmit}
                                parse={formatString('(99) 99999-9999')}
                                format={formatString('(99) 99999-9999')}
                            />
                        </div>

                        <h4 className="ui header">Redes Sociais</h4>
                        <div className="fields">
                            <Field
                                name="site"
                                component={Input}
                                type="text"
                                label="Website"
                                placeholder="https://website.com"
                                disabled={disableSubmit}
                            />
                            <Field
                                name="facebook"
                                component={Input}
                                type="text"
                                label="Facebook"
                                placeholder="https://facebook.com/pagina"
                                disabled={disableSubmit}
                            />
                            <Field
                                name="instagram"
                                component={Input}
                                type="text"
                                label="Instagram"
                                placeholder="https://instagram.com/pagina"
                                disabled={disableSubmit}
                            />
                            <Field
                                name="youtube"
                                component={Input}
                                type="text"
                                label="Canal do YouTube"
                                placeholder="https://youtube.com/@canal"
                                disabled={disableSubmit}
                            />
                        </div>

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
                        </div>

                        <div className='field'>
                            <label className='image input label'>Fotos do seu serviço ou produto</label>
                            <label htmlFor="carouselImage" className={`ui icon send file button ${carouselImagesURL?.length >= 10 && 'disabled'}`}>
                                <i className="file icon"></i> Enviar Imagens do Carrossel (opcional)</label>
                            <input id="carouselImage" type="file" accept="image/*" onChange={(e) => selectCarousel(e)} onClick={(event) => { event.target.value = null }} style={{ display: 'none' }} />
                            <div className='label' style={{ display: 'inline' }}>
                                Imagens do carrossel: <b>{carouselImagesURL?.length}</b> / 10
                            </div>
                        </div>

                        <div style={{ paddingBottom: '5em' }}>
                            {
                                carouselImagesURL &&
                                carouselImagesURL.map((image, index) => {
                                    return <div className="ui middle aligned divided list" key={index}>
                                        {carouselImagesLoading && <div className="ui active inverted dimmer">
                                            <div className="ui text loader">Carregando imagem...</div>
                                        </div>}
                                        <div className="item">
                                            <div className="right floated content">
                                                {carouselImagesError[index] && <>

                                                    <div className="ui secondary button" onClick={() => onCarouselReuploadClick(image, index)}>Tentar novamente</div>
                                                </>}
                                                <div className="ui secondary button" onClick={() => removeImageFromList(index)}>
                                                    <i className='x icon'></i>
                                                    Remover
                                                </div>
                                            </div>
                                            <img alt={carouselImagesName[index]} className="ui middle aligned mini image" src={carouselImagesURL[index]} />
                                            <div className="content">
                                                <div className='header'>{carouselImagesName[index]}</div>
                                                {carouselImagesError[index] && <div className='description'>Ocorreu um erro, <b>remova a imagem ou tente novamente</b>.</div>}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
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

                        <button className={`ui right floated secondary submit button ${(disableSubmit || invalid || coverImageError || carouselImagesError?.includes(true) || !coverImageId || coverImageLoading || carouselImagesLoading || isLoadingCategory || isLoadingLocation || categoryOptions.length <= 0 || locationOptions.length <= 0) && 'disabled'}`} type="submit">
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

export default AdvertisementForm;
import 'semantic-ui-css/semantic.min.css';
import React, { useEffect } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';

import Select from '../../components/form/Select';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import AnuncioCard from '../../components/AnuncioCard';
import { fetchCategories } from '../../store/actions/category';
import { fetchLocations } from '../../store/actions/location';
import { fetchFeaturedAdvertisements } from '../../store/actions/advertisement';
import SideBarMenu from '../../components/SideBarMenu';
import useMenu from '../../hooks/useMenu';
import Publicidade from '../../components/Publicidade';
import FeaturedCategoryCard from '../../components/FeaturedCategoryCard';

const Home = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { list: listCategory, isLoading: isLoadingCategory, error: errorCategory } = useSelector((state) => state.category);
    const { list: listLocation, isLoading: isLoadingLocation, error: errorLocation, indexOrder: indexOrderLocation } = useSelector((state) => state.location);
    const { featuredList: listFeaturedAdvertisement/* , isLoading: isLoadingAdvertisement, error: errorAdvertisement */ } = useSelector((state) => state.advertisement);

    const categories = Object.values(listCategory);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const featuredCategories = categories.filter(category => category.isFeatured);

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

    const onStartPlanningClick = (formValues) => {
        navigate({
            pathname: '/cadastro',
            search: `?${createSearchParams(formValues)}`
        });
    }

    const onSearchAdvertisements = (formValues) => {
        navigate({
            pathname: '/anuncios',
            search: `?${createSearchParams(formValues)}`
        });
    }

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchLocations());
        dispatch(fetchFeaturedAdvertisements());
    }, [dispatch]);

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui inverted vertical masthead banner center aligned segment'>
                    <div className='ui container'>
                        <div className="ui equal width stackable grid">
                            <div className='center aligned row'>
                                <div className='column'>
                                    <h1 className="ui inverted header">
                                        Aqui você realiza o casamento dos seus sonhos
                                    </h1>
                                </div>
                            </div>
                            <div className="center aligned row">
                                <div className="column">
                                    <div className="ui basic container">
                                        <Form
                                            onSubmit={onStartPlanningClick}
                                            render={({ handleSubmit }) => (
                                                <form className="ui equal width form" onSubmit={handleSubmit}>
                                                    <div className="fields">
                                                        <div className="field">
                                                            <Field
                                                                name="name"
                                                                component="input"
                                                                type="text"
                                                                placeholder="Seu Nome Completo"
                                                            />
                                                        </div>
                                                        <div className="field">
                                                            <Field
                                                                name="email"
                                                                component="input"
                                                                type="text"
                                                                placeholder="Seu E-mail"
                                                            />
                                                        </div>
                                                        <div className="field">
                                                            <button className="ui fluid button">
                                                                Comece a Planejar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Publicidade random types={"maxBanner"} place={"home"} limit={1} />

                {((!isLoadingCategory || !isLoadingLocation) && (categoryOptions.length > 0 || categoryOptions > 0)) && <>
                    <div className='ui container'>
                        <div className='ui vertical section center aligned segment'>
                            <h2 className='ui header'>GUIA DE EMPRESAS</h2>
                            <div className="ui equal width stackable grid">
                                <div className="center aligned row">
                                    <div className="column">
                                        <div className="ui basic container">
                                            <Form
                                                onSubmit={onSearchAdvertisements}
                                                render={({ handleSubmit }) => (
                                                    <form className="ui equal width form" onSubmit={handleSubmit}>
                                                        <div className="fields">
                                                            {(isLoadingCategory || categoryOptions.length > 0)
                                                                && <Field
                                                                    name="category"
                                                                    component={Select}
                                                                    placeholder="Escolha uma opção"
                                                                    options={categoryOptions}
                                                                    loading={!!isLoadingCategory}
                                                                    disabled={(errorCategory) ? true : false}
                                                                />
                                                            }
                                                            {(isLoadingLocation || locationOptions.length > 0)
                                                                && <Field
                                                                    name="location"
                                                                    component={Select}
                                                                    placeholder="Escolha uma opção"
                                                                    options={locationOptions}
                                                                    loading={!!isLoadingLocation}
                                                                    disabled={(errorLocation) ? true : false}
                                                                />
                                                            }
                                                            <div className="field">
                                                                <button className="ui fluid button" type='submit'>
                                                                    PESQUISAR
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}

                {listFeaturedAdvertisement.length > 0 && <>
                    <div className='ui container'>
                        <div className='ui vertical section center aligned segment'>
                            <h4 className="ui horizontal header divider">Destaques</h4>
                            <h2 className='ui header'>FORNECEDORES EM DESTAQUE</h2>
                            <div className="ui equal width stackable grid">
                                <div className="center aligned row">
                                    {
                                        listFeaturedAdvertisement.map((advertisement, index) => <div className="featured column" key={`featAd${index}`}>
                                            <AnuncioCard data={advertisement} basic />
                                        </div>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>}

                {featuredCategories?.length > 0 && <div className='ui container'>
                    <div className='ui vertical section center aligned segment'>
                        <h4 className="ui horizontal header divider">Serviços</h4>
                        <h2 className='ui header'>CATEGORIAS</h2>
                        <div className='ui link three stackable cards'>
                            {featuredCategories.map(category => {
                                return <FeaturedCategoryCard data={category} key={`categoryCard${category.id}`} onSearch={onSearchAdvertisements} />
                            })}
                        </div>
                    </div>
                </div>}

                <Footer />
            </div>
        </>
    );
}

export default Home;
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Masthead from '../../components/Masthead';
import Publicidade from '../../components/Publicidade';
import Footer from '../../components/Footer';
import PublicAdvertisementList from './components/PublicAdvertisementList';
import FeaturedAdvertisementList from './components/FeaturedAdvertisementList';
import InRegionSaleAdvertisementList from './components/InRegionSaleAdvertisementList';
import { fetchCategories } from '../../store/actions/category';
import { fetchLocations } from '../../store/actions/location';
import useMenu from '../../hooks/useMenu';
import SideBarMenu from '../../components/SideBarMenu';
import { HiOutlineLocationMarker, HiOutlineBookOpen, HiOutlineShieldCheck } from 'react-icons/hi';

const GuiaDeEmpresas = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const dispatch = useDispatch();
    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams, setSearchParams] = useSearchParams(defaultParam);

    const { list: listCategory, indexOrder: indexOrderCategory, isLoading: isLoadingCategory/* , error: errorCategory */ } = useSelector((state) => state.category);
    const { list: listLocation, indexOrder: indexOrderLocation, isLoading: isLoadingLocation/* , error: errorLocation */ } = useSelector((state) => state.location);
    const categories = indexOrderCategory.map((index) => listCategory[index]);
    const locations = indexOrderLocation.map((index) => listLocation[index]);

    const selectedCategories = useRef(searchParams.has("category") ? searchParams.getAll("category")[0].split(',').map(n => parseInt(n)) : []);

    const onCategorySelect = (id) => {
        selectedCategories.current.includes(id)
            ? selectedCategories.current = selectedCategories.current.filter((n) => n !== id)
            : selectedCategories.current.push(id);

        selectedCategories.current.length > 0 ? searchParams.set("category", selectedCategories.current.toString()) : searchParams.delete("category");
        setSearchParams(searchParams);
    }

    const selectedLocations = useRef(searchParams.has("location") ? searchParams.getAll("location")[0].split(',').map(n => parseInt(n)) : []);

    const onLocationSelect = (id) => {
        selectedLocations.current.includes(id)
            ? selectedLocations.current = selectedLocations.current.filter((n) => n !== id)
            : selectedLocations.current.push(id);

        selectedLocations.current.length > 0 ? searchParams.set("location", selectedLocations.current.toString()) : searchParams.delete("location");
        setSearchParams(searchParams);
    }

    const certifiedSelection = useRef((searchParams.has("type") && searchParams.get("type") === "certified") ? true : false);

    const onCertifiedSelect = () => {
        certifiedSelection.current = !certifiedSelection.current;
        certifiedSelection.current ? searchParams.set("type", "certified") : searchParams.delete("type");
        setSearchParams(searchParams);
    }

    /* const onClearFilters = () => {
        selectedCategories.current = [];
        selectedLocations.current = [];

        searchParams.has("category") && searchParams.delete("category");
        searchParams.has("location") && searchParams.delete("location");

        setSearchParams(searchParams);
    } */

    useEffect(() => {
        dispatch(fetchCategories(new URLSearchParams("orderBy=name")));
        dispatch(fetchLocations());
    }, [dispatch]);

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui inverted vertical masthead secondary banner center aligned segment'>
                    <div className="ui container">
                        <div className="ui equal width stackable grid">
                            <div className='center aligned row'>
                                <div className='column'>
                                    <h1 className="ui inverted header">
                                        Guia de Empresas
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Publicidade random types={"maxBanner"} place={"guiaDeEmpresas"} limit={1} category={searchParams.get("category")} />

                <div className='ui guiaDeEmpresas basic segment'>

                    <div className='ui stackable centered grid'>

                        <div className='four wide tablet three wide computer column'>
                            <div className='ui stackable centered grid'>
                                <div className='left floated eight wide column'>
                                    <h3>
                                        Filtros
                                    </h3>
                                </div>

                                {/* <div className='right floated right aligned eight wide column'>
                                <button className="ui secondary button" type="button" onClick={onClearFilters}>Limpar</button>
                            </div> */}
                            </div>

                            <div className='ui divider'></div>

                            <div className='ui form'>
                                <div className="ui filter header">
                                    <HiOutlineShieldCheck className='ui icon' />
                                    Certificados
                                </div>

                                <div className="ui stackable grid">
                                    <div className="option column">
                                        <div className="inline field">
                                            <div className="ui checkbox">
                                                <input type="checkbox" tabIndex="0" className="hidden" id="certifiedCheckbox" onChange={onCertifiedSelect} checked={certifiedSelection.current} />
                                                <label htmlFor="certifiedCheckbox">Apenas anúncios certificados</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='ui filter header'>
                                    <HiOutlineBookOpen className='ui icon' />
                                    Categorias de Serviço
                                </div>

                                <div className='ui stackable two column grid'>
                                    {
                                        categories.length > 0 ? categories.map(category => <div className='option column' key={`${category.name}${category.id}`}>
                                            <div className="inline field">
                                                <div className="ui checkbox">
                                                    <input type="checkbox" tabIndex="0" className="hidden" id={category.name} onChange={() => onCategorySelect(category.id)} checked={selectedCategories.current.includes(category.id)} />
                                                    <label htmlFor={category.name}>{category.name}</label>
                                                </div>
                                            </div>
                                        </div>) : !!isLoadingCategory
                                            ? <p>Carregando categorias...</p>
                                            : <p>Nenhuma categoria encontrada.</p>
                                    }
                                </div>

                                <div className='ui filter header'>
                                    <HiOutlineLocationMarker className='ui icon' />
                                    Localização
                                </div>

                                <div className='ui stackable two column grid'>
                                    {
                                        locations.length > 0 ? locations.map(location => <div className='option column' key={location.name}>
                                            <div className="inline field">
                                                <div className="ui checkbox">
                                                    <input type="checkbox" tabIndex="0" className="hidden" id={location.name} onChange={() => onLocationSelect(location.id)} checked={selectedLocations.current.includes(location.id)} />
                                                    <label htmlFor={location.name}>{location.name}</label>
                                                </div>
                                            </div>
                                        </div>) : !!isLoadingLocation
                                            ? <p>Carregando localizações...</p>
                                            : <p>Nenhuma localização encontrada.</p>
                                    }
                                </div>

                            </div>
                        </div>

                        <div className='eleven wide tablet custom twelve wide computer column'>
                            <div className="ui stackable grid">
                                <PublicAdvertisementList searchParams={searchParams} />
                            </div>
                        </div>
                    </div>

                </div>

                <InRegionSaleAdvertisementList category={searchParams.get("category")} />

                <FeaturedAdvertisementList category={searchParams.get("category")} location={searchParams.get("location")} />

                <Footer />
            </div>
        </>
    );
}

export default GuiaDeEmpresas;
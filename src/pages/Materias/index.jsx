import 'semantic-ui-css/semantic.min.css';
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';

import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import { fetchArticleCategories } from '../../store/actions/category';
import MateriasList from './MateriasList';
import SideBarMenu from '../../components/SideBarMenu';
import useMenu from '../../hooks/useMenu';

const Materias = () => {
    const { isSideBarOpen, closeSideBar } = useMenu();

    const dispatch = useDispatch();
    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams, setSearchParams] = useSearchParams(defaultParam);

    const { list: listCategory, isLoading: isLoadingCategory/* , error: errorCategory */ } = useSelector((state) => state.category);
    const categories = Object.values(listCategory);

    const selectedCategories = useRef(searchParams.has("category") ? searchParams.getAll("category")[0].split(',').map(n => parseInt(n)) : []);

    const onCategorySelect = (id) => {
        selectedCategories.current.includes(id)
            ? selectedCategories.current = selectedCategories.current.filter((n) => n !== id)
            : selectedCategories.current.push(id);

        selectedCategories.current.length > 0 ? searchParams.set("category", selectedCategories.current.toString()) : searchParams.delete("category");
        setSearchParams(searchParams);
    }

    /* const onClearFilters = () => {
        selectedCategories.current = [];

        searchParams.has("category") && searchParams.delete("category");

        setSearchParams(searchParams);
    } */

    useEffect(() => {
        dispatch(fetchArticleCategories());
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
                                        Matérias
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='ui vertical section segment'>
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
                                <div className='ui filter header'>
                                    <HiOutlineBookOpen className='ui icon' />
                                    Categorias
                                </div>

                                <div className='ui stackable two column grid'>
                                    {
                                        categories.length > 0 ? categories.map(category => <div className='option column' key={`${category.name}${category.id}`}>
                                            <div className="inline field">
                                                {/* <div className="ui checkbox"> */}
                                                {/* <input type="checkbox" tabIndex="0" className="hidden" id={category.name} onChange={() => onCategorySelect(category.id)} /> */}
                                                <label htmlFor={category.name}><b>{category.name}</b></label>
                                                {category.categories?.length > 0 && category.categories.map(category => <div className='option column' key={`${category.name}${category.id}`}>
                                                    <div className="inline field">
                                                        <div className="ui checkbox">
                                                            <input type="checkbox" tabIndex="0" className="hidden" id={category.name} onChange={() => onCategorySelect(category.id)} checked={selectedCategories.current.includes(category.id)} />
                                                            <label htmlFor={category.name}>{category.name}</label>
                                                        </div>
                                                    </div>
                                                </div>)}
                                                {/* </div> */}
                                            </div>
                                        </div>) : !!isLoadingCategory
                                            ? <p>Carregando categorias...</p>
                                            : <p>Nenhuma categoria encontrada.</p>
                                    }
                                </div>

                            </div>
                        </div>

                        <div className='eleven wide tablet custom ten wide computer column'>
                            <div className="ui stackable grid">
                                <MateriasList searchParams={searchParams} />
                            </div>
                        </div>
                    </div>

                </div>

                <Footer />
            </div>
        </>
    );
}

export default Materias;
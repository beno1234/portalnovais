import 'semantic-ui-css/semantic.min.css';
import './index.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditorState, convertFromRaw } from 'draft-js';

import Publicidade from '../../components/Publicidade';
import Masthead from '../../components/Masthead';
import Footer from '../../components/Footer';
import { fetchArticle, incrementArticleView, fetchSimilarArticles } from '../../store/actions/article';
import useMenu from '../../hooks/useMenu';
import SideBarMenu from '../../components/SideBarMenu';
import RichTextEditor from '../admin/Articles/components/RichTextEditor';
import { isJsonString } from '../../utils';
import ArticleCard from '../../components/ArticleCard';
import { getFile } from '../../store/actions/file';

const Materia = () => {
    const [image, setImage] = useState('');
    const { isSideBarOpen, closeSideBar } = useMenu();

    const { id } = useParams();
    const dispatch = useDispatch();

    const article = useSelector((state) => state.article.list[id]);
    const articlesOfCategory = useSelector((state) => state.article.similarList);
    const similarArticles = Object.values(articlesOfCategory).filter(article => article.id !== parseInt(id));

    const publishDate = new Date(article?.publishedAt);
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Sao_Paulo' };
    const readableDate = publishDate.toLocaleDateString('pt-BR', dateOptions);

    const { isLoading, error } = useSelector((state) => state.article);

    const onFetchArticle = useCallback((id) => {
        dispatch(fetchArticle(id));
    }, [dispatch]);

    const onFetchSimilarArticles = useCallback((id) => {
        dispatch(fetchSimilarArticles(id));
    }, [dispatch]);

    const onFetchImage = useCallback(async (id) => {
        const response = await getFile(id);
        if (response) setImage(response);
    }, []);

    useEffect(() => {
        if (!article) {
            onFetchArticle(id);
        } else {
            // Anúncio existe, incrementa sua visualização
            article?.categoryId && onFetchSimilarArticles(article?.categoryId);
            article.image > 0 && onFetchImage(article.image);
            incrementArticleView(id);
        }
    }, [article, id, onFetchArticle, onFetchSimilarArticles, onFetchImage]);

    return (
        <>
            <SideBarMenu />
            <div onClick={isSideBarOpen ? closeSideBar : undefined}>
                <Masthead />

                <div className='ui vertical section segment'>
                    <div className='ui stackable centered grid'>

                        {isLoading && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Carregando cliente...</div>
                        </div>}
                        {!error
                            ? article &&
                            <>
                                <div className='ten wide column'>
                                    <div className='ui very padded segment'>
                                        <div className='ui basic clearing segment'>
                                            <div className='ui left floated materia header'>
                                                {article.title}
                                                <div className='ui sub header'>
                                                    Publicado em: {readableDate}
                                                </div>
                                            </div>

                                            <div className='ui right floated sub header'>
                                                <i className='eye icon'></i>{article.views}
                                            </div>
                                        </div>

                                        <div className='ui basic clearing segment'>
                                            <div style={{ backgroundColor: "#F9FAFB" }}>
                                                <img alt="Imagem" className="ui large centered image" src={image} />
                                            </div>

                                            <RichTextEditor
                                                editorState={
                                                    isJsonString(article?.description)
                                                        ? EditorState.createWithContent(convertFromRaw(JSON.parse(article?.description)))
                                                        : EditorState.createEmpty()}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>

                                    {
                                        similarArticles.length > 0 && <div className='ui container' style={{ marginTop: "3em" }}>
                                            <h2 className='ui header'>Matérias similares</h2>
                                            <div className="ui stackable centered grid">
                                                {similarArticles.map((article, index) => <div className="eight wide tablet five wide computer column" key={article.title + index}>
                                                    <ArticleCard data={article} />
                                                </div>)}
                                            </div>
                                        </div>
                                    }
                                </div>

                                <div className='two wide column'>
                                    <div className='ui container'>
                                        <div className="ui header">Publicidade</div>
                                        <Publicidade types={["featured", "miniBanner"]} limit={15} />
                                    </div>
                                </div>
                            </>
                            : <div className="ui error message">
                                <div className="header">Não foi possível carregar os dados da matéria.</div>
                                <p>
                                    A materia não foram carregada por <b>{error.message}</b>.<br />
                                    Por favor, tente novamente.
                                </p>
                                <button className='ui button' type="button" onClick={() => onFetchArticle(id)}>Carregar os dados</button>
                            </div>}

                    </div>
                </div>

                {/* <div className='ui container'>
                <div className='ui vertical small section segment'>
                    <div className="ui centered stackable grid container">
                        <div className='sixteen wide column'>
                            <h2 className='ui centered header'>Matérias relacionadas</h2>
                        </div>

                        {
                            materias.map((materia, index) => <div className="four wide column" key={`${materia.titulo + index}`}>
                                <Link to="/materia">
                                    <div className='ui link card'>
                                        <div className='image'>
                                            <img alt="Matéria" className="ui centered medium image" src="destaques/destaque1.png" />
                                        </div>
                                        <div className='content'>
                                            <div className='header'>{materia.titulo}</div>
                                            <div className='meta'>
                                                {materia.categoria}
                                                <span className='right floated'>{materia.data}</span>
                                            </div>
                                            <div className='description'>
                                                {materia.sumario}
                                            </div>
                                        </div>
                                        <div className='extra content'>
                                            <span>
                                                <i className="eye icon"></i>
                                                {materia.views}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>)
                        }

                    </div>
                </div>
            </div> */}

                <Footer />
            </div>
        </>
    );
}

export default Materia;
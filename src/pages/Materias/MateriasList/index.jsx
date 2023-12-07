import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '../../../components/admin/table/Pagination';
import ArticleCard from '../../../components/ArticleCard';
import { fetchArticles } from '../../../store/actions/article';

const MateriasList = ({ searchParams }) => {
    const dispatch = useDispatch();
    const { list, totalCount, indexOrder, isLoading } = useSelector((state) => state.article);
    // Coloca os anúncios na ordem correta
    const articles = indexOrder.map((index) => list[index]);

    const onFetchAdvertisements = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchArticles(params));
    }, [dispatch, searchParams])

    useEffect(() => {
        onFetchAdvertisements();
    }, [onFetchAdvertisements]);

    return <>
        {
            articles.length > 0
                ? <>
                    <div className="sixteen wide column">
                        <div className="ui header">{articles.length} Matéria(s)</div>
                    </div>
                    {
                        articles.map((article, index) => <div className="eight wide tablet five wide computer column" key={article.title + index}>
                            <ArticleCard data={article} />
                        </div>)
                    }
                </>
                : isLoading
                    ? <div className="ui active inverted dimmer">
                        <div className="ui text loader">Carregando matérias...</div>
                    </div>
                    : <div className="sixteen wide column">
                        <div className="ui warning message">Nenhuma matéria encontrada.</div>
                    </div>
        }
        <div className='sixteen wide center aligned column'>
            <Pagination totalCount={totalCount} />
        </div>
    </>
}

export default MateriasList;
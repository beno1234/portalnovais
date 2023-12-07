import React from 'react';
import { useSearchParams } from 'react-router-dom';

import usePageSelection from '../../../hooks/usePageSelection';

const Pagination = ({ totalCount }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let { selectedItemsPerPage, selectedPage } = usePageSelection();

    // Helper functions para alteração dos filtros de página
    const onPageSelect = (pageNumber) => {
        searchParams.set("page", pageNumber);
        setSearchParams(searchParams);
    }

    const numPages = Math.ceil(totalCount / selectedItemsPerPage);

    if (numPages === 0) {
        return null;
    }

    // A página selecionada deve estar dentro do número de páginas existentes
    if (selectedPage < 0 || selectedPage > numPages) {
        return <div className="ui warning message">
            <div className="header">
                Página {selectedPage} não existe.
            </div>
            <p>Você pode visitar a página 1 até a página {numPages}.</p>
            <button className='ui button' type="button" onClick={() => onPageSelect(1)}>Ir para a primeira página</button>
            <button className='ui button' type="button" onClick={() => onPageSelect(numPages)}>Ir para a última página</button>
        </div>
    }

    // pageNumbers vai ter:
    // 1. A primeira página da lista
    // 2. A página selecionada
    // 3. 4 páginas anteriores à página selecionada
    // 4. 4 páginas posteriores à página selecionada
    // 5. A última página da lista

    // 2. A página selecionada
    const pageNumbers = [selectedPage];

    // 3 e 4. 4 páginas anteriores e posteriores:
    for (let i = 1; i <= 3; i++) {
        const prevPage = selectedPage - i;
        const nextPage = selectedPage + i;

        // Exclue a possibilidade de ter páginas com número negativo
        // e se a página já estiver no array
        if (prevPage > 0 && !pageNumbers.includes(prevPage)) {
            // Adiciona a página anterior no começo do array
            pageNumbers.unshift(prevPage);
        }

        // Exclue páginas com número maior que o número de páginas existente
        // e se a página já estiver no array
        if (nextPage <= numPages && !pageNumbers.includes(nextPage)) {
            // Adiciona a próxima página no final do array
            pageNumbers.push(nextPage);
        }
    }

    // Adiciona a primeira página, se já não existir
    // Se não existe, é porque a primeira página está longe,
    // adiciona mais um elemento (-1) representando o "..."
    if (!pageNumbers.includes(1)) {
        // Se não tem a segunda página, há necessidade do "..."
        if (!pageNumbers.includes(2)) {
            pageNumbers.unshift(-1)
        }
        pageNumbers.unshift(1)
    }

    // Adiciona a última página, se já não existir
    // Se não existe, é porque a última página está longe, adiciona -1
    if (!pageNumbers.includes(numPages)) {
        // Se não tem a penúltima página, há necessidade do "..."
        if (!pageNumbers.includes(numPages - 1)) {
            pageNumbers.push(-1)
        }
        pageNumbers.push(numPages)
    }

    // Anteriormente totalCount > itemsPerPage && ...

    // Renderiza a seleção de páginas:
    // 1. Renderiza a seta para página anterior, se for necessária.
    // 2. Renderiza as opções, incluindo os marcadores de mais páginas (...), a página selecionada,
    //      páginas anteriores e páginas posteriores.
    // 3. Renderiza a seta para página posterior, se for necessária.

    return <div className="ui borderless pagination menu">
        {// 1
            selectedPage !== 1 && <div className="icon item link" onClick={() => onPageSelect(selectedPage - 1)}>
                <i className="left chevron icon"></i>
            </div>}

        {// 2
            pageNumbers.map((numPage, i) => {
                if (numPage === -1) {
                    return <div key={`pagenumber${numPage}_${i}`} className="icon item disabled">
                        <i className="ellipsis horizontal icon"></i>
                    </div>
                }
                if (numPage === selectedPage) {
                    return <div key={`pagenumber${numPage}`} className={`item active`}>{numPage}</div>
                } else {
                    return <div key={`pagenumber${numPage}`} className="item link" onClick={() => onPageSelect(numPage)}>{numPage}</div>
                }
            })}

        {// 3
            selectedPage !== numPages && <div className="icon item link" onClick={() => onPageSelect(selectedPage + 1)}>
                <i className="right chevron icon"></i>
            </div>}
    </div>;
}

export default Pagination;
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import usePageSelection from '../../../hooks/usePageSelection';

const ItemsPerPage = ({ totalCount }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let {
        selectedItemsPerPage,
        selectedPage,
        itemsPerPageOptions
    } = usePageSelection();

    const onItemsPerPageChange = (e, data) => {
        searchParams.set("limit", data.value);
        searchParams.set("page", 1);
        setSearchParams(searchParams);
    }

    // Para mostrar quantos registros estão sendo visualizados na página
    const firstItemOnPageNum = ((selectedPage - 1) * selectedItemsPerPage) + 1;
    const lastItemOnPageNum = selectedPage * selectedItemsPerPage > totalCount ? totalCount : selectedPage * selectedItemsPerPage;

    return <>
        Itens por página{' '}
        <Dropdown
            inline
            onChange={onItemsPerPageChange}
            options={itemsPerPageOptions}
            defaultValue={selectedItemsPerPage}
        />
        <span style={{ marginLeft: '1em' }}>
            {totalCount > 0 && <>
                {firstItemOnPageNum}-{lastItemOnPageNum} de {totalCount}
            </>}
        </span>
    </>;
}

export default ItemsPerPage;
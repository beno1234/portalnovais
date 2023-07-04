import { useSearchParams } from 'react-router-dom';

const usePageSelection = () => {
    const itemsPerPageOptions = [
        {
            key: '10items',
            text: '10',
            value: '10'
        },
        {
            key: '25items',
            text: '25',
            value: '25'
        },
        {
            key: '50items',
            text: '50',
            value: '50'
        },
        {
            key: '100items',
            text: '100',
            value: '100'
        },
    ];


    const [searchParams] = useSearchParams();

    let selectedItemsPerPage = itemsPerPageOptions[0].value;

    if (searchParams.has("limit") && !isNaN(searchParams.get("limit")) && parseInt(searchParams.get("limit")) >= 1) {
        const limit = searchParams.get("limit");
        const existOption = itemsPerPageOptions.find((option) => option.value === limit);

        if (existOption) {
            selectedItemsPerPage = existOption.value;
        } else {
            itemsPerPageOptions.unshift({
                key: `${limit}items`,
                text: limit,
                value: limit
            });

            selectedItemsPerPage = limit;
        }
    }

    // Padrão, caso não esteja especificado na URL
    // Tanto Limit quanto Page devem ser números e maiores ou iguais à 1. Caso contrário assumem o valor padrão.
    const selectedPage = (searchParams.has("page") && !isNaN(searchParams.get("page")) && parseInt(searchParams.get("page")) >= 1)
        ? parseInt(searchParams.get("page")) : 1;

    return { selectedItemsPerPage, selectedPage, itemsPerPageOptions };
}

export default usePageSelection;
import React from 'react';
/* import { useSearchParams } from 'react-router-dom'; */

const Table = ({ items, fields, renderCustomActions, tableKey }) => {

    /* const [searchParams, setSearchParams] = useSearchParams(); */

    // Altera params de ORDER BY
    /* const onHeaderClick = (fieldValue) => {
        // Se clicar em outra ordenação, apenas troca o sort
        // Se clicar na mesma ordenação, agora ordena em ordem decrescente
        if (searchParams.get("sort") === fieldValue) {
            searchParams.set("order", searchParams.get("order") === "desc" ? "asc" : "desc");
        } else {
            // Poderia também .delete("order"), caso o backend faça ASC por padrão
            searchParams.set("order", "asc");
        }

        // Volta para a primeira página para evitar confusão
        searchParams.set("page", 1);
        searchParams.set("sort", fieldValue);
        setSearchParams(searchParams);
    } */

    const renderFilterHeaders = () => {
        return fields.map((field, i) =>
            <th key={i} className='center aligned' /* onClick={() => onHeaderClick(field.property)} */>
                {field.label}
                {/* field.property === searchParams.get("sort") ? <i className={`angle ${searchParams.get("order") === "asc" ? 'down' : 'up'} icon`} /> : null */}
            </th>
        );
    };

    //sortable table
    return (
        <div className='overflow'>
            <table className="ui striped padded table">
                <thead>
                    <tr>
                        {renderFilterHeaders()}
                        {(renderCustomActions) && <th className='center aligned'>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {items?.length > 0
                        ? items.map((item) => (
                            <tr key={`${item.id}${tableKey}`}>
                                {fields.map((field) => {
                                    return <td key={`${item.id}${field.property}`} className='single line center aligned'>
                                        <span className={field.classes}>
                                            {field.type !== "boolean"
                                                ? item[field.property]
                                                : <i className={`${item[field.property] ? "green" : "red"} circle icon`}></i>}
                                        </span>
                                    </td>
                                })}
                                {(renderCustomActions) && <td className='single line center aligned'>
                                    {renderCustomActions && renderCustomActions(item)}
                                </td>}
                            </tr>
                        ))
                        : <tr><td colSpan={fields.length + 1}>Não há nenhum registro.</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
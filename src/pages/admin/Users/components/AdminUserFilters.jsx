import React from 'react';
import { Field } from 'react-final-form';

import Filters from '../../../../components/admin/Filters';
import Condition from '../../../../components/form/Condition';
import Input from '../../../../components/form/Input';

const AdminUserFilters = () => {

    const filterFields = [
        {
            label: "Nome ou e-mail",
            property: "search"
        }/* ,
        {
            label: "Status",
            property: "active"
        }, */
    ]

    // Ativo ou DESATIVADO
    /* const statusOptions = [
        { key: 'active', value: "true", text: 'Ativo' },
        { key: 'notActive', value: "false", text: 'Desativado' },
    ]; */

    return (
        <Filters fields={filterFields}>
            <Condition when="filter" is="search">
                <Field
                    name="input"
                    component={Input}
                    type="text"
                    placeholder="Insira um nome"
                    label="Pesquisar"
                    classes="fourteen wide"
                />
            </Condition>
            {/* <Condition when="filter" is="active">
                <Field
                    name="input"
                    component={Select}
                    placeholder="Escolha uma opção"
                    options={statusOptions}
                    label="Pesquisar"
                    classes="fourteen wide"
                />
            </Condition> */}
        </Filters>
    );
}

export default AdminUserFilters;
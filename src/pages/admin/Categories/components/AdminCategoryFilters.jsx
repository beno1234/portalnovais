import React from 'react';
import { Field } from 'react-final-form';

import Filters from '../../../../components/admin/Filters';
import Condition from '../../../../components/form/Condition';
import Input from '../../../../components/form/Input';

const AdminCategoryFilters = () => {

    const filterFields = [
        {
            label: "Nome",
            property: "search"
        }
    ]

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
        </Filters>
    );
}

export default AdminCategoryFilters;
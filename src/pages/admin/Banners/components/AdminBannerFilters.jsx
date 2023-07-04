import React from 'react';
import { Field } from 'react-final-form';

import Filters from '../../../../components/admin/Filters';
import Condition from '../../../../components/form/Condition';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';

const AdminBannerFilters = () => {
    /* const dispatch = useDispatch(); */

    /* const { list, isLoading, error } = useSelector((state) => state.category);
    const cagetories = Object.values(list); */

    const filterFields = [
        {
            label: "Nome da empresa",
            property: "search"
        },
        {
            label: "Status",
            property: "status"
        }
    ]

    /* const categoryOptions = formatOptions(cagetories, "titulo"); */

    const statusOptions = [
        { key: 'posted', value: 'posted', text: 'Ativo' },
        { key: 'blocked', value: 'blocked', text: 'Bloqueado' },
        { key: 'review', value: 'review', text: 'Em análise' },
    ];

    /* useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]); */

    return (
        <Filters fields={filterFields}>
            {/* <Condition when="filter" is="category">
                <Field
                    name="input"
                    component={Select}
                    placeholder="Escolha uma opção"
                    options={categoryOptions}
                    label="Pesquisar"
                    classes="fourteen wide"
                    loading={isLoading}
                    error={error ? true : false}
                />
            </Condition> */}
            <Condition when="filter" is="search">
                <Field
                    name="input"
                    component={Input}
                    placeholder="Procure pelo nome"
                    options={statusOptions}
                    label="Pesquisar"
                    classes="fourteen wide"
                />
            </Condition>
            <Condition when="filter" is="status">
                <Field
                    name="input"
                    component={Select}
                    placeholder="Escolha uma opção"
                    options={statusOptions}
                    label="Pesquisar"
                    classes="fourteen wide"
                />
            </Condition>
        </Filters>
    );
}

export default AdminBannerFilters;
import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import formatString from 'format-string-by-pattern';

/* import { FIELDS } from '../../config';
// Components
import Table from '../../../../components/admin/table/Table'; */
import Pagination from '../../../../components/admin/table/Pagination';
import AdminDeleteUserModal from '../components/AdminDeleteUserModal';
import AdminUserFilters from '../components/AdminUserFilters';
import ItemsPerPage from '../../../../components/admin/table/ItemsPerPage';
// Hooks
import useModal from '../../../../hooks/useModal';
// Actions
import { fetchUsers } from '../../../../store/actions/user';

const UserList = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const defaultParam = new URLSearchParams("page=1&limit=10");
    const [searchParams] = useSearchParams(defaultParam);

    const { list, indexOrder, totalCount, isLoading, error } = useSelector((state) => state.user);
    // Coloca os users na ordem correta
    const users = indexOrder.map((index) => list[index]);

    // Table
    const { setSelectedItem, isModalOpen, openModal } = useModal();

    const onOpenModal = (item) => {
        setSelectedItem(item)
        openModal();
    }

    const actions = (item) => {
        return <>
            <Link to={`${item.id}/edit/`} state={{ from: location }} className='ui yellow icon button'>
                <i className='edit icon'></i>
            </Link>
            <button className="ui negative icon button" onClick={() => onOpenModal(item)}>
                <i className='trash alternate icon'></i>
            </button>
        </>
    }

    const formatDate = (date) => {
        if (!date) return null;
        const publishDate = new Date(date);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Sao_Paulo' };
        return publishDate.toLocaleDateString('pt-BR', dateOptions);
    }

    const formatRole = (value) => {
        switch (value) {
            case "engaged":
                return "Noivo(a)";
            case "advertiser":
                return "Anunciante";
            case "admin":
                return "Administrador(a)";
            case "internal":
                return "Interno(a)";
            case "editor":
                return "Editor(a)";
            default:
                return null;
        }
    }

    const onFetchUsers = useCallback(() => {
        // Pegando os parâmetros
        const params = searchParams.toString();

        dispatch(fetchUsers(params));
    }, [dispatch, searchParams])

    const onSync = () => {
        onFetchUsers();
    }

    useEffect(() => {
        onFetchUsers();
    }, [onFetchUsers]);

    return (
        <>
            <AdminDeleteUserModal />

            <h2 className="ui header">Listagem de usuários do sistema</h2>

            <div className='section'>
                <div className='ui bottom aligned stackable grid'>
                    <div className="sixteen wide column">
                        <Link to="create" state={{ from: location }} className='ui positive button'>
                            <i className='plus icon' />
                            CRIAR USUÁRIO
                        </Link>
                    </div>

                    <div className='left floated left aligned eight wide column'>
                        <AdminUserFilters />
                    </div>

                    <div className='right floated right aligned eight wide column'>
                        <div className='ui right aligned basic clearing segment no-padding'>
                            <ItemsPerPage totalCount={totalCount} />
                            <button className='ui black icon button refresh' type="button" onClick={onSync}>
                                <i className='sync icon' />
                            </button>
                        </div>
                    </div>

                    <div className='sixteen wide column'>
                        {(isLoading && !isModalOpen) && <div className="ui active inverted dimmer">
                            <div className="ui text loader">Carregando usuários</div>
                        </div>}
                        {(error && !isModalOpen) ? <div className="ui error message">
                            <div className="header">Não foi possível carregar os usuários.</div>
                            <p>
                                A lista de usuários não foi carregada por <b>{error.message}</b>.<br />
                                Por favor, tente carregar os dados novamente.
                            </p>
                            <button className='ui button' type="button" onClick={onSync}>Carregar os dados</button>
                        </div> : <div className='overflow'>
                            <table className="ui striped padded table">
                                <thead>
                                    <tr>
                                        <th className='center aligned'>Nome</th>
                                        <th className='center aligned'>CPF ou CNPJ</th>
                                        <th className='center aligned'>E-mail</th>
                                        <th className='center aligned'>Telefone</th>
                                        <th className='center aligned'>Data de Criação</th>
                                        <th className='center aligned'>Função</th>
                                        <th className='center aligned'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.length > 0
                                        ? users.map((item) => (
                                            <tr key={`banner${item.id}`}>
                                                <td className='single line center aligned'><b>{item.name}</b></td>
                                                <td className='single line center aligned'>{formatString(item.role === "advertiser" ? 'XX.XXX.XXX/XXXX-XX' : 'XXX.XXX.XXX-XX', item.document)}</td>
                                                <td className='single line center aligned'>{item.email}</td>
                                                <td className='single line center aligned'>{item.phone}</td>
                                                <td className='single line center aligned'>{item.createdAt && formatDate(item.createdAt)}</td>
                                                <td className='single line center aligned'>{formatRole(item.role)}</td>
                                                <td className='single line center aligned'>{actions(item)}</td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={7}>Não há nenhum registro.</td></tr>}
                                </tbody>
                            </table>
                        </div>}
                    </div>

                    <div className='sixteen wide center aligned column'>
                        <Pagination totalCount={totalCount} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserList;
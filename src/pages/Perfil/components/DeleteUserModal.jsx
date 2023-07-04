import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../hooks/useModal';
import { disableMe, setError } from '../../../store/actions/auth';

const DeleteUserModal = () => {
    const dispatch = useDispatch();
    const { isModalOpen, closeModal } = useModal();
    const { user, isLoading, error } = useSelector((state) => state.auth);

    const onDelete = async () => {
        const success = await dispatch(disableMe(user.id));
        if (success) closeModal();
    }

    const onCloseModal = () => {
        // Permite que feche o modal apenas se nenhuma operação estiver em andamento
        if (!isLoading) {
            if (error) dispatch(setError(null));
            closeModal();
        }
    }

    return <Modal
        open={isModalOpen}
        onClose={onCloseModal}
    >
        <Modal.Header>Deseja realmente deletar sua conta?</Modal.Header>
        <Modal.Content>
            {(isLoading) && <div className="ui active dimmer">
                <div className="ui text loader">Deletando conta...</div>
            </div>}

            <p>Você está prestes a deletar sua conta.</p>

            {error && <div className="ui error message">
                <div className="header">Não foi possível deletar a conta.</div>
                <p>
                    A conta não foi deletada.<br />
                    Por favor, tente novamente.
                </p>
            </div>}
        </Modal.Content>
        <Modal.Actions>
            <Button secondary onClick={onCloseModal}>
                CANCELAR
            </Button>
            <Button negative disabled={!!isLoading} onClick={onDelete}>
                DELETAR
            </Button>
        </Modal.Actions>

    </Modal>;
}

export default DeleteUserModal;
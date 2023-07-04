import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../../hooks/useModal';
import { disableLocation, setError } from '../../../../store/actions/location';

const AdminDeleteLocationModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, setSelectedItem, isModalOpen, closeModal } = useModal();
    const { isLoading, error } = useSelector((state) => state.location);

    const onDelete = async () => {
        const success = await dispatch(disableLocation(selectedItem.id));
        if (success) closeModal();
    }

    const onCloseModal = () => {
        // Permite que feche o modal apenas se nenhuma operação estiver em andamento
        if (!isLoading) {
            if (error) dispatch(setError(null));
            setSelectedItem(null);
            closeModal();
        }
    }

    return <Modal
        open={isModalOpen}
        onClose={onCloseModal}
    >
        {selectedItem
            ? <>
                <Modal.Header>Deseja realmente deletar a localização?</Modal.Header>
                <Modal.Content>
                    {isLoading && <div className="ui active dimmer">
                        <div className="ui text loader">Desabilitando localização...</div>
                    </div>}

                    <p>Você está prestes a desabilitar a localização:</p>
                    <div className="ui center aligned raised segment">
                        <h3>{selectedItem.name}</h3>
                    </div>

                    {error && <div className="ui error message">
                        <div className="header">Não foi possível desabilitar a localização.</div>
                        <p>
                            A localização não foi deletada por <b>{error.message}</b>.<br />
                            Por favor, tente novamente.
                        </p>
                    </div>}
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={onCloseModal}>
                        CANCELAR
                    </Button>
                    <Button negative disabled={isLoading} onClick={onDelete}>
                        DELETAR
                    </Button>
                </Modal.Actions>
            </>
            : <>
                <Modal.Header>A localização selecionada não existe.</Modal.Header>
                <Modal.Content>
                    Selecione uma localização existente para ser deletada.
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={onCloseModal}>
                        CANCELAR
                    </Button>
                </Modal.Actions>
            </>
        }

    </Modal>;
}

export default AdminDeleteLocationModal;
import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../../hooks/useModal';
import { disableAdvertisement, setError } from '../../../../store/actions/advertisement';

const AdminDeleteAdvertisementModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, setSelectedItem, isModalOpen, closeModal } = useModal();
    const { isLoading, error } = useSelector((state) => state.advertisement);

    const onDelete = async () => {
        const success = await dispatch(disableAdvertisement(selectedItem.id));
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
                <Modal.Header>Deseja realmente deletar o anúncio?</Modal.Header>
                <Modal.Content>
                    {isLoading && <div className="ui active dimmer">
                        <div className="ui text loader">Desabilitando anúncio...</div>
                    </div>}

                    <p>Você está prestes a desabilitar o anúncio:</p>
                    <div className="ui center aligned raised segment">
                        <h3>{selectedItem.name}</h3>
                    </div>

                    {error && <div className="ui error message">
                        <div className="header">Não foi possível desabilitar o anúncio.</div>
                        <p>
                            O anúncio não foi deletado por <b>{error.message}</b>.<br />
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
                <Modal.Header>O anúncio selecionado não existe.</Modal.Header>
                <Modal.Content>
                    Selecione um anúncio existente para ser deletado.
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

export default AdminDeleteAdvertisementModal;
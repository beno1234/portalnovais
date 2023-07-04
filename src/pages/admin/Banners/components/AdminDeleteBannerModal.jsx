import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../../hooks/useModal';
import { disableBanner, setError } from '../../../../store/actions/banner';

const AdminDeleteBannerModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, setSelectedItem, isModalOpen, closeModal } = useModal();
    const { isLoading, error } = useSelector((state) => state.banner);

    const onDelete = async () => {
        const success = await dispatch(disableBanner(selectedItem.id));
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
                <Modal.Header>Deseja realmente deletar o banner?</Modal.Header>
                <Modal.Content>
                    {isLoading && <div className="ui active dimmer">
                        <div className="ui text loader">Desabilitando banner...</div>
                    </div>}

                    <p>Você está prestes a desabilitar o banner:</p>
                    <div className="ui center aligned raised segment">
                        <h3>{selectedItem.name}</h3>
                    </div>

                    {error && <div className="ui error message">
                        <div className="header">Não foi possível desabilitar o banner.</div>
                        <p>
                            O banner não foi deletado por <b>{error.message}</b>.<br />
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
                <Modal.Header>O banner selecionado não existe.</Modal.Header>
                <Modal.Content>
                    Selecione um banner existente para ser deletado.
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

export default AdminDeleteBannerModal;
import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../../hooks/useModal';
import { disableCategory, setError } from '../../../../store/actions/category';

const AdminDeleteCategoryModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, setSelectedItem, isModalOpen, closeModal } = useModal();
    const { isLoading, error } = useSelector((state) => state.category);

    const onDelete = async () => {
        const success = await dispatch(disableCategory(selectedItem.id));
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
                <Modal.Header>Deseja realmente deletar a categoria?</Modal.Header>
                <Modal.Content>
                    {isLoading && <div className="ui active dimmer">
                        <div className="ui text loader">Desabilitando categoria...</div>
                    </div>}

                    <p>Você está prestes a desabilitar a categoria:</p>
                    <div className="ui center aligned raised segment">
                        <h3>{selectedItem.name}</h3>
                    </div>

                    {error && <div className="ui error message">
                        <div className="header">Não foi possível desabilitar a categoria.</div>
                        <p>
                            A categoria não foi deletada por <b>{error.message}</b>.<br />
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
                <Modal.Header>A categoria selecionada não existe.</Modal.Header>
                <Modal.Content>
                    Selecione uma categoria existente para ser deletada.
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

export default AdminDeleteCategoryModal;
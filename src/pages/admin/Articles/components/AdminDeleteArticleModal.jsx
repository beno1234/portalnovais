import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import useModal from '../../../../hooks/useModal';
import { disableArticle, setError } from '../../../../store/actions/article';

const AdminDeleteArticleModal = () => {
    const dispatch = useDispatch();
    const { selectedItem, setSelectedItem, isModalOpen, closeModal } = useModal();
    const { isLoading, error } = useSelector((state) => state.article);

    const onDelete = async () => {
        const success = await dispatch(disableArticle(selectedItem.id));
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
                <Modal.Header>Deseja realmente deletar a matéria?</Modal.Header>
                <Modal.Content>
                    {isLoading && <div className="ui active dimmer">
                        <div className="ui text loader">Desabilitando matéria...</div>
                    </div>}

                    <p>Você está prestes a desabilitar a matéria:</p>
                    <div className="ui center aligned raised segment">
                        <h3>{selectedItem.title}</h3>
                    </div>

                    {error && <div className="ui error message">
                        <div className="header">Não foi possível desabilitar a matéria.</div>
                        <p>
                            A matéria não foi deletada por <b>{error.message}</b>.<br />
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
                <Modal.Header>A matéria selecionada não existe.</Modal.Header>
                <Modal.Content>
                    Selecione uma matéria existente para ser deletada.
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

export default AdminDeleteArticleModal;
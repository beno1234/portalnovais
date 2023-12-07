import { useDispatch, useSelector } from 'react-redux';

// Action Creators
import { openModal as openModalAction, closeModal as closeModalAction, setSelectedItem as setSelectedItemAction } from '../store/actions/modal';

const useModal = () => {
    const isModalOpen = useSelector((state) => state.modal.isOpen);
    const selectedItem = useSelector((state) => state.modal.selectedItem);

    const dispatch = useDispatch();

    const openModal = () => {
        dispatch(openModalAction());
    }

    const closeModal = () => {
        dispatch(closeModalAction());
    }

    const setSelectedItem = (item) => {
        dispatch(setSelectedItemAction(item));
    }

    return {
        selectedItem,
        setSelectedItem,
        isModalOpen,
        openModal,
        closeModal
    };
}

export default useModal;
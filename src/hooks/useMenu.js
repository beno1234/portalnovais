import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Action Creators
import { closeMenu } from '../store/actions/menu';

const useMenu = () => {
    const isSideBarOpen = useSelector((state) => state.menu.isSideBarOpen);
    const dispatch = useDispatch();

    const closeSideBar = useCallback(() => {
        dispatch(closeMenu());
    }, [dispatch]);

    return {
        isSideBarOpen,
        closeSideBar
    };
}

export default useMenu;
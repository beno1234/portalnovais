import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children, role }) => {
    const { isSignedIn, user } = useSelector((state) => state.auth);
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!isSignedIn) {
        if (token) {
            return <div className="ui active inverted dimmer">
                <div className="ui text loader">Carregando suas informações...</div>
            </div>
        } else {
            return <Navigate to="/login" state={{ from: location }} replace />
        }
    }

    if (role !== "all" && !role.includes(user.role)) return <Navigate to="/" replace />

    return children;
}

export default RequireAuth;
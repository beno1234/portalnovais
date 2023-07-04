import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ toPage, children }) => {
    return (
        <Link to={toPage} className='item' >
            {children}
            {
                // Se tem notificação:
                // <div className="ui red left pointing label">1</div>
            }
        </Link>
    );
}

export default MenuItem;
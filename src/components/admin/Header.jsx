import React from 'react';

const Header = ({ title, subHeader }) => {
    return (
        <div className="ui masthead vertical segment">
            <div className="ui container">
                <h1 className="ui header">
                    {title}
                    <div className="sub header">
                        {subHeader}
                    </div>
                </h1>
            </div>
        </div>
    );
}

export default Header;
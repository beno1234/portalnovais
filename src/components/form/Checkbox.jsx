import React from 'react';

const Checkbox = ({ input, label, classes, meta, disabled, id }) => {
    const className = `${classes} field ${meta.error && meta.touched ? "error" : ""}`;

    return <div className={className}>
        <div className='ui checkbox'>
            <input {...input}
                id={id}
                disabled={disabled}
                type="checkbox"
                tabIndex="0"
                className="hidden" />
            <label htmlFor={id}>{label}</label>
            {(meta.error && meta.touched) && <div className='error label'>
                {meta.error}
            </div>}
        </div>
    </div>
};

export default Checkbox;
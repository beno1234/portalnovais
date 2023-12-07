import React from 'react';

const Input = ({ input, label, classes, placeholder, icon, meta, disabled, alwaysValidate }) => {
    const touched = alwaysValidate ? true : meta.touched;
    const className = `${classes} field ${meta.error && touched ? "error" : ""}`;

    const renderInput = <input {...input}
        placeholder={meta.error && touched ? meta.error : placeholder}
        autoComplete="off"
        disabled={disabled}
        value={input.value || ''} />

    return (
        <div className={className}>
            {icon
                ? <>
                    <div className="ui left icon input">
                        <i className={`${icon} icon`}></i>
                        {renderInput}
                    </div>
                    {(meta.error && touched) && <div className='error label'>
                        {meta.error}
                    </div>}
                </>
                : <>
                    <label>{label}</label>
                    {renderInput}
                    {(meta.error && touched) && <div className='error label'>
                        {meta.error}
                    </div>}
                </>
            }
        </div>
    );
};

export default Input;
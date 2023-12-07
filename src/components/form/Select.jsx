import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const Select = ({ input, label, classes, placeholder, meta, options, loading, disabled, isMultiple }) => {
    const className = `${classes} field ${meta.error && meta.touched ? "error" : ""}`;

    return (
        <div className={className}>
            {label && <label>{label}</label>}
            <Dropdown
                {...input}
                selection
                onChange={(e, data) => {
                    return input.onChange(data.value);
                }}
                placeholder={meta.error && meta.touched ? meta.error : placeholder}
                options={options}
                style={{ width: "100%" }}
                loading={loading}
                disabled={disabled}
                multiple={isMultiple}
            />
            {isMultiple && <span style={{ fontSize: "0.85em" }}>Obs.: Você pode selecionar mais de um(a)</span>}
            {(meta.error && meta.touched) && <div className='error label'>
                {meta.error}
            </div>}
        </div>
    );
};

export default Select;
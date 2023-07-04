import React from 'react';

const Radio = ({ input, label, form }) => {
    const inputProps = {
        ...input,
        onChange: (e) => { // Sempre que o filtro for alterado...
            input.onChange(e);
            // Para evitar dados inválidos
            form.change('input', undefined); // ...o campo de texto reseta
        }
    };

    return (
        <div className="field">
            <div className="ui radio checkbox">
                <input {...inputProps} tabIndex="0" />
                <label>{label}</label>
            </div>
        </div>
    );
};

export default Radio;
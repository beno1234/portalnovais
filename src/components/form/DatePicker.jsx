import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isValid, toDate } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR'

const DatePickerField = ({ input, label, classes, placeholder, icon, meta, disabled, name, minDate, maxDate, showTimeSelect, timeFormat, timeIntervals, dateFormat, timeCaption, showYearDropdown }) => {
    registerLocale("ptBR", ptBR);
    const className = `${classes} field ${meta.error && meta.touched ? "error" : ""}`;

    const renderInput = <DatePicker {...input}
        locale="ptBR"
        placeholderText={placeholder}
        selected={input.value && isValid(input.value) ? toDate(input.value) : null}
        disabled={disabled}
        name={name}
        onChange={(date) => {
            if (isValid(date)) {
                input.onChange(new Date(date));
            } else {
                input.onChange(null);
            }
        }}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        dateFormat={dateFormat}
        timeCaption={timeCaption}
        minDate={minDate}
        maxDate={maxDate}
        showMonthDropdown={showYearDropdown}
        showYearDropdown={showYearDropdown}
        dropdownMode="select"
    />

    return (
        <div className={className}>
            {icon
                ? <>
                    <div className="ui left icon input">
                        <i className={`${icon} icon`}></i>
                        {renderInput}
                    </div>
                    {(meta.error && meta.touched) && <div className='error label'>
                        {meta.error}
                    </div>}
                </>
                : <>
                    <label>{label}</label>
                    {renderInput}
                    {(meta.error && meta.touched) && <div className='error label'>
                        {meta.error}
                    </div>}
                </>
            }
        </div>
    );
};

export default DatePickerField;
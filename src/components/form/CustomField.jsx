import React from "react";
import { Field } from "react-final-form";

class MyFieldAdapter extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.meta.active && this.props.onChange) {
            this.props.onChange(this.props.input.value, prevProps.input.value);
        }
    }

    render() {
        return this.props.children;
    }
}

// Wrap the ExternalModificationDetector in a Field
const CustomField = ({ name, onChange, ...rest }) => (
    <Field
        name={name}
        subscription={{ value: true, active: true }}
        render={props => (
            <MyFieldAdapter {...props} onChange={onChange}>
                <Field name={name} {...rest} />
            </MyFieldAdapter>
        )}
    />
);

export default CustomField;
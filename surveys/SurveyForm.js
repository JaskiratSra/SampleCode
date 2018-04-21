// SurveyForm shows a form for a user to add input
import _ from 'lodash'; // For iteration
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'; // Field Any html element to collect info for rendering text inputs, checkbox
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      // arrow function called each object in array
      return (
        <Field
          key={name} // conisistent between renders
          component={SurveyField} //custom react component instead od input type
          type="text" // input type of text
          label={label}
          name={name} // extract value stored under this key
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          // function called on submit // Prorovided by redux helper
          {this.renderFields()}
          <Link to="/surveys" className=" red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}
function validate(values) {
  // contains all values from field.
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');
  // provide an empty string if no email provided
  // not using map because wr are not retriving a list but modifying
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}
export default reduxForm({
  validate, // automatically ran to validate inputs
  form: 'surveyForm', // Redux form helper
  destroyOnUnmount: false // Persist form values
})(SurveyForm);

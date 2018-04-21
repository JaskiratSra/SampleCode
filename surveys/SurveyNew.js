//SurveyNew shows SurveyForm and SurveyFormReview
// Transition logic between Survey Form and SurveyForm review
// Survey form contains survey fields

import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';
class SurveyNew extends Component {
  state = { showFormReview: false }; // Using component level state

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })} // callback for switching state
        />
      );
    }

    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: 'surveyForm' // by default destroyOnUnmount is true
})(SurveyNew);

// SurveyFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux'; // to pull out data from redux store

import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

//receiving all as props
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div> // Accesing alue under name propertyy
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm ypur entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-falt"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)} //Call action creator with form values
        // Aroow function to delay submit //History object used around for navigation
        className="green btn-flat right white-text"
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  // to grab values of surveyform from redux store
  //Values received as props
  //form values contains all values
  return { formValues: state.form.surveyForm.values };
}
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));

//withrouter to have some reactrouterlogic no we can use history object

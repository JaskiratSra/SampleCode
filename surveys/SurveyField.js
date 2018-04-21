// SurveyField contains logic to render a single lablel and text input
// Fields are collecting value from user that surveyformreview and survey form need
//to know about

//Rendered by field tag

import React from 'react';
// meta error msg contianed in meta
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error} // if touched true and error exists then show error
        // form fisrt rendered always contains error
      </div>
    </div>
  );
};

// typing calls action creator updates state in redux store
// surveyform review can use connect to pull data out of redux.
// redux form does all automatically. has helpers for entire process.

// redux form automatically looks for onblur onchange etc
// all properties available through input
// .. input to access al props not a specific property

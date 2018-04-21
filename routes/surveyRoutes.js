const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url'); // helpers for parsing urls
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice'); // for extracting survey id and choice

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname); // execute p over extracted path from url
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        } // either null if p.test fails or contains the match
      })
      .compact() // takes array and removes undefined objects
      .uniqBy('email', 'surveyId') // remove duplicates cant have multiple votes on same survey
      .each(({ surveyId, email, choice }) => {
        // execute query for each list of evets calculated
        Survey.updateOne(
          // Find and update
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 }, // mongo opertor find choice(yes/no). increment by 1
            $set: { 'recipients.$.responded': true }, // $ index used to acces the exact record (recipient)
            lastResponded: new Date()
          }
        ).exec(); // to execute query
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Sending Email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    // pass on entire subject object to get sunject and recipients, what html(template)?
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};

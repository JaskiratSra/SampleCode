const sendgrid = require('sendgrid');
const helper = sendgrid.mail; // helper to create email
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    // content represents the html string
    super();
    // calling mail constructors
    this.sgApi = sendgrid(keys.sendGridKey); // telling sendgrid to send email
    this.from_email = new helper.Email('no-reply@jaskiratapp.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content); //just a indication its html
    this.recipients = this.formatAddresses(recipients); // array of helper email objects

    this.addContent(this.body); //registering body with mailer
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email); //extract each email from array
    });
  }

  addClickTracking() {
    // helpers for sendgrid
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize); // Adding helper email objects to mailer
  }

  async send() {
    const request = await this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request); // this precisely sends to sendgrid
    return response;
  }
}

module.exports = Mailer;

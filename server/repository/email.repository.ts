// tslint:disable-next-line:no-var-requires
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const send = async msg => {
  return await sgMail.send(msg);
};

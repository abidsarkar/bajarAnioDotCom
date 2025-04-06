const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
// 📧 Email Sender Function
const sendEmail = async (email, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// 📌 Load Email Templates
const loadTemplate = (templateName, replacements) => {
  let templatePath = path.join(
    __dirname,
    "../../utility/emailTemplate",
    `${templateName}.html`
  );
  let emailTemplate = fs.readFileSync(templatePath, "utf8");

  Object.keys(replacements).forEach((key) => {
    emailTemplate = emailTemplate.replace(`{{${key}}}`, replacements[key]);
  });

  return emailTemplate;
};
module.exports = { sendEmail, loadTemplate };

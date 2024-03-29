import { Message } from "@prisma/client";

export async function createEnquiry(fields: Message) {
  const message = {
    ...fields,
  };

  await sendEmail({
    to: "dave@applification.net",
    from: "dave@applification.net",
    subject: `Blog Enquiry from ${message.email}`,
    text: message.message,
    html: message.message,
  });

  return true;
}

let mailgunDomain = "mg.example.com";
if (process.env.MAILGUN_DOMAIN) {
  mailgunDomain = process.env.MAILGUN_DOMAIN;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("MAILGUN_DOMAIN is required");
}
let mailgunSendingKey = "example_send_key";
if (process.env.MAILGUN_SENDING_KEY) {
  mailgunSendingKey = process.env.MAILGUN_SENDING_KEY;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("MAILGUN_SENDING_KEY is required");
}

type MailgunMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string | null;
};

async function sendEmail({ to, from, subject, text, html }: MailgunMessage) {
  const auth = `${Buffer.from(`api:${mailgunSendingKey}`).toString("base64")}`;

  if (html === undefined) {
    html = text;
  } else if (html === null) {
    html = text;
  }

  const body = new URLSearchParams({
    to,
    from,
    subject,
    text,
    html,
  });

  const res = await fetch(
    `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return res;
}

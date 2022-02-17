export async function emailSignup({ email }: { email: string }) {
  let mailgunDomain = "mg.example.com";
  if (process.env.MAILGUN_DOMAIN) {
    mailgunDomain = process.env.MAILGUN_DOMAIN;
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("MAILGUN_DOMAIN is required");
  }

  let mailgunAPIKey = "example_api_key";
  if (process.env.MAILGUN_API_KEY) {
    mailgunAPIKey = process.env.MAILGUN_API_KEY;
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("MAILGUN_API_KEY is required");
  }

  const auth = `${Buffer.from(`api:${mailgunAPIKey}`).toString("base64")}`;

  const body = new URLSearchParams({
    address: email,
    name: "",
  });

  const res = await fetch(
    `https://api.mailgun.net/v3/lists/dave@${mailgunDomain}/members`,
    {
      method: "post",
      body,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return res;
}

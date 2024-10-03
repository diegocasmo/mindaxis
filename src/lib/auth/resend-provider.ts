import { Provider } from "next-auth/providers";
import Resend from "next-auth/providers/resend";

interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  provider: Provider;
}

export const sendVerificationRequestDev = async ({
  identifier,
  url,
}: SendVerificationRequestParams): Promise<void> => {
  const { host } = new URL(url);

  console.log(`
----------------------------------
From: ${process.env.EMAIL_FROM}
To: ${identifier}
Subject: Sign in to ${host}

Sign in URL:

${url}

----------------------------------
  `);
};

export const getResendProvider = () => {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  return Resend({
    from: process.env.EMAIL_FROM,
    // Send email verification requests to the console in development to avoid
    // spamming the Resend API
    ...(process.env.NODE_ENV === "development"
      ? { sendVerificationRequest: sendVerificationRequestDev }
      : {}),
  });
};

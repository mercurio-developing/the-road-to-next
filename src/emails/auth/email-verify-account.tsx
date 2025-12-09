import {
  Html,
  Head,
  Body,
  Section,
  Container,
  Text,
  Tailwind,
} from "@react-email/components";

type EmailVerifyAccountProps = {
  toName: string;
  code: string;
};

const EmailVerifyAccount = ({ toName, code }: EmailVerifyAccountProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-50 m-0 p-6 text-gray-900">
          <Container className="mx-auto my-6 max-w-md">
            <Section className="bg-white border border-gray-200 rounded-lg shadow-sm px-8 py-10">
              <Text className="text-2xl font-semibold mb-2">Hi {toName},</Text>
              <Text className="text-gray-700 leading-6">
                Thanks for creating an account with us. To keep your information
                secure, we need to verify your email address. Use the code below
                to complete your verification.
              </Text>

              <div className="mt-6 inline-block rounded-md bg-gray-900 text-white px-6 py-4 font-mono text-3xl tracking-[.3em]">
                {code}
              </div>

              <Text className="mt-6 text-sm text-gray-600">
                For your security, never share this code with anyone.
              </Text>
              <Text className="mt-2 text-xs text-gray-500">
                If you didn’t request this, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerifyAccount.PreviewProps = {
  toName: "Jane Doe",
  code: "348219",
};

export default EmailVerifyAccount;

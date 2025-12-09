import {
  Html,
  Head,
  Body,
  Section,
  Container,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

type EmailVerifyAccountProps = {
  toName: string;
  url: string;
};

const EmailVerifyAccount = ({ toName, url }: EmailVerifyAccountProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text className="text-xl">Hi {toName},</Text>
              <Text className="text-gray-700">
                Thanks for creating an account with us. To keep your information
                secure, we need to verify your email address.
              </Text>
            </Section>
            <Section className="mt-4">
              <Button
                href={url}
                className="bg-black rounded text-white p-2 m-2"
              >
                VERIFY MY ACCOUNT
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerifyAccount.PreviewProps = {
  toName: "Jane Doe",
  url: "http://localhost:3000/password-reset/example-token",
};

export default EmailVerifyAccount;

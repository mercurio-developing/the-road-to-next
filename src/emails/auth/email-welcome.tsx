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

type EmailWelcomeProps = {
  toName: string;
  loginUrl: string;
};

const EmailWelcome = ({ toName, loginUrl }: EmailWelcomeProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans m-8 text-center">
          <Container>
            <Section>
              <Text className="text-xl">
                Hi {toName}, welcome to TicketBounty!
              </Text>
              <Text className="text-gray-700">
                We’re excited to have you on board. Let us know if you ever have
                questions!
              </Text>
            </Section>
            <Section className="mt-4">
              <Button href={loginUrl} className="bg-black rounded text-white p-2 m-2">
                Get Started
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailWelcome.PreviewProps = {
  toName: "Jane Doe",
  loginUrl: "http://localhost:3000/sign-in",
};

export default EmailWelcome;

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Tailwind,
} from "@react-email/components";
import { format } from "date-fns";

type EmailWeeklyDigestProps = {
  periodStartUtc: string | Date;
  periodEndUtc: string | Date;
  usersCount: number;
  ticketsCount: number;
};

const EmailWeeklyDigest = ({
  periodStartUtc,
  periodEndUtc,
  usersCount,
  ticketsCount,
}: EmailWeeklyDigestProps) => {

  const start = new Date(periodStartUtc);
  const end = new Date(periodEndUtc);

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] p-6 m-0 font-sans">
          <Container className="bg-white rounded-lg p-6 border border-[#eaeaea]">
            <Section>
              <Heading as="h2" className="m-0 mb-2">
                Weekly Activity Report
              </Heading>
              <Text>
                Period (UTC):
                <br />
                <strong>{format(start, "yyyy-MM-dd")}</strong> →{" "}
                <strong>{format(end, "yyyy-MM-dd")}</strong>
              </Text>
              <Hr className="my-4 border-[#eaeaea]" />
              <Text>
                New users: <strong>{usersCount}</strong>
              </Text>
              <Text>
                New tickets: <strong>{ticketsCount}</strong>
              </Text>
              <Hr className="my-4 border-[#eaeaea]" />
              <Text className="text-[#666] text-[12px]">
                This is an automated report.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailWeeklyDigest.PreviewProps = {
  periodStartUtc: Date.now() - 7 * 24 * 60 * 60 * 1000,
  periodEndUtc: Date.now(),
  usersCount: 5,
  ticketsCount: 5,
};

export default EmailWeeklyDigest;

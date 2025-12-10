import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WaitlistConfirmationProps {
  email: string;
  unsubscribeToken: string;
}

export function WaitlistConfirmation({
  email,
  unsubscribeToken,
}: WaitlistConfirmationProps) {
  const unsubscribeUrl = `https://firstdatelabs.com/unsubscribe?token=${unsubscribeToken}`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to First Date Labs - You&apos;re on the list!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>First Date Labs</Text>
          </Section>

          <Heading style={heading}>Welcome to First Date Labs!</Heading>

          <Text style={paragraph}>Thanks for signing up, {email}!</Text>

          <Text style={paragraph}>
            You&apos;re now on our early access list. We&apos;re building
            something special to help you have better first dates, and
            you&apos;ll be among the first to experience it.
          </Text>

          <Text style={paragraph}>
            We&apos;ll notify you as soon as we launch. In the meantime, keep
            an eye on your inbox for updates and sneak peeks.
          </Text>

          <Section style={ctaSection}>
            <Text style={ctaText}>
              Questions? Just reply to this email - we&apos;d love to hear from
              you.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you signed up for First
              Date Labs early access.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles for email compatibility
const main: React.CSSProperties = {
  backgroundColor: "#fffdf6",
  fontFamily:
    "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logoSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logoText: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0",
};

const heading: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const paragraph: React.CSSProperties = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const ctaSection: React.CSSProperties = {
  backgroundColor: "#f9d544",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "32px",
  marginBottom: "32px",
};

const ctaText: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center" as const,
  margin: "0",
};

const footer: React.CSSProperties = {
  borderTop: "1px solid #eee",
  paddingTop: "24px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const unsubscribeLink: React.CSSProperties = {
  color: "#999",
  fontSize: "12px",
  textDecoration: "underline",
};

export default WaitlistConfirmation;

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailSocialLinks } from "./components/EmailSocialLinks";

interface QuizResultsEmailProps {
  email: string;
  unsubscribeToken: string;
  archetypeName: string;
  archetypeImageUrl: string;
  quizResultUrl?: string;
}

export function QuizResultsEmail({
  email,
  unsubscribeToken,
  archetypeName,
  archetypeImageUrl,
  quizResultUrl,
}: QuizResultsEmailProps) {
  const unsubscribeUrl = `https://firstdatelabs.com/unsubscribe?token=${unsubscribeToken}`;

  return (
    <Html>
      <Head />
      <Preview>Your Dating Pattern: {archetypeName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>First Date Labs</Text>
          </Section>

          <Heading style={heading}>
            Your Dating Pattern: {archetypeName}
          </Heading>

          <Text style={paragraph}>Hi {email}!</Text>

          <Text style={paragraph}>
            Thanks for taking the quiz! Your results have been saved, and
            you&apos;re now on our early access list.
          </Text>

          {quizResultUrl && (
            <Section style={ctaButtonSection}>
              <Link href={quizResultUrl} style={ctaButton}>
                View Your Saved Results
              </Link>
            </Section>
          )}

          <Section style={resultCard}>
            <Img
              src={archetypeImageUrl}
              alt={archetypeName}
              width={96}
              height={96}
              style={resultImage}
            />
            <Text style={resultTitle}>{archetypeName}</Text>
            <Text style={resultDescription}>
              We&apos;re building personalized coaching insights based on your
              dating pattern. You&apos;ll be among the first to access in-depth
              analysis when we launch.
            </Text>
          </Section>

          <Text style={paragraph}>
            Your detailed report will include:
          </Text>

          <Section style={bulletList}>
            <Text style={bulletItem}>• Personalized coaching recommendations</Text>
            <Text style={bulletItem}>• Red flags to watch for in relationships</Text>
            <Text style={bulletItem}>• Communication strategies that work for you</Text>
            <Text style={bulletItem}>• Attachment style insights</Text>
          </Section>

          <Section style={ctaSection}>
            <Text style={ctaLinePrimary}>
              We&apos;ll notify you as soon as the full analysis is ready.
            </Text>
            <Text style={ctaLineSecondary}>
              Questions? Just reply to this email.
            </Text>
          </Section>

          <EmailSocialLinks source="quiz-results" />

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because you saved your quiz
              results on First Date Labs.
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
  fontSize: "24px",
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

const resultCard: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  padding: "24px",
  marginTop: "24px",
  marginBottom: "24px",
  textAlign: "center" as const,
  border: "1px solid #eee",
};

const resultImage: React.CSSProperties = {
  display: "block",
  margin: "0 auto 12px",
  borderRadius: "999px",
};

const resultTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 12px",
};

const resultDescription: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  lineHeight: "1.5",
  margin: "0",
};

const bulletList: React.CSSProperties = {
  marginBottom: "24px",
};

const bulletItem: React.CSSProperties = {
  fontSize: "14px",
  color: "#4a4a4a",
  lineHeight: "1.7",
  margin: "0 0 6px",
};

const ctaSection: React.CSSProperties = {
  backgroundColor: "#f9d544",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "32px",
  marginBottom: "32px",
};

const ctaLinePrimary: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0",
};

const ctaLineSecondary: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center" as const,
  margin: "6px 0 0",
};

const ctaButtonSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "8px",
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#f9d544",
  color: "#1a1a1a",
  borderRadius: "999px",
  padding: "12px 18px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
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

export default QuizResultsEmail;

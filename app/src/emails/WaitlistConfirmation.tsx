import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailSocialLinks } from "./components/EmailSocialLinks";

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
      <Preview>
        🎉 You&apos;re in! Ready to get more dates and build real connections
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>First Date Labs</Text>
          </Section>

          <Text style={paragraph}>Thanks for signing up.</Text>

          <Text style={paragraph}>
            You&apos;re joining something rare: a community of people who
            admitted the truth most won&apos;t say out loud.
          </Text>

          <Text style={boldStatement}>Swiping endlessly isn&apos;t working.</Text>

          <Text style={paragraph}>
            Not because you&apos;re not good enough. Not because the right
            person isn&apos;t out there.
          </Text>

          <Text style={paragraph}>
            It&apos;s because dating conversations are skills. And you&apos;ve
            never actually <em>practiced</em> them.
          </Text>

          <Hr style={divider} />

          <Text style={sectionHeader}>
            Here&apos;s what separates people who build real relationships:
          </Text>

          <Text style={paragraph}>
            They don&apos;t go on more dates. They have <em>better</em>{" "}
            conversations.
          </Text>

          <Text style={paragraph}>
            Better at reading chemistry. Better at showing up as themselves.
            Better at recognizing someone worth a second date.
          </Text>

          <Text style={paragraph}>
            Most people never get that skill. You just joined a community that
            does.
          </Text>

          <Hr style={divider} />

          <Text style={sectionHeader}>What we&apos;re building for you:</Text>

          <Text style={paragraph}>
            An AI training partner like a flight simulator for pilots — except
            the stakes are your dating life and genuine relationships.
          </Text>

          <Text style={paragraph}>
            No judgment. No awkwardness. Just practice that builds real
            confidence.
          </Text>

          <Hr style={divider} />

          <Text style={sectionHeader}>You&apos;ll experience:</Text>

          <Text style={emojiItem}>
            🎯 That breakthrough moment when you suddenly see what builds real
            chemistry and realize you&apos;ve been capable all along—you just
            needed the practice reps
          </Text>

          <Text style={emojiItem}>
            🎯 Your confidence growing visibly each week as you recognize your
            patterns shifting in how you connect, the questions you ask, and the
            moments you create
          </Text>

          <Text style={emojiItem}>
            🎯 Walking into real dates with a completely different energy
          </Text>

          <Hr style={divider} />

          <Section style={ctaSection}>
            <Text style={ctaHeader}>Your move:</Text>
            <Text style={ctaText}>
              Reply with ONE answer: What&apos;s the dating conversation moment
              that matters most to you?
            </Text>
          </Section>

          <Text style={paragraph}>
            (First message with someone new? Building real chemistry? Knowing if
            there&apos;s genuine connection?)
          </Text>

          <Text style={paragraph}>
            We read every reply. People who engage get exclusive early access.
          </Text>

          <Text style={signOff}>See you on the other side,</Text>
          <Text style={brandSignature}>FirstDateLabs</Text>

          <EmailSocialLinks source="waitlist" />

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

const paragraph: React.CSSProperties = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const boldStatement: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "1.4",
  margin: "24px 0 16px",
};

const sectionHeader: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 16px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #eee",
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
  margin: "24px 0",
};

const emojiItem: React.CSSProperties = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};

const ctaSection: React.CSSProperties = {
  backgroundColor: "#f9d544",
  borderRadius: "12px",
  padding: "20px",
  marginTop: "8px",
  marginBottom: "24px",
};

const ctaHeader: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const ctaText: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const signOff: React.CSSProperties = {
  color: "#4a4a4a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0 4px",
};

const brandSignature: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 24px",
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

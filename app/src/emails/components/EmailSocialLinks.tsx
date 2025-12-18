import { Img, Link, Section, Text } from "@react-email/components";

interface EmailSocialLinksProps {
  source: "waitlist" | "quiz-results";
}

// Base URLs for social platforms (cleaned of existing tracking params)
const socialLinks = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    baseUrl: "https://www.linkedin.com/company/first-date-labs/",
  },
  {
    platform: "instagram",
    label: "Instagram",
    baseUrl: "https://www.instagram.com/firstdatelabs",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    baseUrl: "https://www.tiktok.com/@firstdatelabs",
  },
  {
    platform: "twitter",
    label: "Twitter",
    baseUrl: "https://x.com/firstdatelabs",
  },
];

function buildAssetUrl(pathname: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://firstdatelabs.com").replace(
    /\/$/,
    ""
  );
  return `${baseUrl}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

function buildUtmUrl(
  baseUrl: string,
  campaign: string,
  platform: string
): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}utm_source=email&utm_medium=email&utm_campaign=${campaign}&utm_content=social-${platform}`;
}

export function EmailSocialLinks({ source }: EmailSocialLinksProps) {
  const campaign =
    source === "waitlist" ? "waitlist-confirmation" : "quiz-results";

  return (
    <Section style={socialSection}>
      <Text style={socialHeading}>Follow us for exclusive dating tips</Text>
      <table cellPadding="0" cellSpacing="0" style={socialIconsTable}>
        <tbody>
          <tr>
            {socialLinks.map((social) => (
              <td key={social.platform} style={socialIconCell}>
                <Link
                  href={buildUtmUrl(social.baseUrl, campaign, social.platform)}
                  target="_blank"
                  style={socialIconLink}
                  aria-label={social.label}
                >
                  <Img
                    src={buildAssetUrl(`/emails/social/${social.platform}.png`)}
                    alt={social.label}
                    width="24"
                    height="24"
                    style={iconImage}
                  />
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

// Inline styles for email compatibility
const socialSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
};

const socialHeading: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const socialIconsTable: React.CSSProperties = {
  margin: "0 auto",
};

const socialIconCell: React.CSSProperties = {
  padding: "0 8px",
};

const socialIconLink: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
};

const iconImage: React.CSSProperties = {
  display: "block",
  outline: "none",
  border: "0",
};

export default EmailSocialLinks;

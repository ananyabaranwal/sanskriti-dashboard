import Link from "next/link";
import { BRAND } from "@/lib/constants";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you register as a seller, update your profile, or contact us. This includes:

• Identity information: Name, date of birth, PAN card number, Aadhaar number
• Contact information: Email address, phone number, postal address
• Business information: Business name, GST number, bank account details
• Transaction data: Wallet top-ups, orders placed, payments received
• Communication data: Messages sent through our platform, support tickets
• Technical data: IP address, browser type, device information, cookies

We also collect information automatically when you use our platform, including usage data, log data, and information about how you interact with our services.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Create and manage your seller account
• Process wallet transactions and payments
• Generate GST invoices and financial records
• Verify your identity and conduct KYC checks
• Send you transactional emails (order confirmations, payment receipts)
• Provide customer support
• Improve our platform and services
• Detect and prevent fraud or misuse
• Comply with legal obligations under Indian law
• Send you marketing communications (with your consent)

We do not sell your personal information to third parties. We may share it with payment processors, KYC verification services, and logistics partners as necessary to provide our services.`,
  },
  {
    title: "3. Data Storage and Security",
    content: `Your data is stored on secure servers hosted in India and compliant with the Information Technology Act, 2000 and the IT (Amendment) Act, 2008. We implement industry-standard security measures including:

• SSL/TLS encryption for all data transmission
• AES-256 encryption for sensitive data at rest
• Regular security audits and penetration testing
• Access controls limiting who can view your data
• Secure backup procedures

While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and not share your login credentials with anyone.`,
  },
  {
    title: "4. Cookies and Tracking",
    content: `We use cookies and similar tracking technologies to:

• Keep you logged in to your account
• Remember your preferences
• Understand how you use our platform
• Improve our services

Types of cookies we use:
• Essential cookies: Required for the platform to function (cannot be disabled)
• Analytics cookies: Help us understand usage patterns (can be disabled)
• Marketing cookies: Help us show relevant advertisements (can be disabled)

You can control cookies through your browser settings. Disabling essential cookies may affect your ability to use the platform.`,
  },
  {
    title: "5. Your Rights Under Indian Law",
    content: `Under the Information Technology Act and the Digital Personal Data Protection Act, 2023 (when enacted), you have the right to:

• Access your personal data held by us
• Correct inaccurate or incomplete data
• Request deletion of your account and data (subject to legal retention requirements)
• Object to processing of your data for marketing purposes
• Withdraw consent for optional data processing
• File a grievance with our Data Protection Officer

To exercise these rights, contact our Grievance Officer at: ${BRAND.email}
We will respond to all legitimate requests within 30 days.`,
  },
  {
    title: "6. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide our services. Specifically:

• Account data: Retained for the duration of your account plus 3 years after closure
• Financial records: Retained for 7 years as required by Indian tax law
• KYC documents: Retained for 5 years as required by PMLA regulations
• Communication records: Retained for 2 years
• Technical logs: Retained for 1 year

When data is no longer required, we securely delete or anonymise it.`,
  },
  {
    title: "7. Third-Party Services",
    content: `We integrate with the following third-party services, each with their own privacy policies:

• Razorpay / Cashfree / PayPal: Payment processing
• MongoDB Atlas: Secure database hosting
• AWS (Amazon Web Services): Cloud infrastructure and file storage
• Nodemailer / Resend: Email delivery
• Google Analytics: Website usage analytics (anonymised)

We encourage you to review the privacy policies of these services. We are not responsible for the privacy practices of third-party services.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our platform is intended for use by individuals 18 years of age or older. We do not knowingly collect personal information from anyone under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will delete such information from our systems.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of significant changes by:

• Sending an email to your registered email address
• Displaying a prominent notice on our platform
• Updating the "Last updated" date at the top of this page

Your continued use of our platform after changes take effect constitutes your acceptance of the updated policy.`,
  },
  {
    title: "10. Contact & Grievance Officer",
    content: `If you have questions about this Privacy Policy or wish to exercise your data rights, please contact:

Grievance Officer / Data Protection Officer
Sanskriti The Antique
${BRAND.address}

Email: ${BRAND.email}
Phone: ${BRAND.phone}
Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST

We take privacy concerns seriously and will respond within 30 days of receiving your request.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "56px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>Privacy Policy</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "12px", fontWeight: "400" }}>Privacy Policy</h1>
          <p style={{ fontSize: "14px", color: "rgba(245,230,200,.5)" }}>Last updated: May 2026 · Effective immediately</p>
          <p style={{ fontSize: "15px", color: "rgba(245,230,200,.6)", marginTop: "12px", lineHeight: "1.7", maxWidth: "560px" }}>
            At Sanskriti The Antique, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Quick nav */}
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "14px", padding: "20px 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#6B4F12", marginBottom: "12px", letterSpacing: ".04em", textTransform: "uppercase" }}>Quick Navigation</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {sections.map((s, i) => (
              <a key={i} href={`#section-${i}`} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "99px", background: "#F5E6C8", border: "1px solid #E8D5A3", color: "#6B4F12", textDecoration: "none", fontWeight: "500" }}>
                {s.title.split(". ")[1] || s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} id={`section-${i}`} style={{ marginBottom: "36px", background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", background: "linear-gradient(135deg, #FBF7F0, #FFFDF9)", borderBottom: "1px solid #F0E4C0", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3D2B1F", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>{i + 1}</div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif" }}>{s.title.split(". ").slice(1).join(". ")}</h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {s.content.split("\n").map((line, j) => (
                line.trim() === "" ? <br key={j} /> :
                line.startsWith("•") ? (
                  <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ color: "#C9A84C", flexShrink: 0, marginTop: "2px" }}>•</span>
                    <span style={{ fontSize: "14px", color: "#6B4F12", lineHeight: "1.7" }}>{line.slice(1).trim()}</span>
                  </div>
                ) : (
                  <p key={j} style={{ fontSize: "14px", color: "#6B4F12", lineHeight: "1.8", marginBottom: "8px" }}>{line}</p>
                )
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ background: "linear-gradient(135deg, #2C1810, #3D2B1F)", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "rgba(245,230,200,.6)", lineHeight: "1.7", marginBottom: "16px" }}>
            By using Sanskriti The Antique, you agree to this Privacy Policy. If you have questions, contact our team.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ padding: "9px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Contact Us</Link>
            <Link href="/disclaimer" style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>View Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

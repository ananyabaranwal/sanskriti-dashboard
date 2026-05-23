import Link from "next/link";
import { BRAND } from "@/lib/constants";

const sections = [
  {
    icon: "⚠️",
    title: "Authenticity Disclaimer",
    content: `Sanskriti The Antique makes every reasonable effort to verify the authenticity of items listed on our platform. However, we cannot guarantee the absolute authenticity of every antique listed by third-party sellers.

• All authenticity claims are based on the seller's representation and our team's assessment
• Antique identification involves subjective expert judgment and is not an exact science
• Age, origin, and provenance information provided by sellers is believed to be accurate but may contain errors
• We recommend buyers request additional documentation or independent appraisal for high-value purchases
• Sanskriti The Antique is not liable for losses arising from authenticity disputes beyond our mediation process`,
  },
  {
    icon: "📦",
    title: "Loss and Damage in Transit",
    content: `Antiques are fragile by nature. While we partner with specialised art and antique logistics providers, Sanskriti The Antique is not responsible for:

• Damage occurring during shipping or transit
• Loss of items after handover to the logistics partner
• Damage resulting from inadequate packaging by the seller
• Force majeure events including natural disasters, strikes, or civil unrest

Sellers are strongly advised to use appropriate packaging materials and to insure high-value items before dispatch. Buyers are encouraged to inspect packages upon delivery and document any damage immediately.`,
  },
  {
    icon: "💰",
    title: "Pricing and Valuation",
    content: `Antique valuations are inherently subjective and market-dependent:

• Prices listed on our platform are set by individual sellers and represent their valuation
• Sanskriti The Antique does not guarantee that listed prices reflect current market value
• Past transaction prices are not indicative of future value
• The antique market can be volatile — values may increase or decrease significantly
• We provide educational content on valuation but this does not constitute professional appraisal advice

For investment purposes, we strongly recommend obtaining an independent professional appraisal from a certified appraiser before making significant purchases.`,
  },
  {
    icon: "🔄",
    title: "Returns and Refunds",
    content: `Returns are accepted under specific conditions only:

• Items must be returned within 7 days of delivery
• The item must be significantly different from its description or images
• Items damaged during return shipping are the buyer's responsibility
• We do not accept returns for items that are as described but not to the buyer's taste
• Custom orders and negotiated purchases are final sale unless the item is materially misrepresented
• Refunds are processed to the original payment method within 7–14 business days after the return is approved

Antiques are often unique, one-of-a-kind items. We encourage buyers to ask all questions before purchasing.`,
  },
  {
    icon: "⚖️",
    title: "Legal Compliance",
    content: `Sellers on our platform are solely responsible for:

• Ensuring they have legal title to items they sell
• Compliance with the Antiquities and Art Treasures Act, 1972
• Items classified as "protected antiquities" under Indian law cannot be bought or sold without government permission
• Export of antiques over 100 years old requires permission from the Archaeological Survey of India
• Any tax obligations arising from their sales (GST, income tax)
• Obtaining necessary licences for dealing in antiques in their state

Sanskriti The Antique reserves the right to remove any listing that may violate applicable laws and to report suspected illegal activity to relevant authorities.`,
  },
  {
    icon: "🏛️",
    title: "Cultural Heritage",
    content: `We are committed to the ethical trade of Indian heritage:

• We do not knowingly facilitate the sale of stolen, illegally exported, or looted antiquities
• Items of significant cultural heritage may be subject to government preemption rights
• We cooperate fully with authorities investigating heritage crimes
• Buyers and sellers are responsible for ensuring their transactions comply with INTERPOL guidelines on cultural property
• We encourage the documentation and preservation of provenance information for all significant pieces

If you have concerns about a specific listing's provenance or legality, please report it to us immediately at ${BRAND.email}`,
  },
  {
    icon: "💼",
    title: "Platform Liability Limitation",
    content: `Sanskriti The Antique operates as a marketplace platform connecting buyers and sellers. To the maximum extent permitted by law:

• We are not a party to transactions between buyers and sellers
• We are not liable for any indirect, incidental, special, or consequential damages
• Our total liability in any dispute is limited to the transaction value of the specific item in dispute
• We make no warranties about the reliability, availability, or accuracy of third-party content
• We reserve the right to suspend or terminate accounts that violate our terms of service

This limitation of liability applies regardless of the form of action — whether in contract, tort, negligence, or otherwise.`,
  },
  {
    icon: "🔒",
    title: "Investment Risk Warning",
    content: `Purchasing antiques involves financial risk:

• Antiques are illiquid assets — reselling may take time and may not achieve the purchase price
• Market demand for specific categories can change significantly over time
• Condition, provenance, and market trends all affect resale value
• This platform is not a financial advisory service
• Nothing on this platform constitutes investment advice
• Past appreciation of antique values is not a guarantee of future performance

Please make purchasing decisions based on your own research and, where appropriate, consult a qualified financial or art market advisor.`,
  },
];

export default function DisclaimerPage() {
  return (
    <div style={{ background: "#FBF7F0", minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", padding: "56px 0 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Link href="/" style={{ fontSize: "13px", color: "rgba(201,168,76,.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(201,168,76,.3)" }}>›</span>
            <span style={{ fontSize: "13px", color: "rgba(201,168,76,.9)" }}>Disclaimer</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "99px", background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px" }}>⚠️</span>
            <span style={{ fontSize: "11px", color: "#fca5a5", letterSpacing: ".1em", fontWeight: "600" }}>IMPORTANT — PLEASE READ CAREFULLY</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "Georgia, serif", color: "#F5E6C8", marginBottom: "12px", fontWeight: "400" }}>Disclaimer</h1>
          <p style={{ fontSize: "14px", color: "rgba(245,230,200,.5)" }}>Last updated: May 2026</p>
          <p style={{ fontSize: "15px", color: "rgba(245,230,200,.62)", marginTop: "12px", lineHeight: "1.7", maxWidth: "580px" }}>
            By using Sanskriti The Antique, you acknowledge that you have read, understood, and agreed to the following disclaimers and limitations of liability.
          </p>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Warning box */}
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderLeft: "4px solid #EF4444", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#991B1B", marginBottom: "4px" }}>Important Notice</div>
              <p style={{ fontSize: "13px", color: "#7F1D1D", lineHeight: "1.7" }}>
                Sanskriti The Antique is a marketplace platform. We connect buyers and sellers but are not a party to individual transactions. Users are advised to exercise due diligence before making any purchase. This disclaimer forms part of our Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", background: "linear-gradient(135deg, #FBF7F0, #FFFDF9)", borderBottom: "1px solid #F0E4C0", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif" }}>{s.title}</h2>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {s.content.split("\n").map((line, j) => (
                  line.trim() === "" ? <br key={j} /> :
                  line.startsWith("•") ? (
                    <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "7px", alignItems: "flex-start" }}>
                      <span style={{ color: "#C9A84C", flexShrink: 0, marginTop: "3px", fontSize: "12px" }}>▸</span>
                      <span style={{ fontSize: "14px", color: "#6B4F12", lineHeight: "1.75" }}>{line.slice(1).trim()}</span>
                    </div>
                  ) : (
                    <p key={j} style={{ fontSize: "14px", color: "#6B4F12", lineHeight: "1.8", marginBottom: "8px" }}>{line}</p>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", background: "linear-gradient(135deg, #2C1810, #3D2B1F)", borderRadius: "14px", padding: "28px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "rgba(245,230,200,.65)", lineHeight: "1.75", marginBottom: "20px", maxWidth: "520px", margin: "0 auto 20px" }}>
            If you disagree with any part of this disclaimer, please do not use our platform. For questions, contact us at {BRAND.email}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ padding: "9px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/contact" style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Contact Us</Link>
            <Link href="/faq" style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid rgba(201,168,76,.3)", color: "#C9A84C", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

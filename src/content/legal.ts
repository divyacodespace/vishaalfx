// ============================================================================
// LEGAL CONTENT TEMPLATES — DRAFT ONLY
// These documents are placeholder/template text generated to satisfy the
// product flow. They are NOT legal advice and MUST be reviewed, edited, and
// approved by a qualified legal professional before production launch.
// Version strings below must be bumped (and CURRENT_*_VERSION in
// src/lib/config.ts updated) any time the substance of a document changes.
//
// Note on scope: VishaalFX is a paid trading course (course fee: see
// courseFee below) that uses this platform to verify age (self-declared), collect
// student details, and capture a signed acknowledgement of these documents
// before granting course access. This app does NOT implement any in-app
// payment/checkout — enrollment fee collection currently happens outside
// this codebase (e.g. bank transfer/offline), and these documents describe
// that fee as a factual matter without claiming an in-app payment flow
// exists. If in-app payment collection is built later, section 3 below
// must be updated to match the real flow.
// ============================================================================

import { CURRENT_PRIVACY_VERSION, CURRENT_RISK_VERSION, CURRENT_TERMS_VERSION, business } from "@/lib/config";

export const courseFee = "₹50,000 (INR)";

export interface LegalSection {
  heading: string;
  body: string[];
}

export const courseName = "VishaalFX Trading Course";

export const termsAndConditions: { version: string; sections: LegalSection[] } = {
  version: CURRENT_TERMS_VERSION,
  sections: [
    {
      heading: "1. Introduction",
      body: [
        `These Terms and Conditions ("Terms") govern your participation in the online trading course, "${courseName}" ("the Course"), provided by ${business.legalName} ("the Instructor", "we", "us"). By enrolling in the Course, you agree to be bound by these Terms. Please read them carefully before enrolling.`,
        "The Instructor is an independent educator offering this Course in a personal capacity, and is not a government body, regulatory authority, registered educational institute, or licensed financial advisory firm. The Course is a private educational offering only and should not be mistaken for accreditation, certification, or advice from any government or regulatory institution.",
      ],
    },
    {
      heading: "2. Course Details",
      body: [
        "The Course will cover the fundamentals of trading, including but not limited to trading strategies, risk management, market analysis, and related topics as outlined in the Course curriculum shared at the time of enrollment.",
      ],
    },
    {
      heading: "3. Enrollment and Payment",
      body: [
        "Enrollment: To enroll in the Course, you must complete the registration form and pay the applicable fee.",
        `Payment: The Course fee is ${courseFee}, which must be paid in full before the Course begins.`,
      ],
    },
    {
      heading: "4. Course Mode, Schedule and Participation",
      body: [
        "Course Mode: The Course will be conducted entirely online via live virtual sessions. Access details (link/platform) will be shared with enrolled participants before the start date.",
        "Course Schedule will be flexible.",
        "Technical Requirements: Participants are responsible for ensuring they have a stable internet connection and a compatible device to attend the live sessions. The Instructor is not responsible for participants missing content due to their own connectivity or technical issues.",
        "Absences: You are expected to attend all sessions. If you miss a session, no make-up classes or refunds will be provided.",
        "Session Recordings: Where recordings are provided, they are for the personal use of the enrolled participant only and may not be shared, downloaded, or redistributed.",
        "Code of Conduct: Participants are expected to maintain a respectful and professional demeanor during the Course. Disruptive or inappropriate behavior may result in removal from the Course without refund.",
      ],
    },
    {
      heading: "5. Intellectual Property",
      body: [
        "All materials provided during the Course, including presentations, videos, handouts, and worksheets, are the intellectual property of the Instructor and are protected by copyright laws. Participants are not permitted to distribute, reproduce, or share these materials without prior written consent.",
      ],
    },
    {
      heading: "6. Confidentiality",
      body: [
        "Participants are required to keep any confidential information disclosed during the Course confidential. This includes but is not limited to proprietary strategies, methods, and business information shared by the Instructor or other participants.",
      ],
    },
    {
      heading: "7. Risk Acknowledgment",
      body: [
        "Trading involves a high degree of risk, including the potential loss of your entire capital. By participating in the Course, you expressly acknowledge and accept that:",
        "The Course is for educational purposes only and does not provide personalized financial advice.",
        "You should consult a professional, licensed financial advisor before making any investment or trading decisions.",
        "The Instructor does not guarantee any financial results, returns, or profits from applying the teachings of the Course, and no such guarantee should be inferred from anything said or demonstrated during the Course.",
        "Any trading decisions you make, before, during, or after the Course, are made entirely at your own discretion and at your own risk.",
        "Any and all financial losses arising from your trading activity are solely and entirely your own responsibility. The Instructor bears no responsibility, financial or otherwise, for any loss you incur.",
      ],
    },
    {
      heading: "8. Limitation of Liability",
      body: [
        "The Instructor will not be held responsible for any loss, damage, or injury resulting from your participation in the Course or from any decisions made based on the information provided. You agree to indemnify and hold harmless the Instructor and their affiliates from any claims, losses, or damages arising from your participation in the Course.",
      ],
    },
    {
      heading: "9. Data Privacy",
      body: [
        "Your personal data will be handled in accordance with our Privacy Policy. By enrolling in the Course, you consent to the collection and use of your data for the purposes of course management, communications, and marketing (where applicable).",
      ],
    },
    {
      heading: "10. Governing Law",
      body: [`These Terms and Conditions shall be governed by and construed in accordance with the laws of ${business.jurisdiction}.`],
    },
    {
      heading: "11. Refund Policy",
      body: [
        "Once the Course has commenced, it is strictly non-refundable under any circumstances, including partial attendance, withdrawal midway, dissatisfaction with content, or personal inability to continue. No partial refunds, credits, or make-up sessions will be provided for sessions missed once the Course has started. We strongly encourage all participants to review the Course details carefully before enrolling and paying the fee.",
      ],
    },
    {
      heading: "12. Contact Information",
      body: [`For any queries, please contact us at: Phone: ${business.supportPhone}  |  Email: ${business.supportEmail}`],
    },
  ],
};

export const privacyPolicy: { version: string; sections: LegalSection[] } = {
  version: CURRENT_PRIVACY_VERSION,
  sections: [
    {
      heading: "Information We Collect",
      body: [
        "Details you provide: full name, email address, date of birth / age-eligibility confirmation, and optionally mobile number, city, institution, and occupation status. None of these fields are independently verified (e.g. via OTP) — they are taken as self-declared by the registrant.",
        "Signature information: a drawn signature image and/or typed legal name provided during the signed agreement, along with the signing timestamp.",
        "Technical information: IP address and basic device/browser metadata captured at key steps (age confirmation, consent, signature) for audit and fraud-prevention purposes.",
      ],
    },
    {
      heading: "Why Information Is Collected",
      body: [
        "To record your self-declared age eligibility (18+) as required to register.",
        "To contact you (via the email/mobile number you provide) regarding your registration.",
        "To generate and maintain your signed consent agreement.",
        "To review, administer, and communicate with you about the status of your registration.",
      ],
    },
    {
      heading: "How Information Is Stored",
      body: [
        "Personal data is stored in an access-controlled database. Signed agreements and signature images are stored in private, non-public storage that is never directly linked or exposed, and can only be retrieved through authenticated, authorized administrator requests.",
      ],
    },
    {
      heading: "Who Can Access It",
      body: [
        "Access to your personal data and signed agreement is restricted to authorized VishaalFX administrators. Access is logged for audit purposes.",
      ],
    },
    {
      heading: "Data Retention",
      body: [
        `[Retention period to be finalized following legal review — e.g., records and signed agreements retained for a defined period required for legal, tax, or dispute purposes.]`,
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We apply reasonable technical and organizational safeguards, including encrypted transport (HTTPS), hashed passwords, access-controlled storage, and audit logging of administrator actions on your records.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        `Subject to applicable law, you may request access to, correction of, or deletion of your personal information by contacting ${business.supportEmail}. [Specific statutory rights to be confirmed following legal review of applicable jurisdiction(s).]`,
      ],
    },
    {
      heading: "Cookies / Analytics",
      body: [
        "This site uses essential cookies required for authentication and session management. [If analytics/marketing cookies are added later, this section must be updated to disclose them and obtain consent as required by applicable law.]",
      ],
    },
    {
      heading: "Third-Party Service Providers",
      body: [
        "We may use third-party service providers for object storage, transactional email/notifications, or e-signature services, solely to operate this platform. These providers are contractually limited to processing data on our behalf. [Specific provider names to be added once selected/contracted.]",
      ],
    },
    {
      heading: "Contact",
      body: [`Privacy-related questions may be directed to ${business.supportEmail}.`],
    },
    {
      heading: "Compliance Note",
      body: [
        "This Privacy Policy is a draft template. VishaalFX does not claim compliance with any specific data protection law (e.g. GDPR, DPDP Act, CCPA) unless and until the relevant technical and organizational measures have been implemented and reviewed by qualified legal counsel.",
      ],
    },
  ],
};

export const riskDisclosure: { version: string; sections: LegalSection[] } = {
  version: CURRENT_RISK_VERSION,
  sections: [
    {
      heading: "General Risk Warning",
      body: [
        "Trading and financial markets involve significant risk of loss. Prices of financial instruments can fluctuate widely and you may lose some or all of any capital you choose to trade with.",
      ],
    },
    {
      heading: "Informational Purpose Only",
      body: [
        "Any market-related content associated with VishaalFX is provided strictly for general informational purposes. Nothing presented — including examples, illustrations, or discussion of concepts — is a recommendation to buy, sell, or hold any financial instrument.",
      ],
    },
    {
      heading: "No Promises of Profit, Income, or Success",
      body: [
        "VishaalFX does not promise or guarantee profits, returns, income, employment, or financial success. Any decision to trade or invest, and its outcome, is solely your own responsibility.",
      ],
    },
    {
      heading: "No Suitability Assessment",
      body: [
        "This process does not assess your personal financial situation, objectives, or risk tolerance. You should seek independent, personalized financial advice before making any trading or investment decision.",
      ],
    },
    {
      heading: "Acknowledgement",
      body: [
        "By checking the box below, you confirm that you have read and understood this Trading Risk Disclosure and that you accept sole responsibility for any trading or investment decisions you make.",
      ],
    },
  ],
};

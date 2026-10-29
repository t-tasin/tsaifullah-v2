/**
 * Single source of truth for roles shown anywhere on the site.
 *
 * Source: career-ops/cv.md (2026-10). Rules carried over from it:
 * - Titles match the résumé exactly (AtlasDesk uses the PM-base title, owner decision 2026-10-28). Wooster stays "Helpdesk Technician" until HR confirms a change.
 * - Every number here exists in cv.md. Do not add one that doesn't.
 * - Never "contract", never "founder" for AtlasDesk, never Wooster business-data figures from the MCP docs.
 *
 * Each highlight carries a lens so the Experience section can be read from the
 * product side, the engineering side, or both.
 */

export type Lens = 'product' | 'engineering';

export type Highlight = {
  text: string;
  lens: Lens[];
};

export type Role = {
  id: string;
  org: string;
  title: string;
  start: string;
  end: string;
  location: string;
  context?: string;
  href?: string;
  highlights: Highlight[];
};

export const roles: Role[] = [
  {
    id: 'atlasdesk',
    org: 'AtlasDesk',
    title: 'Product & Engineering Lead',
    start: 'Oct 2025',
    end: 'Present',
    location: 'Wooster, OH',
    context:
      'ITSM platform in production at The College of Wooster. Built it solo; now lead the 4 college engineers who maintain it.',
    href: '/projects/atlasdesk',
    highlights: [
      {
        text: 'Interviewed 38 users (4 directors, 14 technicians, 20 student techs) and found the vendor service desk couldn’t link tickets to devices, track loaners, search ticket text, or run a report.',
        lens: ['product'],
      },
      {
        text: 'Built the MVP in 3 days and won unanimous buy-in from 4 divisional directors. Owned the post-launch roadmap, prioritized by ROI.',
        lens: ['product', 'engineering'],
      },
      {
        text: 'Deployed it on the college’s on-prem SQL Server and Microsoft Entra tenant (SAML 2.0 SSO), replacing a $20K/year vendor tool for 4,000+ users. It takes 800 tickets a month from 143 departments.',
        lens: ['engineering'],
      },
      {
        text: '34 operators rated it 8/10, against 3/10 for the old tool.',
        lens: ['product'],
      },
      {
        text: 'Migrated six years of data and 6,000+ assets out of TopDesk and scattered Excel sheets with zero records silently dropped, logging every unmatched value to an audit trail.',
        lens: ['engineering'],
      },
      {
        text: 'Shipped a retrieval copilot over 33,000+ tickets from six years of history. Since AtlasDesk launched, average resolution across all tickets fell from 24 hours to about 15 minutes.',
        lens: ['product', 'engineering'],
      },
      {
        text: 'Built a read-only MCP server and AI agent in Microsoft Teams and Microsoft 365 Copilot that replaced engineer-written SQL reports for 4 department decision makers, and decided what it refuses: per-person stats and ticket text.',
        lens: ['product', 'engineering'],
      },
      {
        text: 'Ranked 50+ feature requests by ROI and shipped print-billing automation. Said no to an in-browser voicemail player: the college gets 5–6 voicemails a week, and technicians already check them at the desk phone.',
        lens: ['product'],
      },
      {
        text: 'Kept one codebase deployable to on-prem and SaaS from a single branch: a CI linter rejects PostgreSQL-only patterns, and a matrix release builds against PostgreSQL and SQL Server 2022.',
        lens: ['engineering'],
      },
    ],
  },
  {
    id: 'wooster',
    org: 'The College of Wooster',
    title: 'Helpdesk Technician',
    start: 'Jul 2025',
    end: 'Present',
    location: 'Wooster, OH',
    context: 'Scope grew from support into solution design and platform ownership.',
    highlights: [
      {
        text: 'Primary technical contact for 4,000+ faculty, staff, and students. Resolved 500+ support tickets at 90% satisfaction and turned recurring problems into AtlasDesk features.',
        lens: ['product', 'engineering'],
      },
      {
        text: 'Found 95% of my 500+ resolved tickets repeated a solved issue or an existing help article, and presented it to the 4 directors so technicians could shift that time to process fixes.',
        lens: ['product'],
      },
      {
        text: 'Wrote a one-run PowerShell pipeline on OSDCloud and Intune that images a laptop and leaves it login-ready. Per-machine setup dropped from hours to about 10 minutes across 200+ lab machines.',
        lens: ['engineering'],
      },
    ],
  },
  {
    id: 'schneider',
    org: 'Schneider Electric',
    title: 'Data Scientist Intern',
    start: 'May 2024',
    end: 'Jul 2024',
    location: 'Louisville, KY',
    highlights: [
      {
        text: 'Built an evaluation framework that benchmarked 13 LLMs across single- and multi-agent architectures, with GPT-4 as judge. Its results informed model selection for Schneider’s enterprise co-pilot.',
        lens: ['engineering', 'product'],
      },
      {
        text: 'Prototyped an LLM co-pilot (LlamaIndex, FastAPI) for plain-English questions over 250,000+ energy-data workflows, connected to 15+ enterprise tools.',
        lens: ['engineering'],
      },
    ],
  },
  {
    id: 'jomee',
    org: 'Jomee Jomaa Inc.',
    title: 'Software Engineer Intern',
    start: 'May 2023',
    end: 'Dec 2023',
    location: 'Remote',
    context: 'Fractional real-estate investment startup.',
    highlights: [
      {
        text: 'Owned the backend for cart, reservation, checkout, payment, and sell-back flows from API design through the v1.0 production launch.',
        lens: ['engineering'],
      },
      {
        text: 'Built automated bank-transfer reconciliation: OCR’d user receipts (English and Bangla) matched against DKIM-verified bank emails, settling payments within about a minute.',
        lens: ['engineering'],
      },
      {
        text: 'Prevented overselling with event-based unit locks: the first reservation held units for up to 24 hours, competing requests failed immediately, and unpaid holds released automatically.',
        lens: ['engineering', 'product'],
      },
    ],
  },
  {
    id: 'shiree',
    org: 'Shiree Pvt. Ltd.',
    title: 'Co-founder & Founding Engineer',
    start: 'May 2022',
    end: 'Apr 2023',
    location: 'Remote, Bangladesh',
    context: 'HR-tech startup. Five-person team.',
    highlights: [
      {
        text: 'Interviewed 8 Bangladeshi companies and found hiring ran on Google Forms, email, and unstandardized walk-in tests, making screening slow and often biased by gender or name.',
        lens: ['product'],
      },
      {
        text: 'Co-designed an ATS that ranked candidates by automated assessment and résumé-to-JD scores so HR picked the top 5. Won 3 of the interviewed companies as beta clients.',
        lens: ['product'],
      },
      {
        text: 'Built the backend in Django and integrated SSLCommerz payment processing as one of two technical co-founders.',
        lens: ['engineering'],
      },
    ],
  },
];

export const education = {
  school: 'The College of Wooster',
  degree: 'B.A. in Computer Science & Business Economics',
  honors: 'Departmental Honors in Computer Science',
  year: '2025',
};

export const leadership = [
  {
    name: 'Google Developer Student Club',
    detail: 'Co-Lead, 2024–2025. 68 members; ran 4 résumé and project workshops.',
  },
  {
    name: 'Stanford TreeHacks 2024',
    detail: 'Built GovAI, a multi-agent policy council.',
  },
  {
    name: 'Residential Assistant',
    detail: 'The College of Wooster, 2022–2024. Mentored 50+ residents.',
  },
];

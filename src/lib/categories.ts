import type { Tool } from "@/lib/tools";

export type CategorySlug = Tool["category"];

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  keywords: string[];
}

export const categoryMeta: CategoryMeta[] = [
  {
    slug: "dev",
    name: "Developer",
    title: "Free Online Developer Tools — JSON, Regex, JWT, SQL, Cron & More",
    description: "Format JSON, test regex, decode JWTs, build cron expressions, format SQL, and check HTTP status codes — free browser-based developer utilities.",
    longDescription: "Streamline your development workflow with free browser-based utilities. Format and validate JSON payloads, test regular expressions, decode JWT tokens, build cron schedules, format SQL queries, look up HTTP status codes, generate unique identifiers, encode and decode Base64, minify or beautify CSS, and check password entropy — all without leaving your browser or sending data to a server. Built for front-end and back-end developers who value speed and privacy.",
    icon: "🛠️",
    color: "blue",
    keywords: ["developer tools", "json formatter", "regex tester", "jwt decoder", "cron expression builder", "sql formatter", "http status codes", "uuid generator", "base64 encoder", "css minifier", "online dev tools", "free developer utilities"],
  },
  {
    slug: "seo",
    name: "SEO",
    title: "Free Online SEO Tools — Meta Tags, Sitemaps, Robots.txt & More",
    description: "Preview meta tags, generate sitemaps, build robots.txt, check canonical URLs, and analyze keyword density — free SEO tools for websites.",
    longDescription: "Improve your website's search engine visibility with practical SEO utilities. Preview how your pages appear in Google search results, generate XML sitemaps and robots.txt files, validate canonical URLs, check Open Graph tags for social sharing, and analyze keyword density. These tools help bloggers, marketers, and webmasters optimize their sites for higher rankings.",
    icon: "🔍",
    color: "purple",
    keywords: ["seo tools", "meta tag preview", "sitemap generator", "robots txt generator", "keyword density", "canonical checker", "free seo tools online"],
  },
  {
    slug: "text",
    name: "Text",
    title: "Free Online Text Tools — Word Counter, Lorem Ipsum, Text Cleaner",
    description: "Count words, estimate reading time, generate lorem ipsum, clean messy text, and create URL slugs — free text processing tools online.",
    longDescription: "Process and optimize your text content with fast browser-based utilities. Count words and characters, estimate reading time for blog posts, generate placeholder text, clean formatting from pasted content, and convert titles into SEO-friendly URL slugs. Perfect for writers, editors, content marketers, and anyone who works with text daily.",
    icon: "📝",
    color: "slate",
    keywords: ["text tools", "word counter", "reading time calculator", "lorem ipsum generator", "text cleaner", "content writing tools"],
  },
  {
    slug: "student",
    name: "Student",
    title: "Free Online Student Tools — GPA, Percentage, Attendance Calculator",
    description: "Calculate GPA, CGPA, percentages, attendance, exam countdowns, study plans, and more — free academic tools for students.",
    longDescription: "Manage your academic life with practical calculators and planners. Convert CGPA to percentage, track attendance rates, calculate age or date differences, set exam countdown timers, plan study sessions, and generate resume headlines. These tools help school and college students stay organized, track progress, and prepare for exams and career opportunities.",
    icon: "🎓",
    color: "emerald",
    keywords: ["student tools", "gpa calculator", "cgpa to percentage", "attendance calculator", "exam countdown", "study planner", "academic calculator online"],
  },
  {
    slug: "creator",
    name: "Creator",
    title: "Free Online Creator Tools — Hashtags, YouTube Chapters, Engagement, Captions & More",
    description: "Generate hashtags, YouTube chapters, engagement metrics, content calendars, posting-time plans, captions, and bios — free creator growth tools.",
    longDescription: "Grow your audience with smart content creation tools. Generate trending hashtags, analyze YouTube title effectiveness, build chapter timestamps, calculate engagement rates, create monthly content calendars, plan best posting times by audience region, generate campaign UTM links, write captions in multiple tones, build professional bios, preview thumbnail text, generate YouTube descriptions and tags, estimate video length, create viral hooks for Reels, and brainstorm content ideas. Built for YouTubers, Instagram creators, and social media marketers.",
    icon: "🎬",
    color: "pink",
    keywords: ["creator tools", "hashtag generator", "youtube chapter generator", "engagement rate calculator", "content calendar generator", "best time to post", "utm link builder", "youtube title analyzer", "caption generator", "bio generator", "content creator tools", "social media tools free"],
  },
  {
    slug: "image",
    name: "Image",
    title: "Free Online Image Tools — Compress, Resize, Convert, QR Code Generator",
    description: "Compress images, resize photos, convert JPG to PNG, generate QR codes and barcodes, encode Base64 — free image tools online.",
    longDescription: "Handle all your image tasks without installing software. Compress images to reduce file size, resize photos with aspect ratio control, convert between JPG and PNG formats, generate QR codes and barcodes, encode images to Base64, view image metadata, create favicons, and convert images to PDF. Fast, private, and runs entirely in your browser.",
    icon: "🖼️",
    color: "orange",
    keywords: ["image tools", "compress image online", "resize image", "jpg to png", "qr code generator", "image converter", "free image tools"],
  },
  {
    slug: "utility",
    name: "Utility",
    title: "Free Online Calculator Tools — EMI, GST, SIP, Currency & Unit Converter",
    description: "Calculate EMI, loan interest, GST, SIP returns, convert currencies, time zones, and units — free financial and utility calculators.",
    longDescription: "Simplify everyday calculations with practical financial and utility tools. Calculate EMI for home and car loans, compute GST with CGST/SGST breakdown, project SIP investment returns, convert currencies and time zones, transform measurement units, and use a full scientific calculator. These tools help professionals, students, and anyone who needs quick, accurate calculations.",
    icon: "🧮",
    color: "teal",
    keywords: ["emi calculator", "gst calculator", "sip calculator", "currency converter", "unit converter", "financial calculator", "free online calculator"],
  },
  {
    slug: "pdf",
    name: "PDF",
    title: "Free Online PDF Tools — Merge, Split, Extract Text & Protect",
    description: "Merge, split, extract text, protect, and unlock PDF files — completely free and secure browser-based tools.",
    longDescription: "Process your PDF files quickly and securely without uploading them to any server. Merge multiple PDFs into a single file, extract specific pages, convert PDF content to plain text, and secure your documents with passwords. Everything happens entirely in your browser, ensuring maximum privacy for sensitive documents.",
    icon: "📄",
    color: "red",
    keywords: ["pdf tools", "merge pdf", "split pdf", "pdf to text", "protect pdf", "unlock pdf", "free online pdf tools"],
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categoryMeta.find((c) => c.slug === slug);
}

export function getCategorySlugs(): CategorySlug[] {
  return categoryMeta.map((c) => c.slug);
}

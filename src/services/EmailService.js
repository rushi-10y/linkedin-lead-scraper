import { getDomainRoot } from "../utils/url.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const BAD_EMAIL_MARKERS = [
  "example.com",
  "sentry.io",
  "domain.com",
  "yourdomain.com",
  "email.com",
  "test.com",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg"
];

export class EmailService {
  extractEmails(text = "") {
    const candidates = String(text)
      .replace(/\s*\[at]\s*|\s+\(at\)\s+|\s+at\s+/gi, "@")
      .replace(/\s*\[dot]\s*|\s+\(dot\)\s+|\s+dot\s+/gi, ".")
      .match(EMAIL_REGEX) || [];

    return [...new Set(candidates.map((email) => this.cleanEmail(email)).filter((email) => this.isValidEmail(email)))];
  }

  generateBusinessEmails(website) {
    const domain = getDomainRoot(website);
    if (!domain) return [];

    return ["info", "contact", "hello", "support"].map((prefix) => `${prefix}@${domain}`);
  }

  merge({ extracted = [], generated = [] }) {
    return {
      emails: [...new Set(extracted.filter((email) => this.isValidEmail(email)))],
      generatedEmails: [...new Set(generated.filter((email) => this.isValidEmail(email)))]
    };
  }

  cleanEmail(email = "") {
    return email
      .toLowerCase()
      .trim()
      .replace(/^mailto:/, "")
      .replace(/[),;]+$/g, "");
  }

  isValidEmail(email = "") {
    if (!EMAIL_REGEX.test(email)) {
      EMAIL_REGEX.lastIndex = 0;
      return false;
    }
    EMAIL_REGEX.lastIndex = 0;

    if (email.length > 254) return false;
    return !BAD_EMAIL_MARKERS.some((marker) => email.includes(marker));
  }
}

const SOCIAL_HOSTS = {
  linkedin: ["linkedin.com"],
  facebook: ["facebook.com", "fb.com"],
  instagram: ["instagram.com"],
  x: ["x.com", "twitter.com"],
  youtube: ["youtube.com", "youtu.be"],
  tiktok: ["tiktok.com"]
};

export const normalizeUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return "";
    }
  }
};

export const getHostname = (value) => {
  try {
    return new URL(normalizeUrl(value)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export const getDomainRoot = (value) => {
  const hostname = getHostname(value);
  if (!hostname) return "";
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join(".");
};

export const sameDomain = (baseUrl, candidateUrl) => {
  const base = getDomainRoot(baseUrl);
  const candidate = getDomainRoot(candidateUrl);
  return Boolean(base && candidate && base === candidate);
};

export const toAbsoluteUrl = (baseUrl, href) => {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return "";
  }

  try {
    return new URL(href, normalizeUrl(baseUrl)).toString();
  } catch {
    return "";
  }
};

export const detectSocialPlatform = (value) => {
  const hostname = getHostname(value);
  if (!hostname) return "";

  return Object.entries(SOCIAL_HOSTS).find(([, hosts]) =>
    hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
  )?.[0] || "";
};

export const dedupeUrls = (urls) => [...new Set(urls.map(normalizeUrl).filter(Boolean))];

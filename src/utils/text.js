export const compactText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

export const normalizeBusinessName = (value = "") =>
  compactText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(llc|inc|ltd|limited|corp|corporation|co|company|pllc|pvt|private)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const normalizePhone = (value = "") => String(value).replace(/[^\d+]/g, "");

export const titleCase = (value = "") =>
  compactText(value)
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

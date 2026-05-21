import { env } from "../config/env.js";

export class LeadQualityService {
  scoreLead(lead) {
    let score = 0;
    const reasons = [];

    if (lead.website) {
      score += 25;
      reasons.push("has_website");
    } else {
      reasons.push("missing_website");
    }

    if (lead.linkedin?.url) {
      score += 25;
      reasons.push("has_linkedin");
    }

    if ((lead.emails || []).length > 0) {
      score += 20;
      reasons.push("verified_email_found");
    } else if ((lead.generatedEmails || []).length > 0) {
      score += 8;
      reasons.push("generated_email_patterns_only");
    } else {
      reasons.push("no_email_signal");
    }

    if ((lead.contactPages || []).length > 0) {
      score += 10;
      reasons.push("has_contact_page");
    }

    if ((lead.socialLinks || []).length > 0) {
      score += 8;
      reasons.push("has_social_links");
    }

    if ((lead.rating || 0) >= 4.2 && (lead.totalReviews || 0) >= env.LOW_QUALITY_MIN_REVIEWS) {
      score += 12;
      reasons.push("strong_google_rating");
    }

    if (
      lead.rating &&
      lead.rating < env.LOW_QUALITY_REVIEW_THRESHOLD &&
      (lead.totalReviews || 0) >= env.LOW_QUALITY_MIN_REVIEWS
    ) {
      score -= 18;
      reasons.push("weak_google_rating");
    }

    if ((lead.totalReviews || 0) === 0) {
      score -= 8;
      reasons.push("no_review_volume");
    }

    const normalizedScore = Math.max(0, Math.min(100, score));
    const tier = normalizedScore >= 70 ? "high" : normalizedScore >= 40 ? "medium" : "low";

    return {
      tier,
      score: normalizedScore,
      isLowQuality: tier === "low",
      reasons
    };
  }

  rankLeads(leads = []) {
    return leads
      .map((lead) => ({
        ...lead,
        quality: this.scoreLead(lead)
      }))
      .sort((a, b) => b.quality.score - a.quality.score);
  }

  chooseCrawlCandidates(leads = [], max = env.MAX_WEBSITES_TO_CRAWL) {
    return leads
      .filter((lead) => lead.website)
      .sort((a, b) => {
        const aReviews = a.totalReviews || 0;
        const bReviews = b.totalReviews || 0;
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        return bRating * 10 + bReviews / 50 - (aRating * 10 + aReviews / 50);
      })
      .slice(0, max);
  }
}

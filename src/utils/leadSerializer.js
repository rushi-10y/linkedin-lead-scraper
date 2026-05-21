export const toModelLead = (lead = {}) => ({
  businessName: lead.businessName,
  city: lead.city,
  industry: lead.industry,
  rating: lead.rating,
  totalReviews: lead.totalReviews,
  website: lead.website,
  phone: lead.phone,
  emails: lead.emails || [],
  generatedEmails: lead.generatedEmails || [],
  contactPages: (lead.contactPages || []).slice(0, 5),
  socialLinks: (lead.socialLinks || []).slice(0, 8),
  linkedin: lead.linkedin,
  quality: lead.quality,
  crawlStatus: lead.crawlStatus
});

export const summarizeLeads = (leads = [], max = 8) => ({
  count: leads.length,
  sample: leads.slice(0, max).map(toModelLead)
});

import fs from "node:fs/promises";
import path from "node:path";
import { createObjectCsvWriter } from "csv-writer";
import { env } from "../config/env.js";

export class CSVExportService {
  constructor({ exportDir = env.EXPORT_DIR } = {}) {
    this.exportDir = path.resolve(exportDir);
  }

  async exportLeads(leads = [], { jobId } = {}) {
    await fs.mkdir(this.exportDir, { recursive: true });
    const filename = `leads-${jobId || Date.now()}.csv`;
    const outputPath = path.join(this.exportDir, filename);

    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: [
        { id: "businessName", title: "Business Name" },
        { id: "address", title: "Address" },
        { id: "city", title: "City" },
        { id: "industry", title: "Industry" },
        { id: "rating", title: "Rating" },
        { id: "totalReviews", title: "Total Reviews" },
        { id: "latitude", title: "Latitude" },
        { id: "longitude", title: "Longitude" },
        { id: "website", title: "Website" },
        { id: "phone", title: "Phone" },
        { id: "emails", title: "Emails" },
        { id: "generatedEmails", title: "Generated Emails" },
        { id: "contactPages", title: "Contact Pages" },
        { id: "socialLinks", title: "Social Links" },
        { id: "linkedinUrl", title: "LinkedIn URL" },
        { id: "linkedinDescription", title: "LinkedIn Description" },
        { id: "employeeCount", title: "Employee Count" },
        { id: "qualityTier", title: "Quality Tier" },
        { id: "qualityScore", title: "Quality Score" },
        { id: "qualityReasons", title: "Quality Reasons" }
      ]
    });

    await csvWriter.writeRecords(leads.map((lead) => this.flattenLead(lead)));
    return {
      filename,
      path: outputPath,
      count: leads.length
    };
  }

  flattenLead(lead) {
    return {
      businessName: lead.businessName,
      address: lead.address,
      city: lead.city,
      industry: lead.industry,
      rating: lead.rating,
      totalReviews: lead.totalReviews,
      latitude: lead.latitude,
      longitude: lead.longitude,
      website: lead.website,
      phone: lead.phone,
      emails: (lead.emails || []).join("; "),
      generatedEmails: (lead.generatedEmails || []).join("; "),
      contactPages: (lead.contactPages || []).join("; "),
      socialLinks: (lead.socialLinks || []).map((link) => `${link.platform}:${link.url}`).join("; "),
      linkedinUrl: lead.linkedin?.url || "",
      linkedinDescription: lead.linkedin?.description || "",
      employeeCount: lead.linkedin?.employeeCount || "",
      qualityTier: lead.quality?.tier || "",
      qualityScore: lead.quality?.score ?? "",
      qualityReasons: (lead.quality?.reasons || []).join("; ")
    };
  }
}

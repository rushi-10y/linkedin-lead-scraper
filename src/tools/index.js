import { CSVExportService } from "../services/CSVExportService.js";
import { EmailService } from "../services/EmailService.js";
import { GoogleMapsService } from "../services/GoogleMapsService.js";
import { LeadQualityService } from "../services/LeadQualityService.js";
import { LinkedInService } from "../services/LinkedInService.js";
import { WebsiteCrawlerService } from "../services/WebsiteCrawlerService.js";
import { CSVExporterTool } from "./CSVExporterTool.js";
import { EmailExtractorTool } from "./EmailExtractorTool.js";
import { GoogleMapsTool } from "./GoogleMapsTool.js";
import { LinkedInTool } from "./LinkedInTool.js";
import { PersistLeadsTool } from "./PersistLeadsTool.js";
import { WebsiteCrawlerTool } from "./WebsiteCrawlerTool.js";

export const createToolRegistry = ({ mongoService } = {}) => {
  const emailService = new EmailService();
  const leadQualityService = new LeadQualityService();

  const tools = [
    new GoogleMapsTool({ googleMapsService: new GoogleMapsService() }),
    new WebsiteCrawlerTool({
      websiteCrawlerService: new WebsiteCrawlerService({ emailService }),
      leadQualityService
    }),
    new EmailExtractorTool({ emailService }),
    new LinkedInTool({ linkedInService: new LinkedInService() }),
    new PersistLeadsTool({ mongoService, leadQualityService }),
    new CSVExporterTool({ csvExportService: new CSVExportService() })
  ];

  return new Map(tools.map((tool) => [tool.name, tool]));
};

export const toolDefinitions = (registry) => [...registry.values()].map((tool) => tool.definition);

import { BaseTool } from "./BaseTool.js";

export class CSVExporterTool extends BaseTool {
  constructor({ csvExportService }) {
    super({
      name: "export_leads_csv",
      description: "Export the current saved leads to a CSV file automatically.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          usePersistedLeads: { type: "boolean" }
        },
        required: ["usePersistedLeads"]
      }
    });
    this.csvExportService = csvExportService;
  }

  async execute(input, context) {
    const leads = input.usePersistedLeads !== false
      ? context.state.persistedLeads || context.state.businesses || []
      : context.state.businesses || [];

    const result = await this.csvExportService.exportLeads(leads, { jobId: context.jobId });
    context.state.csv = result;

    return {
      ok: true,
      ...result
    };
  }
}

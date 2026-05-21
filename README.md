# AI Lead Generation Agent

Production-style autonomous lead research agent built with Node.js, Express.js, OpenAI tool calling, LangChain JS, MongoDB, Puppeteer, Axios, Cheerio, CSV Writer, and dotenv.

This is not an n8n workflow and does not use workflow automation execution logic. It is a real agent architecture: the LLM plans, calls tools, stores memory, evaluates quality, persists leads, and exports CSV.

## Features

- Accepts `keyword` and `location`
- Searches businesses with Google Maps Places API
- Cleans business name, address, city, industry, rating, reviews, coordinates, website, and phone
- Crawls business websites with Axios and Cheerio
- Extracts emails, contact pages, and social media links
- Generates possible emails: `info@`, `contact@`, `hello@`, `support@`
- Generates LinkedIn search queries automatically
- Searches LinkedIn company pages with Serper API
- Uses Puppeteer to scrape public LinkedIn company metadata
- Scores lead quality and prioritizes leads with website plus LinkedIn data
- Skips or updates duplicate companies through MongoDB fingerprints
- Stores durable agent memory and tool events in MongoDB
- Exports CSV automatically
- Includes logging, retries, rate limiting, and modular services/tools

## Folder Structure

```txt
src
  agents
    LeadResearchAgent.js
  config
    env.js
  controllers
    leadAgent.controller.js
  database
    MongoDBService.js
    models
      AgentRun.model.js
      Lead.model.js
  memory
    AgentMemory.js
  routes
    agent.routes.js
  services
    CSVExportService.js
    EmailService.js
    GoogleMapsService.js
    LeadQualityService.js
    LinkedInService.js
    OpenAIService.js
    WebsiteCrawlerService.js
  tools
    BaseTool.js
    CSVExporterTool.js
    EmailExtractorTool.js
    GoogleMapsTool.js
    LinkedInTool.js
    PersistLeadsTool.js
    WebsiteCrawlerTool.js
    index.js
  utils
    asyncHandler.js
    errors.js
    hash.js
    leadSerializer.js
    logger.js
    rateLimiter.js
    retry.js
    text.js
    url.js
  index.js
```

## Setup

```bash
npm install
cp .env.example .env
```

Fill in:

```env
OPENAI_API_KEY=
GOOGLE_MAPS_API_KEY=
SERPER_API_KEY=
MONGODB_URI=mongodb://127.0.0.1:27017/ai_lead_generation_agent
```

Start MongoDB locally or point `MONGODB_URI` to Atlas.

## Run

```bash
npm run agent:start
```

Development mode:

```bash
npm run agent:dev
```

Health check:

```bash
GET http://localhost:3000/health
```

## API

### Start Lead Research

```bash
POST http://localhost:3000/api/agents/lead-research
Content-Type: application/json

{
  "keyword": "dentists",
  "location": "Austin, TX",
  "limit": 10
}
```

The response includes `jobId`, metrics, a CSV path, and a lead sample.

### List Leads

```bash
GET http://localhost:3000/api/leads?jobId=<jobId>
```

### Get Agent Run Memory

```bash
GET http://localhost:3000/api/runs/<jobId>
```

### Download CSV

```bash
GET http://localhost:3000/api/exports/leads-<jobId>.csv
```

## How The Agent Works

`LeadResearchAgent` starts a durable run in MongoDB, builds an OpenAI tool-calling prompt, and stores short-term plus long-term memory through `AgentMemory`.

The reasoning loop works like this:

1. The model privately reasons about the next best action.
2. The model calls one or more tools, such as `google_maps_search` or `crawl_websites`.
3. The tool executes real code with retries and rate limits.
4. The result is summarized back into memory.
5. The agent continues until leads are persisted and exported.

The code also has a guarded completion path. If the model stops early, the agent still completes the minimum required sequence: discover businesses, crawl websites, extract/generate emails, enrich LinkedIn, persist to MongoDB, and export CSV.

## Tool System

Tools are plain JavaScript classes with OpenAI function schemas:

- `GoogleMapsTool`
- `WebsiteCrawlerTool`
- `EmailExtractorTool`
- `LinkedInTool`
- `PersistLeadsTool`
- `CSVExporterTool`

Each tool owns one production concern and delegates external API calls to reusable services.

## Memory System

Agent memory is stored in `AgentRun` documents:

- system/user/assistant/tool messages
- tool calls and output summaries
- decisions
- errors
- metrics
- final CSV file path

This gives you auditability for every autonomous run.

## MongoDB Schema

`Lead.model.js` stores:

- business profile fields
- website/contact enrichment
- LinkedIn enrichment
- generated email patterns
- quality score and reasons
- source list
- unique fingerprint for duplicate detection

`AgentRun.model.js` stores run state, memory, tool events, metrics, and output path.

## Notes

- Puppeteer scrapes only public LinkedIn company pages and does not log in or bypass access controls.
- Google Maps and Serper usage depends on your API quotas.
- CSV files are written to `exports/`.
- Logs are written to `logs/agent-combined.log` and `logs/agent-error.log`.

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import type { Env } from '../index';

type Params = {
    cardId: string;
    url: string;
    durableObjectId: string; // for the ActivityDO instance
}

export default class AiLinkProcessor extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    console.log('AILink workflow started for card:', event.payload.cardId);

    const scrapeResponse = await step.do('craw URL', async () => {
      // Check if url is cached in KV
      const cachedScrapeResponse = await this.env.KV.get(`v1/${event.payload.url}`);
      if (cachedScrapeResponse) {
        console.log('Cache hit for URL:', event.payload.url);
        return JSON.parse(cachedScrapeResponse) as ScrapeResponse;
      } else {
        console.log('Cache miss. Scraping URL:', event.payload.url);
      }

      // If not cached, fetch the page content using Firecrawl SDK
      const app = new FirecrawlApp({ apiKey: this.env.FIRECRAWL_API_KEY });
      const scrapeResponse = await app.scrapeUrl(event.payload.url, {
        formats: ['markdown', 'links']
      });
      if (!scrapeResponse.success) {
        throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
      }

      // Cache the result in KV
      await this.env.KV.put(`v1/${event.payload.url}`, JSON.stringify(scrapeResponse), {
        expirationTtl: 60 * 60 * 24 * 365, // 1 year in seconds
      });

      console.log('Crawled and cached URL:', event.payload.url);
      return scrapeResponse;
    });

    console.log('Site data fetched:', scrapeResponse);
  }
}

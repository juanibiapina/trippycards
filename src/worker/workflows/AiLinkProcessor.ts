import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import * as Sentry from "@sentry/cloudflare";
import FirecrawlApp from '@mendable/firecrawl-js';
import type { Env } from '../index';
import type { AILinkCard } from '../../shared';

type Params = {
    cardId: string;
    url: string;
    durableObjectId: string; // for the ActivityDO instance
}

export default class AiLinkProcessor extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    console.log('AILink workflow started for card:', event.payload.cardId);

    const siteData = await step.do('craw URL', async () => {
      // Check if url is cached in KV
      const cachedSiteData = await this.env.KV.get(`v1/${event.payload.url}`);
      if (cachedSiteData) {
        console.log('Cache hit for URL:', event.payload.url);
        return JSON.parse(cachedSiteData);
      } else {
        console.log('Cache miss. Crawling URL:', event.payload.url);
      }

      // If not cached, fetch the page content using Firecrawl SDK
      const app = new FirecrawlApp({ apiKey: this.env.FIRECRAWL_API_KEY });
      const scrapeResult = await app.scrapeUrl(event.payload.url, {
        formats: ['markdown', 'links']
      });
      if (!scrapeResult.success) {
        throw new Error(`Failed to scrape: ${scrapeResult.error}`);
      }

      // Cache the result in KV
      await this.env.KV.put(`v1/${event.payload.url}`, JSON.stringify(scrapeResult), {
        expirationTtl: 60 * 60 * 24 * 365, // 1 year in seconds
      });

      console.log('Crawled and cached URL:', event.payload.url);
      return scrapeResult;
    });

    console.log('Site data fetched:', siteData);
  }
}

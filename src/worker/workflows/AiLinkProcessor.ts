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

    const scrapeResponse = await step.do('crawl URL', () => this.crawlUrl(event.payload.url));

    await step.do('update AI link card with metadata', () =>
      this.updateCardWithMetadata(event.payload.cardId, event.payload.durableObjectId, scrapeResponse)
    );
  }

  private async crawlUrl(url: string): Promise<ScrapeResponse> {
    // Check if url is cached in KV
    const cachedScrapeResponse = await this.env.KV.get(`v1/${url}`);
    if (cachedScrapeResponse) {
      console.log('Cache hit for URL:', url);
      return JSON.parse(cachedScrapeResponse) as ScrapeResponse;
    } else {
      console.log('Cache miss. Scraping URL:', url);
    }

    // If not cached, fetch the page content using Firecrawl SDK
    const app = new FirecrawlApp({ apiKey: this.env.FIRECRAWL_API_KEY });
    const scrapeResponse = await app.scrapeUrl(url, {
      formats: ['markdown', 'links']
    });
    if (!scrapeResponse.success) {
      throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
    }

    // Cache the result in KV
    await this.env.KV.put(`v1/${url}`, JSON.stringify(scrapeResponse), {
      expirationTtl: 60 * 60 * 24 * 365, // 1 year in seconds
    });

    console.log('Crawled and cached URL:', url);
    return scrapeResponse;
  }

  private async updateCardWithMetadata(cardId: string, durableObjectId: string, scrapeResponse: ScrapeResponse): Promise<void> {
    // Extract title and description from scraped metadata
    const metadata = scrapeResponse.metadata;

    // Extract title - try different sources in order of preference
    let title = metadata?.title ||
                metadata?.ogTitle ||
                metadata?.twitterTitle ||
                'Untitled';

    // Extract description - try different sources in order of preference
    let description = metadata?.description ||
                     metadata?.ogDescription ||
                     metadata?.twitterDescription ||
                     'No description available';

    // Truncate if too long
    if (title.length > 100) {
      title = title.substring(0, 97) + '...';
    }

    if (description.length > 300) {
      description = description.substring(0, 297) + '...';
    }

    console.log('Extracted metadata:', { title, description });

    // Get the ActivityDO instance
    const activityDOId = this.env.ACTIVITYDO.idFromString(durableObjectId);
    const activityDO = this.env.ACTIVITYDO.get(activityDOId);

    // Update only the specific fields on the card via RPC
    await activityDO.updateCardFields(cardId, {
      title: title,
      description: description,
      status: 'completed'
    });

    console.log(`Successfully updated AI Link Card ${cardId} with metadata`);
  }
}
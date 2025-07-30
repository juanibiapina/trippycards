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

    try {
      // Step 1: Fetch page content using Firecrawl SDK
      const pageContent = await step.do('fetch-page-content', async () => {
        console.log('Fetching page content from:', event.payload.url);

        const app = new FirecrawlApp({ apiKey: this.env.FIRECRAWL_API_KEY });

        const scrapeResult = await app.scrapeUrl(event.payload.url, {
          formats: ['markdown', 'html']
        });

        if (!scrapeResult.success) {
          throw new Error(`Failed to scrape: ${scrapeResult.error}`);
        }

        return scrapeResult;
      });

      console.log('AILink workflow completed with page content:', pageContent);
    } catch (error) {
      console.error('AILink workflow failed for card:', event.payload.cardId, error);

      // Report error to Sentry
      Sentry.captureException(error, {
        extra: {
          cardId: event.payload.cardId,
          url: event.payload.url,
          durableObjectId: event.payload.durableObjectId,
          workflowInstance: 'AiLinkProcessor',
        },
      });

      // Update the card status to error
      await this.updateCardStatus(event.payload, 'error');

      // Re-throw the error to ensure the workflow is marked as failed
      throw error;
    }
  }

  private async updateCardStatus(params: Params, status: 'processing' | 'completed' | 'error') {
    try {
      // Get the ActivityDO instance
      const durableObjectId = this.env.ACTIVITYDO.idFromString(params.durableObjectId);
      const activityDO = this.env.ACTIVITYDO.get(durableObjectId);

      // Create the updated card
      const updatedCard: AILinkCard = {
        id: params.cardId,
        type: 'ailink',
        url: params.url,
        status: status,
        createdAt: new Date().toISOString(), // This will be overridden by the actual card data
        updatedAt: new Date().toISOString(),
      };

      // Send a POST request to update the card
      await activityDO.fetch(new Request('https://dummy', {
        method: 'POST',
        body: JSON.stringify({
          type: 'card-update',
          card: updatedCard,
        }),
      }));

      console.log(`Updated card ${params.cardId} status to ${status}`);
    } catch (updateError) {
      console.error('Failed to update card status:', updateError);
      // Report this secondary error to Sentry as well
      Sentry.captureException(updateError, {
        extra: {
          originalAction: 'updateCardStatus',
          cardId: params.cardId,
          targetStatus: status,
        },
      });
    }
  }
}

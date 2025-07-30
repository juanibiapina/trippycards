import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';

type Params = {
    cardId: string;
    url: string;
    durableObjectId: string; // for the ActivityDO instance
}

export default class AiLinkProcessor extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    console.log('AILink workflow started for card:', event.payload.cardId);

    // Skeleton implementation
    await step.do('process-ailink-skeleton', async () => {
      console.log('Processing AILink card:', {
        cardId: event.payload.cardId,
        url: event.payload.url,
        durableObjectId: event.payload.durableObjectId,
      });
    });

    console.log('AILink workflow completed:');
  }
}
# Async jobs for processing AILink card

Part of: [Use AI to suggest cards based on a URL](../tickets/2025-07-29-ai-suggest-cards-from-url.md)

## Cloudflare Workflow

- [ ] trigger workflow from worker
- [ ] Fetch page content using Firecrawl
- [ ] Prompt AI Worker to generate cards for the content
- [ ] Add created cards as children of the `AILink` card (needs Durable Object ID to act on)

### Trigger workflow from worker

**Implementation:** `src/worker/ActivityDO.ts` - `addCard` method

When an `AILink` card is created through the existing card creation flow, we need to trigger a Cloudflare Workflow to process it asynchronously. This will be implemented by:

1. **Modifying the `addCard` method** in `ActivityDO.ts` to detect when an `AILink` card is being added
2. **Adding a Workflow binding** to `wrangler.json` for the AILink processing workflow
3. **Creating the workflow instance** with the card data and activity context:
   ```typescript
   if (card.type === 'ailink') {
     await this.env.AILINK_WORKFLOW.create({
       id: crypto.randomUUID(),
       params: {
         cardId: card.id,
         activityId: this.activityId,
         url: (card as AILinkCard).url,
         durableObjectId: this.ctx.id.toString()
       }
     });
   }
   ```
4. **Environment binding** will need to be added to `Env` interface in `src/worker/index.ts`

### Fetch page content using Firecrawl

**Implementation:** New Cloudflare Workflow class in `src/worker/workflows/AiLinkProcessor.ts`

This will be the first step in the workflow that extracts content from the provided URL using Firecrawl service:

1. **Create WorkflowEntrypoint class** extending the Cloudflare Workflows base class
2. **Implement step.do** for content fetching:
   ```typescript
   const pageContent = await step.do('fetch-page-content', async () => {
     const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${this.env.FIRECRAWL_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         url: event.payload.url,
         pageOptions: {
           includeHtml: false,
           includeMarkdown: true
         }
       })
     });
     return await firecrawlResponse.json();
   });
   ```
3. **Environment variables** `FIRECRAWL_API_KEY` will need to be added to worker configuration
4. **Error handling** for failed scraping attempts with appropriate retries

### Prompt AI Worker to generate cards for the content

**Implementation:** Second step in the same workflow class

Using Cloudflare's AI binding to generate card suggestions based on the scraped content:

1. **AI prompt engineering** to generate structured card data:
   ```typescript
   const generatedCards = await step.do('generate-cards', async () => {
     const prompt = `Based on the following content, suggest 3-5 travel cards that would be useful for trip planning. 
     Content: ${pageContent.data.markdown}
     
     Respond with a JSON array of cards, each with:
     - type: "link" | "poll" 
     - title: string
     - description: string
     - url?: string (for link cards)
     - options?: string[] (for poll cards)`;

     const aiResponse = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
       messages: [{ role: 'user', content: prompt }],
       response_format: { type: 'json_object' }
     });

     return JSON.parse(aiResponse.response);
   });
   ```
2. **AI binding** `AI` will be used from the worker environment
3. **Structured output** validation to ensure generated cards match expected schema
4. **Fallback handling** if AI generation fails or produces invalid output

### Add created cards as children of the AILink card

**Implementation:** Multiple steps in workflow, interfacing back with `ActivityDO`

The workflow needs to add the generated cards to the activity and link them to the parent AILink card. This is broken into multiple steps for better durability:

1. **Get Durable Object instance** and validate connection:
   ```typescript
   const activityDO = await step.do('get-activity-do-instance', async () => {
     const stub = this.env.ACTIVITYDO.idFromString(event.payload.durableObjectId);
     const activityDO = this.env.ACTIVITYDO.get(stub);
     
     // Validate the DO is accessible and the parent card exists
     // This ensures we fail fast if there are connection issues
     await activityDO.validateCardExists(event.payload.cardId);
     
     return { activityDO, validated: true };
   });
   ```

2. **Add each generated card individually** for better error recovery:
   ```typescript
   for (let i = 0; i < generatedCards.length; i++) {
     const cardResult = await step.do(`add-generated-card-${i}`, async () => {
       const cardData = generatedCards[i];
       const newCard = {
         id: crypto.randomUUID(),
         ...cardData,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
       };

       // Direct RPC call to the ActivityDO method to add card as child
       await activityDO.activityDO.addCard(event.payload.cardId, newCard);
       
       return { 
         cardId: newCard.id, 
         cardType: newCard.type,
         addedAt: new Date().toISOString()
       };
     });
   }
   ```

3. **Update AILink card status** as final step:
   ```typescript
   await step.do('update-ailink-status', async () => {
     // Update AILink card status to completed using direct RPC call
     // Note: This requires adding a method to ActivityDO for partial updates
     await activityDO.activityDO.updateCardStatus(event.payload.cardId, 'completed');
     
     return {
       parentCardId: event.payload.cardId,
       status: 'completed',
       completedAt: new Date().toISOString()
     };
   });
   ```

2. **Card hierarchy** will need to be implemented in the data model - AILink cards contain an array of `children`
3. **Direct method calls** using the existing `addCard()` method and a new `updateCardStatus()` method in `ActivityDO`
4. **New ActivityDO methods** needed:
   - `validateCardExists(cardId: string)` to check if parent card exists before processing
   - `updateCardStatus(cardId: string, status: string)` to update card status efficiently
5. **Status updates** to change AILink card from 'processing' to 'completed' (or error if workflow fails completely)
6. **Real-time updates** via WebSocket broadcast to notify connected clients
7. **Error handling benefits**: If adding individual cards fails, only those cards need to be retried, not the entire batch
8. **State persistence**: Each step returns meaningful state that can be used for debugging and monitoring

## Configuration Requirements

**Wrangler Configuration** (`wrangler.json`):
```json
{
  "workflows": [{
    "name": "ailink-processor",
    "binding": "AILINK_WORKFLOW", 
    "class_name": "AiLinkProcessor"
  }],
  "ai": {
    "binding": "AI"
  }
}
```

**Environment Variables:**
- `FIRECRAWL_API_KEY`: API key for Firecrawl service
- Durable Object bindings: `ACTIVITYDO`

## Resources

- https://developers.cloudflare.com/workflows/get-started/guide/
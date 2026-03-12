# Drafts App Setup

Use this guide if you want to send quick-post drafts from Drafts on iPhone or Mac into iGRAIL.

## What This Feature Does

The Drafts action sends text to `/api/webhooks/quick-post`. The server stores the post as a draft so an editor can review it before publication.

That review step is intentional. Fast capture should not automatically bypass editorial control.

## Prerequisite

Set `QUICK_POST_SECRET` in `.env.local`.

Generate a token with:

```bash
openssl rand -hex 32
```

## Drafts Action Script

Replace the placeholder values before using it.

```javascript
const WEBHOOK_URL = "https://your-domain.example/api/webhooks/quick-post";
const SECRET_TOKEN = "YOUR_SECRET_TOKEN_HERE";

const response = HTTP.create().request({
  url: WEBHOOK_URL,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-quick-post-token": SECRET_TOKEN
  },
  data: {
    content: draft.content
  }
});

if (response.success && response.statusCode === 201) {
  app.displaySuccessMessage("Posted to iGRAIL");
} else {
  app.displayErrorMessage("Post failed: " + response.statusCode);
  context.fail();
}
```

## Testing The Webhook

```bash
curl -X POST http://localhost:3000/api/webhooks/quick-post \
  -H "Content-Type: application/json" \
  -H "x-quick-post-token: YOUR_SECRET_TOKEN" \
  -d '{"content":"Drafts smoke test #drafts"}'
```

## What Success Looks Like

- the API returns `201`
- the post is stored as a draft
- the draft appears in the admin quick-post flow

## Teaching Note

This integration is a good example of a narrow webhook boundary:

- one secret
- one endpoint
- one constrained payload
- one clear editorial outcome

That simplicity is deliberate. The smaller the surface, the easier it is to reason about security and failure modes.

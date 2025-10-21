import createApiHandler from '@genkit-ai/next';
import '@/ai/flows/generate-civic-issue-report';
import '@/ai/flows/summarize-civic-issue-reports';
import '@/ai/flows/generate-image-fingerprint';
import '@/ai/flows/send-status-update-notification';

// The genkit Next helper has a typed signature that expects an Action argument.
// The project registers flows via side-effect imports above, so call the
// factory and cast to any to avoid TypeScript signature mismatch while
// preserving the runtime behavior from the library.
const handler = (createApiHandler as unknown as any)();
export default handler;

import createApiHandler from '@genkit-ai/next';
import '@/ai/flows/generate-civic-issue-report';
import '@/ai/flows/summarize-civic-issue-reports';
import '@/ai/flows/generate-image-fingerprint';
import '@/ai/flows/send-status-update-notification';

// The genkit Next helper has a typed signature that expects an Action argument.
// The project registers flows via side-effect imports above, so call the
// factory and cast to any to avoid TypeScript signature mismatch while
// preserving the runtime behavior from the library.
const api = (createApiHandler as unknown as any)();

// Export the common HTTP method handlers as named exports so the Next app
// router typings recognize the route's shape. We export a superset of
// possible handlers; if a method isn't implemented by genkit it will be
// undefined which is acceptable for Next's route module typing.
export const GET = api.GET;
export const POST = api.POST;
export const PUT = api.PUT;
export const PATCH = api.PATCH;
export const DELETE = api.DELETE;
export const OPTIONS = api.OPTIONS;
export const HEAD = api.HEAD;

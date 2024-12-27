import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
  return new Response('{"telesur": "telesur"}');
}

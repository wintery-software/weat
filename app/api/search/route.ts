export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const type = params.get('type') || 'unknown';
  const query = params.get('q');

  if (query && query.length > 10) {
    return Response.json({});
  }

  return Response.json({ [type]: [{ id: 1, name: query }] });
}

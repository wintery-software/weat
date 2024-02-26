import { BadRequest } from '@/lib/response';
import { search } from '@/lib/search';
import { isEmpty } from 'lodash';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const query = params.get('q')?.trim();
  const limit = Number(params.get('limit'));

  if (!query) {
    return BadRequest('Query cannot be empty');
  }

  if (limit < 0) {
    return BadRequest('Limit cannot be negative');
  }

  if (Number.isNaN(limit)) {
    return BadRequest('Limit must be a number');
  }

  const result = Object.fromEntries(
    Object.entries(await search(query))
      // Remove empty entries
      .filter(([_, v]) => !isEmpty(v))
      .splice(0, limit || Infinity),
  );

  return Response.json(result);
}

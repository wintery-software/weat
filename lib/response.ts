export const MessageResponse = (message: string) => Response.json({ message });

export const ErrorResponse = (error: string, status: number) =>
  Response.json({ error }, { status });

export const BadRequest = (error: string) => ErrorResponse(error, 400);

export const Unauthorized = (error: string) => ErrorResponse(error, 401);

export const Forbidden = (error: string) => ErrorResponse(error, 403);

export const NotFound = (error: string) => ErrorResponse(error, 404);

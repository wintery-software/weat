import { constants } from 'node:http2';

export const MessageResponse = (message: string) => Response.json({ message });

export const ErrorResponse = (error: string, status: number) =>
  Response.json({ error }, { status });

export const BadRequest = (error: string) =>
  ErrorResponse(error, constants.HTTP_STATUS_BAD_REQUEST);

export const Unauthorized = (error: string) =>
  ErrorResponse(error, constants.HTTP_STATUS_UNAUTHORIZED);

export const Forbidden = (error: string) =>
  ErrorResponse(error, constants.HTTP_STATUS_FORBIDDEN);

export const NotFound = (error: string) =>
  ErrorResponse(error, constants.HTTP_STATUS_NOT_FOUND);

export const InternalServerError = (error: string) =>
  ErrorResponse(error, constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);

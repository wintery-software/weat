import { NextResponse } from "next/server";

type Extract<T> = T extends NextResponse<infer U> ? U : never;

/**
 * Extracts the JSON data type from a route function's response without some unwanted types.
 * @param F - The route function.
 * @param E - The error type.
 * @example
 * ```ts
 * type RestaurantsCountGetData = SuccessFromRoute<typeof GET, { error: string }>;
 * ```
 */
type SuccessFromRoute<F extends (...args: any[]) => any, E> = Extract<
  Exclude<Awaited<ReturnType<F>>, NextResponse<E>>
>;

/**
 * Extracts the JSON data type from a route function's response without the error type: `{ error: string }`.
 * @param F - The route function.
 * @example
 * ```ts
 * type RestaurantsCountGetData = SuccessWithoutErrorFromRoute<typeof GET>;
 * ```
 */
type SuccessWithoutErrorFromRoute<F extends (...args: any[]) => any> =
  SuccessFromRoute<F, { error: string }>;

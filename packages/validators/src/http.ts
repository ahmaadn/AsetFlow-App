import z from 'zod';

type AnyZod = z.ZodTypeAny;
type OrUnknown<T extends AnyZod | undefined> = T extends AnyZod
  ? T
  : z.ZodUnknown;

export type HttpInit<
  B extends AnyZod | undefined = undefined,
  Q extends AnyZod | undefined = undefined,
  P extends AnyZod | undefined = undefined,
> = {
  body?: B;
  query?: Q;
  params?: P;
};

/**
 * Helper untuk membungkus schema ke bentuk HTTP (Express middleware).
 * Jika bagian (body/query/params) tidak disediakan, akan diisi z.unknown()
 * agar tetap lolos validasi dengan nilai apa pun.
 */
export const http = <
  B extends AnyZod | undefined = undefined,
  Q extends AnyZod | undefined = undefined,
  P extends AnyZod | undefined = undefined,
>({
  body,
  query,
  params,
}: HttpInit<B, Q, P>) =>
  z.object({
    body: (body ?? z.unknown()) as OrUnknown<B>,
    query: (query ?? z.unknown()) as OrUnknown<Q>,
    params: (params ?? z.unknown()) as OrUnknown<P>,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ShapeOf<T extends z.ZodObject<any>> =
  T extends z.ZodObject<infer S> ? S : never;

export type HttpSchema<
  B extends AnyZod | undefined = undefined,
  Q extends AnyZod | undefined = undefined,
  P extends AnyZod | undefined = undefined,
> = z.ZodObject<{
  body: OrUnknown<B>;
  query: OrUnknown<Q>;
  params: OrUnknown<P>;
}>;

export type InferHttp<
  T extends z.ZodObject<{ body: AnyZod; query: AnyZod; params: AnyZod }>,
> = {
  [K in keyof ShapeOf<T>]: z.infer<ShapeOf<T>[K]>;
};

export type InputHttp<
  T extends z.ZodObject<{ body: AnyZod; query: AnyZod; params: AnyZod }>,
> = {
  [K in keyof ShapeOf<T>]: z.input<ShapeOf<T>[K]>;
};

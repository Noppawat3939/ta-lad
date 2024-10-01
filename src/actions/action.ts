import { ZodType, z } from "zod";

export const formSchemaAction = <
  Schema extends ZodType<object, any, any>,
  FormValues extends z.infer<Schema>
>(
  schema: Schema,
  formValues: FormValues | object,
  cb: (
    params: z.SafeParseReturnType<z.infer<Schema>, {} & z.infer<Schema>>
  ) => void
) => {
  const parsedResult = schema.safeParse(
    Object.fromEntries(Object.entries(formValues))
  );

  if (parsedResult.success) return cb(parsedResult);

  return parsedResult.error.formErrors.fieldErrors as Record<
    keyof FormValues,
    string[] | undefined
  >;
};

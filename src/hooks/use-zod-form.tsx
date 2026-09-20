import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from "react-hook-form";
import { type z, type ZodType } from "zod";

export function useZodForm<TSchema extends ZodType<unknown, FieldValues>>(
  props: Omit<
    UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>,
    "resolver"
  > & {
    schema: TSchema;
  },
) {
  const form = useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    ...props,
    resolver: zodResolver(props.schema, undefined) as unknown as Resolver<
      z.input<TSchema>,
      unknown,
      z.output<TSchema>
    >,
  });

  return form;
}

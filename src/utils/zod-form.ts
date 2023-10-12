import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ZodType } from "zod";

import type { UseFormProps } from "react-hook-form";

export const useZodForm = <TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) => {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
};
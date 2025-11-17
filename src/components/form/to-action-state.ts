import { flattenError, ZodError } from "zod";

export type FieldErrors = Record<string, string[]>;

export type ActionState = {
  message: string;
  fieldErrors?: FieldErrors;
  payload?: FormData;
};

export const fromErrorToActionState = (
  error: unknown,
  formData: FormData,
): ActionState => {
  if (error instanceof ZodError) {
    // if validation error with Zod, return first error message
    return {
      message: "",
      fieldErrors: flattenError(error).fieldErrors,
      payload: formData,
    };
  } else if (error instanceof Error) {
    //if another error instance, return error message
    // e.g. database error
    return { message: error.message, fieldErrors: {}, payload: formData };
  } else {
    // if not an error instance but something else crashed
    // return generic error message
    return {
      message: "An unknown error ocurred",
      fieldErrors: {},
      payload: formData,
    };
  }
};

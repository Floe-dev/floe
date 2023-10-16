import Ajv from "ajv";
import schema from "../schema.json";

export const validate = (data: any) => {
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  const valid = validateFn(data);

  if (!validateFn(data)) {
    return {
      valid: false,
      errors: validateFn.errors,
    };
  }

  return {
    valid,
    errors: [],
  };
};

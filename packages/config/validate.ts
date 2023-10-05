import Ajv from "ajv";
import { schema } from "./schema.module";

export const validate = (data: any) => {
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  return validateFn(data);
};

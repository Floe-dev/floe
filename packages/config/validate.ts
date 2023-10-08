import Ajv from "ajv";
import schema from "./schema.json";

export const validate = (data: any) => {
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  return validateFn(data);
};

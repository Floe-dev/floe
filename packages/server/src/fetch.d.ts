// Based on https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1579620256

import {
  type FormData as FormDataType,
  type Headers as HeadersType,
  type Request as RequestType,
  type Response as ResponseType,
} from "undici";

declare global {
  // Re-export undici fetch function and various classes to global scope.
  // These are classes and functions expected to be at global scope according to Node.js v18 API
  // documentation.
  // See: https://nodejs.org/dist/latest-v18.x/docs/api/globals.html
  // eslint-disable-next-line no-var
  export var { FormData, Headers, Request, Response, fetch }: typeof import("undici");

  type FormData = FormDataType;
  type Headers = HeadersType;
  type Request = RequestType;
  type Response = ResponseType;
}

// NOTE: the import in the global block above needs to be a var for this to work properly.
globalThis.fetch = fetch;
globalThis.FormData = FormData;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;

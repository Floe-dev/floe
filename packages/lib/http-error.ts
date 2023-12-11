type StatusCode = 400 | 401 | 403 | 404 | 405 | 500 | 501 | 502 | 503 | 504;

export class HttpError extends Error {
  public readonly statusCode: StatusCode;
  public readonly message: string;

  constructor(opts: { statusCode: StatusCode; message: string }) {
    super(opts.message);

    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = HttpError.prototype.constructor.name;

    this.statusCode = opts.statusCode;
    this.message = opts.message;
  }
}

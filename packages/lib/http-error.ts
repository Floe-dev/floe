type StatusCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 429
  | 500
  | 501
  | 502
  | 503
  | 504;

export class HttpError extends Error {
  public readonly statusCode: StatusCode;
  public readonly message: string;
  public readonly log: boolean;

  constructor(opts: {
    statusCode: StatusCode;
    message: string;
    log?: boolean;
  }) {
    super(opts.message);

    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = HttpError.prototype.constructor.name;

    this.statusCode = opts.statusCode;
    this.message = opts.message;
    this.log = opts.log || false;
  }
}

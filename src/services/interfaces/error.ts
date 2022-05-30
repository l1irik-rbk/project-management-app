export type ResponseError = {
  statusCode: number;
  message: string;
};

export type ResponseErrorWithFieldError = ResponseError & {
  error: string;
};

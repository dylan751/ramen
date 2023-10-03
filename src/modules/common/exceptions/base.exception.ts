import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

export enum ErrorId {
  CAN_NOT_DISABLE_LAST_ADMIN = 'can_not_disable_last_admin',
}

/**
 * Use an instance of this class to return an error response with errorId to client.
 * The client may use the errorId to display i18n message so be specific.
 */
export class BaseException extends HttpException {
  errorId: ErrorId;

  constructor(
    message: string | Record<string, any>,
    errorId: ErrorId | null,
    status: number,
  ) {
    super(message, status);

    this.errorId = errorId;
  }
}

/**
 * List exception classes
 */

export class CanNotDisableTheLastAdminException extends BaseException {
  constructor(message: string) {
    super(
      message,
      ErrorId.CAN_NOT_DISABLE_LAST_ADMIN,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export interface AxiosExceptionContext {
  request: {
    pathname: URL['pathname'];
    query: Record<string, [string]>;
    params?: AxiosRequestConfig['params'];
    method?: AxiosRequestConfig['method'];
    url?: AxiosRequestConfig['url'];
    payload: any;
  };
  stack?: string;
}

export class AxiosException extends BaseException {
  private context: AxiosExceptionContext;

  constructor(
    message: string,
    errorId: ErrorId,
    status: number,
    context: AxiosExceptionContext,
  ) {
    super(message, errorId, status);

    this.context = context;
  }
}

import { Response } from 'express';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { GenericResponse } from './generic-response';
import { AuthToolsService } from '../helpers/auth-helper';

export abstract class BaseController {
  sendResponse(
    response: Response,
    statusCode: HttpStatus,
    content?: any,
    ignoreInterceptor?: boolean,
  ) {
    if (!content)
      content = new GenericResponse(
        statusCode >= HttpStatus.OK && statusCode < HttpStatus.AMBIGUOUS,
        '',
      );
    if (ignoreInterceptor) {
      response.header(
        'access-control-expose-headers',
        'nxs-ignore-interceptor',
      );
      response.header('nxs-ignore-interceptor', 'true');
    }
    return response.status(statusCode).send(content);
  }

  sendResponseOk(
    response: Response,
    content?: any,
    ignoreInterceptor?: boolean,
  ) {
    return this.sendResponse(
      response,
      HttpStatus.OK,
      ignoreInterceptor,
      content,
    );
  }
  sendResponseNotFound(
    response: Response,
    message?: string,
    ignoreInterceptor?: boolean,
  ) {
    if (!message) message = 'Not Found';
    return this.sendResponse(
      response,
      HttpStatus.NOT_FOUND,
      new GenericResponse(false, message),
      ignoreInterceptor,
    );
  }
  sendResponseInternalServerError(
    response: Response,
    message?: string,
    ignoreInterceptor?: boolean,
  ) {
    if (!message) message = 'Error';
    return this.sendResponse(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      new GenericResponse(false, message),
      ignoreInterceptor,
    );
  }

  checkUserPayload(authTool: AuthToolsService) {
    const payload = authTool.getCurrentPayload(false);
    if (!payload || !payload.id)
      throw new UnauthorizedException("Vous n'êtes pas connecté.");
    else return payload;
  }
}

import { HttpException } from '@nestjs/common';

export const WriteResponse = (
  statusCode: number,
  data: any = null,
  message: string = '',
) => {
  const defaultMessages = {
    200: 'Success',
    400: 'Bad Request',
    404: 'Record Not Found',
    403: 'Already Exists',
    500: 'Internal Server Error',
  };

  return {
    statusCode,
    message: message || defaultMessages[statusCode] || 'Unknown Error',
    ...(data !== null && { data }),
  };
};

export const paginateResponse = (list: any[], count: number, total?: number) => {
  return {
    statusCode: list.length ? 200 : 404,
    message: list.length ? 'Success' : 'No records found.',
    data: list,
    count,
    ...(total !== undefined && { total }),
  };
};

// export const paginateResponse = (list: any, count: number,total?:number): any => {
//   return {
//     statusCode: list.length ? 200 : 400,
//     message: list.length ? 'Success' : 'Record not found.',
//     data: list,total,
//     count,
//   }
// };

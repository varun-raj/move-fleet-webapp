/* eslint-disable @typescript-eslint/no-explicit-any */
export const dateToISOString = (obj: any): any => {
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, dateToISOString(value)]));
  }
  return obj;
}
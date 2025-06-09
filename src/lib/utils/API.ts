/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import qs from 'qs'

const handleError = (error: AxiosError<{ message?: string, error?: string }>) => {
  if (error.response) {
    throw new Error(error?.response?.data?.message || error?.response?.data?.error || 'An unknown error occurred')
  }
  throw error
}

export default class API {
  static setHeaders(headers: Record<string, string> = {}): Record<string, string> {
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      ...headers,
    }
    return {
      ...axios.defaults.headers.common,
      ...headers,
    } as Record<string, string>
  }

  static get(
    route: string,
    params: any = {},
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'GET', otherOptions)
  }

  static put(
    route: string,
    params: any = {},
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'PUT', otherOptions)
  }

  static post(
    route: string,
    params: any = {},
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'POST', otherOptions)
  }

  static postWithForm(
    route: string,
    params: any = {},
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, qs.stringify(params), 'POST', {
      ...otherOptions,
      headers: {
        ...(otherOptions.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  static postWithFiles(
    route: string,
    params: FormData,
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'POST', {
      ...otherOptions,
      headers: {
        ...(otherOptions.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  static putWithFiles(
    route: string,
    params: FormData,
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'PUT', {
      ...otherOptions,
      headers: {
        ...(otherOptions.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  static delete(
    route: string,
    params: any = {},
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'DELETE', otherOptions)
  }

  static patch(
    route: string,
    params: any,
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    return this.xhr(route, params, 'PATCH', otherOptions)
  }

  static xhr(
    route: string,
    params: any | string | FormData,
    verb: AxiosRequestConfig['method'],
    otherOptions: AxiosRequestConfig = {}
  ): Promise<unknown> {
    const dataOption: AxiosRequestConfig = {}
    if (params && verb === 'GET') {
      dataOption.params = params
    } else {
      dataOption.data = params
    }
    const options = { method: verb, url: route, ...dataOption, ...otherOptions }
    console.warn(`${verb}: ${route}`)
    return axios(options)
      .then((responseJson) => responseJson.data)
      .catch(handleError)
  }
}
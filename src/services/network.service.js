import { appConfig } from './config';

class NetworkService {
  baseUrl = '';
  headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async post(path, body = {}, options = {}) {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/${path}`, {
        headers: {
          ...this.headers,
          ...(options.headers || {})
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (response.ok) return await response.json();
    } catch (e) {
      throw e;
    }
    throw response.status;
  }

  async get(path, options = {}) {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/${path}`, {
        headers: {
          ...this.headers,
          ...(options.headers || {})
        },
        method: 'GET',
      });
      if (response.ok) return await response.json();
    } catch (e) {
      throw e;
    }
    throw response.status;
  }

  async put(path, body = {}, options = {}) {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/${path}`, {
        headers: {
          ...this.headers,
          ...(options.headers || {})
        },
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (response.ok) return await response.json();
    } catch (e) {
      throw e;
    }
    throw response.status;
  }

  async delete(path, options = {}) {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/${path}`, {
        headers: {
          ...this.headers,
          ...(options.headers || {})
        },
        method: 'DELETE',
      });
      if (response.ok) return await response.json();
    } catch (e) {
      throw e;
    }
    throw response.status;
  }
}

export class NetworkServiceFactory {
  static networkService = null;

  static getNetworkSetvice(baseUrl) {
    if (NetworkServiceFactory.networkService) return NetworkServiceFactory.networkService;
    NetworkServiceFactory.networkService = new NetworkService(appConfig.baseUrl);
    return NetworkServiceFactory.networkService;
  }
}
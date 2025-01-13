import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private readonly http: HttpClient) { }

  public post(url: string, body: any, params: any) {
    let httpParams: HttpParams = new HttpParams();
    if (params && Object.keys(params)) {
      Object.keys(params).forEach(ele => {
        httpParams.set(ele, params[ele]);
      })
    }
    return this.http.post(url, body, {
      params: params, responseType: 'json',
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-functions-key': "9lmWqLpl9CH6f8vfhZaG2IoN7Be7GMZTDuj-P75umrh8AzFusnUS8Q=="
      })
    })
  }

  public uploadDocument(url: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(url, formData, {
      responseType: 'json',
      reportProgress: true,
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'enctype': 'multipart/form-data',
        'x-functions-key': "9lmWqLpl9CH6f8vfhZaG2IoN7Be7GMZTDuj-P75umrh8AzFusnUS8Q=="
      }),

    })
  }

  public put(url: string, body: any, params: any) {
    let httpParams: HttpParams = new HttpParams();
    if (params && Object.keys(params)) {
      Object.keys(params).forEach(ele => {
        httpParams.set(ele, params[ele]);
      })
    }
    return this.http.put(url, body, {
      params: params, responseType: 'json',
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    })
  }

  public get(url: string, params: any) {
    let httpParams: HttpParams = new HttpParams();
    if (params && Object.keys(params)) {
      Object.keys(params).forEach(ele => {
        httpParams.set(ele, params[ele]);
      })
    }
    return this.http.get(url, {
      params: params, responseType: 'json',
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-functions-key': "9lmWqLpl9CH6f8vfhZaG2IoN7Be7GMZTDuj-P75umrh8AzFusnUS8Q=="

      }),

    })
  }

  public delete(url: string, params: any) {
    let httpParams: HttpParams = new HttpParams();
    if (params && Object.keys(params)) {
      Object.keys(params).forEach(ele => {
        httpParams.set(ele, params[ele]);
      })
    }
    return this.http.delete(url, {
      params: params, responseType: 'json',
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
        'Access-Control-Allow-Origin': '*',
      }),

    })
  }
}

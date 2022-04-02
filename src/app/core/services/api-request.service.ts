import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  constructor(private httpClient: HttpClient) {}

  sendRequest(data: any): Observable<any> {
    //extract headers
    let headerList: any = {};
    data?.requestHeaders.forEach((item: any, index: number) => {
      headerList[item.key] = item?.value;
    });
    //extract query params
    let queryParamList: any = {};
    data?.requestQueryParams.forEach((item: any, index: number) => {
      queryParamList[item?.key] = item?.value;
    });
    //extract body
    const requestBodyObj: any = JSON.parse(data?.requestJson);
    const requestBody: string = JSON.stringify(requestBodyObj);
    //send general request
    return this.httpClient.request(data?.requestType, data?.requestUrl, {
      body: requestBody,
      headers: headerList,
      params: queryParamList,
      observe: 'response',
    });
  }
}

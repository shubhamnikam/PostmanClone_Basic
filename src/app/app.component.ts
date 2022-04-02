import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ApiRequestService } from './core/services/api-request.service';
import { AppConstants } from './core/utility/AppConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  subSendRequest!: any;
  requestForm!: any;
  requestQueryParams!: FormArray;
  requestHeaders!: FormArray;

  responseDetails:any = {
    responseStatus: "",
    responseTime: 0,
    responseSize: "",
    responseBody:"",
    responseAll:"",
    responseHeaders:[{}],
  }
  constructor(private formBuilder: FormBuilder, private apiRequestService: ApiRequestService) {}

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      requestType: [this.getRequestTypeList()?.[0]?.key, [Validators.required, Validators.minLength(1)]],
      requestUrl: ['https://api.chucknorris.io/jokes/random', [Validators.required, Validators.minLength(1)]],
      requestQueryParams: this.formBuilder.array([]),
      requestHeaders: this.formBuilder.array([]),
      requestJson: ["{}",Validators.required],
    });
  }

  submitRequestForm(): void {
    let valueData = this.requestForm.value; 
    var startTime = performance.now();

    console.log(this.requestForm);
    if(!this.requestForm.valid){
      console.warn("Request Form is not valid");
      return;
    }
    
    

    this.subSendRequest = this.apiRequestService.sendRequest(this.requestForm.value).subscribe({
      next: (result)=> this.updateResponseSection(result, startTime),
      error: (err)=> this.updateResponseSection(err, startTime),
      complete: () => console.info(`Request completed: [${valueData?.requestType}] => [${valueData?.requestUrl}]`)
    })
    
  }

  getRequestTypeList(): any[] {
    return AppConstants.getRequestTypeList();
  }

  addRequestQueryParamItem(): void {
    this.requestQueryParams = this.requestForm.get(
      'requestQueryParams'
    ) as FormArray;
    this.requestQueryParams.push(
      this.formBuilder.group({
        key: [null, Validators.required],
        value: [null, Validators.required],
      })
    );
  }

  removeRequestQueryParamItem(groupIndex: number): void {
    this.requestQueryParams = this.requestForm.get(
      'requestQueryParams'
    ) as FormArray;
    this.requestQueryParams.removeAt(groupIndex);
  }

  addRequestHeaderItem(): void {
    this.requestHeaders = this.requestForm.get('requestHeaders') as FormArray;
    this.requestHeaders.push(
      this.formBuilder.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  removeRequestHeaderItem(groupIndex: number): void {
    this.requestHeaders = this.requestForm.get('requestHeaders') as FormArray;
    this.requestHeaders.removeAt(groupIndex);
  }

  updateResponseSection(result: any, startTime: any){
    console.log(result);
    //set top response
    this.responseDetails.responseStatus=result?.status;
    this.responseDetails.responseTime= performance.now() - startTime;
    const finalDataString = JSON.stringify(result?.headers) + JSON.stringify(result?.body);
    const finalDataStringSize=new Blob([finalDataString]).size;
    this.responseDetails.responseSize = finalDataStringSize >= 1024 ? finalDataStringSize/1024 + " kb" : finalDataStringSize + ' bytes';
    this.responseDetails.responseBody = result.ok ? result?.body ?? "" : result?.message ?? "";
    //set total responseAll
    this.responseDetails.responseAll = result;
    //set headers
  }
  
  ngOnDestroy(): void {
    if(this.subSendRequest){this.subSendRequest.unsubscribe();}
  }
}

export class AppConstants{
  
    constructor() {
        
    }

    static getRequestTypeList() : any[] {
        return [
            {
                key: "GET",
                value: "GET"
            },
            {
                key: "POST",
                value: "POST"
            },
            {
                key: "PUT",
                value: "PUT"
            },
            {
                key: "PATCH",
                value: "PATCH"
            },
            {
                key: "DELETE",
                value: "DELETE"
            },
        ]
    }
}
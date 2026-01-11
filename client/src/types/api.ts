interface ApiResponse<T>{
    data:T
    success:boolean
    result?:number
    message?:string
}
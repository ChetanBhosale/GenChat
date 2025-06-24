
export interface IReturn {
    success: Boolean,
    message : String,
    data : any
}

export const ActionReturn = (success:Boolean,message:String,data?:any) => {
    return {
        success,
        message,
        data : data
    }
}



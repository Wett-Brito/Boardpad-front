export interface GenericResponse<T> {
    status : string;
    message : string;
    response : T;
}
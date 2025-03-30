import { Exam } from "./Exam"

export type User = {
    id : number,
    name : string,
    email : string,
    password : string,
    role : string,
    exams : Exam []
}
import { Exam } from "./Exam"

export type User = {
    name : string,
    email : string,
    password : string,
    roles : Role [],
    exams : Exam []
}

enum Role {
    Admin,
    Teacher
}
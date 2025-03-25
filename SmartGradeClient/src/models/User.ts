import { Exam } from "./Exam"

export type User = {
    name : string,
    email : string,
    password : string,
    role : string,
    exams : Exam []
}

enum Role {
    Admin = "Admin",
    User = "User"
}
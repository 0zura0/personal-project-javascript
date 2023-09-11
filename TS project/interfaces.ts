

export interface SubjectObj{
    title:string,
    lessons:number,
    description?:string
}

interface IPhone{
    phone:string,
    primary:boolean,
} 

interface IEmails{
    email:string,
    primary:boolean,
}

interface ISubjets{
    subject:string,
}

interface IName{
    first:string,
    last:string
}

export interface pupilObj{
    name:IName,
    dateOfBirth:string,
    phones:IPhone[]
    sex: "male" | "female",
    description?:string
}

export interface teacherAdder {
    emails:IEmails[]
    subjects:ISubjets[],
}

export interface ReadIgroup{
    id:number,
    room:number,
    pupils:(pupilObj&{id:number})[]
}
export interface Igroups{
id:number,
room:number,
pupils:Map<Number,pupilObj&{id:number}>
}

export interface Irecords{
    pupilId: number,
    teacherId: number,
    subjectId: number,
    lesson:number,
    mark:number
}

export interface GradebookRecs{
    teacher: string;
    subject: string | boolean;
    lesson: number;
    mark: number;
}
export interface InitialObj{
        name: string | boolean;
        records:GradebookRecs[];
    }

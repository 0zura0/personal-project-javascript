import { Validations } from "./ValidationsTs";
import { Irecords, teacherAdder,SubjectObj,pupilObj, GradebookRecs,InitialObj } from "./interfaces";

import { Groups } from "./groupsTs";
import { Subjects } from "./subjectsTs";
import {Teachers} from "./TeachersTs"

class Gradebooks{
    private TeachersMap:Teachers;
    private GroupsMap:Groups;
    private SubjectMap:Subjects;
    private GradeBooksMap:Map<number,Map<Number,InitialObj>>;
    private counter:number=0;

    constructor(groups:Groups, teachers:Teachers, subjects:Subjects) {
        this.SubjectMap = subjects;
        this.TeachersMap = teachers;
        this.GroupsMap = groups;
        this.GradeBooksMap = new Map()
    }

   public add(roomid:number):number{
        //თუ ასეთ აიდიზე არსებობს ჟურნალი მაშინ დააბრუნებს That group already have Gradebook
        if (this.GradeBooksMap.has(roomid)) {
            throw new Error("That group already have Gradebook")
        }
        //საერთოდ არსებობს თუ არა მსგავსი room შესაბამისი roomid-თ
        if(!this.GroupsMap.read(roomid)){
            throw new Error("there is not room with such id so you can not create Gradebook")
        }
        let recordsmap:Map<number,InitialObj> = new Map()
        this.GradeBooksMap.set(roomid, recordsmap)
        return roomid
    }

  public clear():boolean {
        this.GradeBooksMap.clear()
        return true
    }

  public  addRecord(gradebookId:number, record:Irecords):boolean{
        let {
            pupilId,
            teacherId,
            subjectId,
            lesson,
            mark,
            ...rest
        } = record //მერე ვკითხოთ უნდა ამასაც ტიპის მიწერა თუ არა მემგონი არა

        //შევამოწმოთ rest ზედმეტი რაღაცები ხომ არ არის გადმოცემული
        if (Object.keys(rest).length !== 0) {
            throw new Error("object is not formated well")
        }
        //ეხლა ობიექტი შევქმნათ
        let firstLast:string | true=true;
        let teachername:string;
        let subj:string | boolean=true;
        let currentTeacher :pupilObj&teacherAdder;
        //ეძებს მოსწავლეს თავისივე აიდით გადაცემულ ჟურნალში თუ იპოვა სახელს და გვარს ამოიღებს და თუ ვერ იპოვა 
        //დააბრუნებს There isn't such person in that class
        let pupilArr:(pupilObj&{id:number})[]= this.GroupsMap.read(gradebookId).pupils;
        for (let i = 0; i < pupilArr.length; i++) {
            if (pupilArr[i].id === pupilId) {
                firstLast = pupilArr[i].name.first + " " + pupilArr[i].name.last;
            }
        }
        if (!firstLast) {
            throw new Error("There isn't such person in that class")
        }
        // მოვძებნოთ მასწავლებელი
        if (this.TeachersMap.read(teacherId)) {
            teachername = this.TeachersMap.read(teacherId).name.first + " " + this.TeachersMap.read(teacherId).name.last
        } else {
            throw new Error("There is not such Teacher in school")
        }
        //მოვძებნოთ საგანი
        let subjectARR:(SubjectObj&{id:number})[] = this.SubjectMap.readAll()
        for (let i = 0; i < subjectARR.length; i++) {
            if (subjectARR[i].id === subjectId) {
                subj = subjectARR[i].title;
            }
        }
        //ვნახოთ ასწავლის თუ არა ამ საგანს ეს მასწავლებელი
        currentTeacher= this.TeachersMap.read(teacherId)
        for (let i = 0; i < currentTeacher.subjects.length; i++) {
            if (currentTeacher.subjects[i].subject === subj) {
                this.counter++
            }
        }
        if (this.counter !== 1) {
            throw new Error("Teacher is not teaching that subject")
        }
        this.counter = 0;

        //ვნახოთ სწორი ნიშანია თუ არა
        if (mark < 0 || mark > 10) {
            throw new Error("mark should be from 0 to 10")
        }

        // და უკვე შევქმნათ ობიექტი
        // თუ პირველი შექმნაა ახალ ობიექტს შექმნის შესაბამისი აიდით და თუ 
        // უკვე რამდენიმე ნიშანია დაწერილი მაშინ უბრალოდ დაფუშავს ობიექტის მასივში
        if (!this.GradeBooksMap.get(gradebookId)?.has(pupilId)) {

            let initialobject:InitialObj = {
                name: firstLast,
                records: [
                    {
                        teacher: teachername,
                        subject: subj,
                        lesson: lesson,
                        mark: mark
                    }
                ]
            }
            this.GradeBooksMap.get(gradebookId)?.set(pupilId, initialobject)
        } else {
            let addingObj:GradebookRecs = {
                teacher: teachername,
                subject: subj,
                lesson: lesson,
                mark: mark
            }
            this.GradeBooksMap.get(gradebookId)?.get(pupilId)?.records.push(addingObj);
        }
        return true
    }

  public read(gradebookId:number, pupilId:number):InitialObj | undefined{
        //მოძებნა და დარეთარნება
        if(this.GradeBooksMap.has(gradebookId)){
            if(this.GradeBooksMap.get(gradebookId)?.has(pupilId)){
                return this.GradeBooksMap.get(gradebookId)?.get(pupilId);
            }else{
                throw new Error("There is not such Person in That class")
            }
        }else{
            throw new Error("There is not such Gradebook with that id in school")
        }
    }

  public readAll(gradebookId:number):InitialObj[]{
        if(gradebookId){
            Validations.isNumeric(gradebookId)
        }else{
            throw new Error("Gradebookid should be provided")
        }
        if(this.GradeBooksMap.has(gradebookId)){
            return Array.from(this.GradeBooksMap.get(gradebookId).values())
        }else{
            throw new Error("There is not Gradebook with such id")
        }
    }

public log(){
    console.log(this.GradeBooksMap);
    
}

}








const history = {
    title: 'history',
    lessons:5,
  };

const english = {
    title: 'english',
    lessons:15,
    description:"so good"
  };
  


///
let data:pupilObj&teacherAdder = {
    "name": {
    "first": "zura",
    "last": "magalashvili"
  },
  "dateOfBirth": "2002-09-05", // format date
  "emails": [
    {
      "email": "zuramagalashvili@gmail.com",
      "primary": true
    }
  ],
  "phones": [
    {
      "phone": "551566888",
      "primary": true
    }
  ],
  "sex": "male", // male or female
  "subjects": [
    {
      "subject": "history" // just name property of subject.
    }
  ],
  "description": "string",
}

let data2:pupilObj&teacherAdder = {
    "name": {
    "first": "nika",
    "last": "maglakelidze",
  },
  "dateOfBirth": "2002-09-05", // format date
  "emails": [
    {
      "email": "zuramagalashvili@gmail.com",
      "primary": true
    }
  ],
  "phones": [
    {
      "phone": "551566888",
      "primary": true
    }
  ],
  "sex": "male", // male or female
  "subjects": [
    {
      "subject": "history" // just name property of subject.
    }
  ],
  "description": "string",
}

let pupil1:pupilObj&{id:number} ={
    "id":1,
    "name": {
      "first": "nata",
      "last": "magradze"
    },
    "dateOfBirth": "2002-09-05", // format date
    "phones": [
      {
        "phone": "551566888",
        "primary": true
      }
    ],
    "sex": "male", // male OR female
    "description": "string"
  }

  let pupil2:pupilObj&{id:number} ={
    "id":2,
    "name": {
      "first": "nana",
      "last": "mgeladze"
    },
    "dateOfBirth": "2002-09-05", // format date
    "phones": [
      {
        "phone": "551566888",
        "primary": true
      }
    ],
    "sex": "male", // male OR female
    "description": "string"
  }



console.log("---------------subjects-------------------");
let subjects = new Subjects()
let subjectId=subjects.add(history)
subjects.add(english);
subjects.log();
console.log("---------------------teachers------------------");
let teachers = new Teachers()
let teacherId =teachers.add(data)
teachers.add(data2)
teachers.log()
console.log("-----------------------rooms--------------------")
let room =20
let groups= new Groups()
let groupid=groups.add(room)
groups.addPupil(groupid,pupil1)
groups.addPupil(groupid,pupil2)
groups.log()
console.log("-----------------------gradebooks--------------------")
let gradebooks = new Gradebooks(groups,teachers,subjects)
gradebooks.add(groupid)
// gradebooks.log()

console.log("----------------------addrecord--------------------");
const record = {
  pupilId: 2,
  teacherId: teacherId,
  subjectId: subjectId,
  lesson: 1,
  mark: 9
};
gradebooks.addRecord(groupid,record)
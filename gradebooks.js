import { Validations } from "./validations.js";
import { Random } from "./random.js";


import { Subjects } from "./subjects.js";
import { Teachers } from "./Teachers.js";
import { Pupils } from "./pupils.js";
import { Groups } from "./groups.js";

class Gradebooks {
    #TeachersMap
    #GroupsMap
    #SubjectMap
    #GradeBooksMap
    #counter = 0
    constructor(groups, teachers, subjects) {
        this.#SubjectMap = subjects;
        this.#TeachersMap = teachers;
        this.#GroupsMap = groups;
        this.#GradeBooksMap = new Map()
    }
    add(roomid) {
        //თუ სწორადაა გადმოცემული დაავალიდირებს
        if (roomid) {
            Validations.isNumeric(roomid)
        } else {
            throw new Error("parameter should be provided")
        }
        //თუ ასეთ აიდიზე არსებობს ჟურნალი მაშინ დააბრუნებს That group already have Gradebook
        if (this.#GradeBooksMap.has(roomid)) {
            return "That group already have Gradebook"
        }
        //საერთოდ არსებობს თუ არა მსგავსი room შესაბამისი roomid-თ
        if(this.#GroupsMap.read(roomid)==="there is not room with such id"){
            return "there is not room with such id so you can not create Gradebook"
        }
        let recordsmap = new Map()
        this.#GradeBooksMap.set(roomid, recordsmap)
        return roomid
    }
    clear() {
        this.#GradeBooksMap.clear()
        return true
    }

    addRecord(gradebookId, record) {
        if (gradebookId) {
            Validations.isNumeric(gradebookId)
        } else {
            throw new Error("GradebookId should be provided")
        }
        if (record) {
            Validations.isObject(record)
        } else {
            throw new Error("Record should be provided")
        }
        let {
            pupilId,
            teacherId,
            subjectId,
            lesson,
            mark,
            ...rest
        } = record
        //შევამოწმოთ rest ზედმეტი რაღაცები ხომ არ არის გადმოცემული
        if (Object.keys(rest).length !== 0) {
            throw new Error("object is not formated well")
        }
        //შევამოწმოთ მართლა არის თუ არა გადმოცემული ფილდები
        if (!(pupilId && teacherId && subjectId && lesson && mark)) {
            throw new Error("pupilId && teacherId && subjectId && lesson && mark are required fields")
        }
        Validations.isNumeric(pupilId);
        Validations.isNumeric(teacherId);
        Validations.isNumeric(subjectId)
        Validations.isNumeric(lesson)
        Validations.isNumeric(mark)

        //ეხლა ობიექტი შევქმნათ
        let firstLast;
        let teachername;
        let subj;
        let currentTeacher;
        //ეძებს მოსწავლეს თავისივე აიდით გადაცემულ ჟურნალში თუ იპოვა სახელს და გვარს ამოიღებს და თუ ვერ იპოვა 
        //დააბრუნებს There isn't such person in that class
        let pupilArr = this.#GroupsMap.read(gradebookId).pupils;
        for (let i = 0; i < pupilArr.length; i++) {
            if (pupilArr[i].id === pupilId) {
                firstLast = pupilArr[i].name.first + " " + pupilArr[i].name.last;
            }
        }
        if (!firstLast) {
            return "There isn't such person in that class "
        }
        //მოვძებნოთ მასწავლებელი
        if (this.#TeachersMap.read(teacherId) !== false) {
            teachername = this.#TeachersMap.read(teacherId).name.first + " " + this.#TeachersMap.read(teacherId).name.last
        } else {
            return "There is not such Teacher in school"
        }
        //მოვძებნოთ საგანი
        let subjectARR = this.#SubjectMap.readAll()
        for (let i = 0; i < subjectARR.length; i++) {
            if (subjectARR[i].id === subjectId) {
                subj = subjectARR[i].title;
            }
        }
        //ვნახოთ ასწავლის თუ არა ამ საგანს ეს მასწავლებელი
        currentTeacher = this.#TeachersMap.read(teacherId)
        for (let i = 0; i < currentTeacher.subjects.length; i++) {
            if (currentTeacher.subjects[i].subject === subj) {
                this.#counter++
            }
        }
        if (this.#counter !== 1) {
            throw new Error("Teacher is not teaching that subject")
        }
        this.#counter = 0;
        //ვნახოთ სწორი ნიშანია თუ არა
        if (mark < 0 || mark > 10) {
            throw new Error("mark should be from 0 to 10")
        }
        //და უკვე შევქმნათ ობიექტი
        //თუ პირველი შექმნაა ახალ ობიექტს შექმნის შესაბამისი აიდით და თუ 
        //უკვე რამდენიმე ნიშანია დაწერილი მაშინ უბრალოდ დაფუშავს ობიექტის მასივში
        if (!this.#GradeBooksMap.get(gradebookId).has(pupilId)) {

            let initialobject = {
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
            this.#GradeBooksMap.get(gradebookId).set(pupilId, initialobject)
        } else {
            let addingObj = {
                teacher: teachername,
                subject: subj,
                lesson: lesson,
                mark: mark
            }
            this.#GradeBooksMap.get(gradebookId).get(pupilId).records.push(addingObj);
        }
        return true
    }
    read(gradebookId, pupilId){
        //ვალიდაცია
        if(gradebookId){
            Validations.isNumeric(gradebookId);
        }else{
            throw new Error("gradebookid should be provided")
        }
        //ვალიდაცია
        if(pupilId){
            Validations.isNumeric(pupilId);
        }else{
            throw new Error("pupilId should be provided")
        }
        //მოძებნა და დარეთარნება
        if(this.#GradeBooksMap.has(gradebookId)){
            if(this.#GradeBooksMap.get(gradebookId).has(pupilId)){
                return this.#GradeBooksMap.get(gradebookId).get(pupilId);
            }else{
                return "There is not such Person in That class"
            }
        }else{
            return "There is not such Gradebook with that id in school"
        }
    }

    readAll(gradebookId){
        if(gradebookId){
            Validations.isNumeric(gradebookId)
        }else{
            throw new Error("Gradebookid should be provided")
        }
        if(this.#GradeBooksMap.has(gradebookId)){
            return Array.from(this.#GradeBooksMap.get(gradebookId).values())
        }else{
            return "There is not Gradebook with such id"
        }
    }

}

//subject class instanse
const history = {
    title: 'History',
    lessons: 24
};

const algo = {
    title: 'algo',
    lessons: 20,
    description: "algo good"
};

const subjects = new Subjects();
const historyid = subjects.add(history); //historys id
const algoid = subjects.add(algo) //algos id


//teachers
let teacher1 = {
    "name": {
        "first": "akaki",
        "last": "giorgadze"
    },
    "dateOfBirth": "2022-08-10", // format date
    "emails": [
        {
            "email": "user@example.com",
            "primary": true,
        },
        {
            "email": "user@example.com",
            "primary": false,
        }
    ],
    "phones": [
        {
            "phone": "123456789",
            "primary": true
        },
        {
            "phone": "123456789",
            "primary": false
        }
    ],
    "sex": "male", // male or female
    "subjects": [
        {
            "subject": "History" // just name property of subject.
        }
    ],
    "description": "good",
}


let teacher2 = {
    "name": {
        "first": "zura",
        "last": "magalashvili"
    },
    "dateOfBirth": "2022-08-09", // format date
    "emails": [
        {
            "email": "user@example2.com",
            "primary": true,
        },
        {
            "email": "user@example1.com",
            "primary": false,
        }
    ],
    "phones": [
        {
            "phone": "123456710",
            "primary": true
        },
        {
            "phone": "123456711",
            "primary": false
        }
    ],
    "sex": "male", // male or female
    "subjects": [
        {
            "subject": "algo" // just name property of subject.
        }
    ],
    "description": "narmaliok",
}

const teachers = new Teachers();
const teacher1id = teachers.add(teacher1); //teahcer1 id
const teacher2id = teachers.add(teacher2) //teacher2 id

//pupils
let pupil1 = {
    "name": {
        "first": "nika",
        "last": "kakauridze"
    },
    "dateOfBirth": "2022-08-10", // format date
    "phones": [
        {
            "phone": "551566881",
            "primary": false
        },
        {
            "phone": "551566889",
            "primary": true
        }
    ],
    "sex": "male", // male OR female 
    "description": "string"
}

let pupil2 = {
    "name": {
        "first": "luka",
        "last": "taqtatidze"
    },
    "dateOfBirth": "2022-08-10", // format date
    "phones": [
        {
            "phone": "123456789",
            "primary": false
        },
        {
            "phone": "551566888",
            "primary": true
        }
    ],
    "sex": "male", // male OR female 
    "description": "string"
}
const pupils = new Pupils();
const pupil01 = pupils.add(pupil1); //pupil1 object
const pupil02 = pupils.add(pupil2); //pupil2 object
//   console.log(pupil01);


//groups

const room = 236;
const groups = new Groups();

const groupId = groups.add(room);
// console.log(groupId);
groups.addPupil(groupId, pupil01);
groups.addPupil(groupId, pupil02);



//test
// subjects.readSubjectsMap()
// teachers.readTeacherssMap()
// console.log(groups.readGroupsMap());

// groups.readGroupsMap()
const gradebooks = new Gradebooks(groups, teachers, subjects);
let gradebookId = gradebooks.add(groupId)
// console.log(gradebooks);
// console.log(gradebookId);
// gradebooks.clear()


const record = {
    pupilId: pupil01.id,
    teacherId: teacher1id,
    subjectId: historyid,
    lesson: 1,
    mark: 9
};
const record2 = {
    pupilId: pupil02.id,
    teacherId: teacher1id,
    subjectId: historyid,
    lesson: 1,
    mark: 9
};

console.log(gradebooks.addRecord(gradebookId, record));
gradebooks.addRecord(gradebookId, record2);
const Nika = gradebooks.read(gradebookId, pupil01.id);
// console.log(Nika);
const students = gradebooks.readAll(gradebookId);
students.forEach((value)=>{
    console.log(value);
});
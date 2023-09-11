import { Validations } from "./validations.js";

//ეს უბრალოდ მერე თუ ამავე ფაილში გატესტავ
// import { Subjects } from "./subjects.js";
// import { Teachers } from "./Teachers.js";
// import { Pupils } from "./pupils.js";
// import { Groups } from "./groups.js";

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


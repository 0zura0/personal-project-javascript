import { Validations } from "./ValidationsTs";
import { Random } from "./RandomTs";
import {SubjectObj} from "./interfaces"
import { addANDremove } from "./abstracts";

export class Subjects extends addANDremove<SubjectObj>{
    private subjectArr:Map<number,SubjectObj&{id:number}>;
    private temp:boolean;
    private temp2:boolean;

    constructor(){
        super();
        this.subjectArr = new Map();        
    }

    private Objectvalidator(subjObject:SubjectObj):void{
        let { title, lessons, description, ...rest } = subjObject;
        
        if (Object.keys(rest).length !== 0) {
            throw new Error("Object is not formated well, it have unexpected filed(s)")
        }
        Validations.isMixedString(title)
    }

    public add(subjectobj:SubjectObj):number{
        this.Objectvalidator(subjectobj)    
        if (subjectobj.description) {
            Validations.isMixedString(subjectobj.description)
        }
        
        //თუ არსებობს მსგავსი title-ით მაშინ არ დაემატება {თუ დესქრიფშენის დამატება მოგვინდება ან საგნის lesson ების შეცვლა წავშლით და ახლიდან დავამატებთ}
        this.subjectArr.forEach((value:SubjectObj) => {
            if (value.title === subjectobj.title) {
                this.temp2 = false
            }
        })
        if (this.temp2 === false) {
            throw new Error("subject is already added you can not add it twise")
        }

        //ვაგენერირებთ აიდის
        let id:number = Random.randBetween(1, 100000)
        while (this.subjectArr.has(id)) {
            id = Random.randBetween(1, 100000)
        }

        //ვსეტავ ისე რომ შიგნით ობიექტს ჰქონდეს აიდი და იგივე აიდით იყოს მაპშიც
        this.subjectArr.set(id, { id: id, ...subjectobj })
        return id
    }

    public remove(id: number):boolean{
        if (!this.subjectArr.has(id)) {
            return false
        }
        this.subjectArr.delete(id)
        return true
    }

    public verify(subjectObj:SubjectObj):boolean{
        this.Objectvalidator(subjectObj)
        //თუ დესქრიფშენი ექნება დავალიდირდება ესეც
        if (subjectObj.description) {
            Validations.isMixedString(subjectObj.description)
            //ბარემ აქ მოვძებნით ისე რომ დესქრიფშენებსაც შევადარებ
            this.subjectArr.forEach((value:SubjectObj) => {
                if ((value.description === subjectObj.description && value.title === subjectObj.title && value.lessons === subjectObj.lessons)) {
                    this.temp = true
                }
            })
        } else {
            this.subjectArr.forEach((value:SubjectObj) => {
                if ((value.title === subjectObj.title && value.lessons === subjectObj.lessons)) {
                    this.temp = true
                }
            })
        }
        if (this.temp === true) {
            this.temp = false
            return true
        } else {
            return false
        }
    }

    readAll():(SubjectObj&{id:number})[]{
        //ყველა მეპის ობიექრის value-ს მასივს დააბრუნებს
        return Array.from(this.subjectArr.values())
    }

    public log(){
        console.log(this.subjectArr);
        
    }
}

import { Validations } from "./validations.js";
import { Random } from "./random.js";

export class Subjects{
    #subjectArr
    #temp
    #temp2
    constructor(){
        this.#subjectArr = new Map()
    }
    #validObj(obj){
         //თუ გადმოცემულია ობიექტი მაშინ დაავალიდირებს თუ არადა err
         if(obj){
            Validations.isObject(obj);
            }else{
                throw new Error("parameter should be provided")
            }
            let {title,lessons,description,...rest} = obj;
            //თუ rest ში რამეა ესეიგი ზედმეტი ფილდია და არასწორად დაფორმატებული ობიექტია
            if(Object.keys(rest).length!==0){
                throw new Error("Object is not formated well, it have unexpected filed(s)")
            }
            //title და lesson ფილდები არის აუცილებელი თუ არადა err, თუ არსებობს დავალიდირდება
            if(!title || !lessons){
                throw new Error("lesson and title is required fields")
            }
            Validations.isMixedString(title)
            Validations.isNumeric(lessons)
    }
    add(obj){
        //დასავალიდირებელი ფუნქცია
        this.#validObj(obj)
        if(obj.description){
            Validations.isMixedString(obj.description)
        }
        //თუ არსებობს მსგავსი title-ით მაშინ არ დაემატება {თუ დესქრიფშენის დამატება მოგვინდება ან საგნის lesson ების შეცვლა წავშლით და ახლიდან დავამატებთ}
        this.#subjectArr.forEach((value)=>{
            if (value.title===obj.title) {
                    this.#temp2 = false
            }
        })
        if(this.#temp2===false){
            return "subject is already added you can not add it twise"
        }
        //ვაგენერირებთ აიდის
       let id=Random.randBetween(1,100000)
        while(this.#subjectArr.has(id)){
             id=Random.randBetween(1,100000)  
        }
        //ვსეტავ ისე რომ შიგნით ობიექტს ჰქონდეს აიდი და იგივე აიდით იყოს მაპშიც
        this.#subjectArr.set(id,{id:id, ...obj})
        // console.log(this.#subjectArr);
        return id
    }

    // თუ სწორადაა გადაცემული id  და ეს აიდი არსებობს მაშინ წაშლის და დააბრუნებს true ს
    remove(subjectID){
        //თუ არსებობს დაავალიდირებს
        if(subjectID){
            Validations.isNumeric(subjectID)
        }else{
            throw new Error("You should pass subjcetid and it must be number")
        }
        //თუ არ არსებობს მსგავსი აიდით დააბრუნებს false წინააღმდეგ შემთხვევაში წაშლის და დააბრუნებს true-ს
        if(!this.#subjectArr.has(subjectID)){
            return false
        }
        this.#subjectArr.delete(subjectID)
        // console.log(this.#subjectArr);
        return true
    }


    verify(subjectObj){
        //დასავალიდირებელი ფუნქცია
        this.#validObj(subjectObj)
        //თუ დესქრიფშენი ექნება დავალიდირდება ესეც
        if(subjectObj.description){
            Validations.isMixedString(subjectObj.description)
            //ბარემ აქ მოვძებნით ისე რომ დესქრიფშენებსაც შევადარებ
            this.#subjectArr.forEach((value)=>{
                if((value.description===subjectObj.description && value.title===subjectObj.title && value.lessons===subjectObj.lessons)){
                    this.#temp=true
                }
            })
        }else{
            this.#subjectArr.forEach((value)=>{
                if((value.title===subjectObj.title && value.lessons===subjectObj.lessons)){
                    this.#temp=true
                }
            })
        }
        if(this.#temp===true){
            this.#temp=false
            return true
        }else{
            return false
        }
    }
    readAll(){
        //ყველა მეპის ობიექრის value-ს მასივს დააბრუნებს
        return Array.from(this.#subjectArr.values())
    }
// ----------------------------------------------------
//ამას წავშლი მერე )
readSubjectsMap(){
    console.log(this.#subjectArr);
}
}

const history = {
    title: 'History',
    lessons: 13,
  };

  const history2 = {
    title: 'algo',
    lessons: 14,
    description:'algo good'
  };
  const history3 = {
    title: 'algo2',
    lessons: 14,
    description:'algo good'
  };


//   const subjects = new Subjects();
//   const subjectId = subjects.add(history); // should add subject. Returns subject id
//   const subjectId2 = subjects.add(history2);
//   console.log(subjects.remove(subjectId2)); //es sheizleba shevcvalo da obieqts abrunebdes

//   console.log(subjects.verify(history3));
// console.log(subjects.readAll());



  



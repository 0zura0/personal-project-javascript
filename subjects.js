import { Validations } from "./validations.js";
import { Random } from "./random.js";

class Subjects{
    #subjectArr
    #temp
    constructor(){
        this.#subjectArr = new Map()
    }

    add(obj){
        Validations.isObject(obj);
        let {title,lessons,description,...rest} = obj;
        if(Object.keys(rest).length!==0){
            throw new Error("Object is not formated well, it have unexpected filed(s)")
        }

        if(!title || !lessons){
            throw new Error("lesson and title is required fields")
        }
        Validations.isMixedString(title)
        Validations.isNumeric(lessons)

        if(description){
            Validations.isMixedString(description)
        }

        this.#subjectArr.forEach((value)=>{
            if (value.title===obj.title && value.lessons===obj.lessons) {
                    this.#temp = false
            }
        })
        
        if(this.#temp===false){
            return "subject is already added you can not add it twise"
        }

       let id=Random.randBetween(1,100000)
        while(this.#subjectArr.has(id)){
             id=Random.randBetween(1,100000)  
        }

        this.#subjectArr.set(id,{id:id, ...obj})
        // console.log(this.#subjectArr);
        return id
    }



    // თუ სწორადაა გადაცემული id  და ეს აიდი არსებობს მაშინ წაშლის და დააბრუნებს true ს
    remove(subjectID){

        if(subjectID){
            Validations.isNumeric(subjectID)
        }else{
            throw new Error("You should pass subjcetid and it must be number")
        }

        if(!this.#subjectArr.has(subjectID)){
            return false
        }
        this.#subjectArr.delete(subjectID)
        // console.log(this.#subjectArr);
        return true
    }
    verify(subjectObj){
        Validations.isObject(subjectObj);
        let {title,lessons,description,...rest} = subjectObj;
        if(Object.keys(rest).length!==0){
            throw new Error("Object is not formated well, it have unexpected filed(s)")
        }

        if(!title || !lessons){
            throw new Error("lesson and title is required fields")
        }
        Validations.isMixedString(title)
        Validations.isNumeric(lessons)

        if(description){
            Validations.isMixedString(description)
        }
        this.#subjectArr.forEach((value)=>{
            if(value.title==subjectObj.title && value.lessons===subjectObj.lessons){
                this.#temp=true
            }
        })
        if(this.#temp===true){
            return true
        }else{
            return false
        }

    }
    readAll(){
        return Array.from(this.#subjectArr.values())
    }

}

const history = {
    title: 'History',
    lessons: 24,
  };

  const history2 = {
    title: 'History',
    lessons: 22,
    description:'heh'
  };

  const subjects = new Subjects();
  const subjectId = subjects.add(history); // should add subject. Returns subject id
  const id2 = subjects.add(history2)

//   console.log(subjects.remove(id2)); //es sheizleba shevcvalo da obieqts abrunebdes

//   console.log(subjects.verify(history2));


console.log(subjects.readAll());



  



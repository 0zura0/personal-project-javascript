import { Validations } from "./validations.js";
import { Random } from "./random.js";

class Teachers{
    #TeachersMap
    #counter=0
    constructor(){
        this.#TeachersMap = new Map();
    }

    #innerValid(data){
        Validations.isObject(data);
       let {
            name: {
              first,
              last,
            },
            dateOfBirth, // format date
            emails, //array of objects
            phones, //array of object
            sex, // male or female
            subjects, //array of objects
            description,
            ...rest
          } = data
          if(Object.keys(rest).length!==0){
            throw new Error("Object is not formated well, it have unexpected filed(s)")
        }
          if(!(first && last && dateOfBirth && emails && phones && sex && subjects && description)){
            throw new Error("first && last && dateOfBirth && emails && phones && sex && subjects && description should be provided, they're required fields")
          }
          Validations.onlyCharacters(first)
          Validations.onlyCharacters(last)
          Validations.isValidDateFormat(dateOfBirth)
        //   console.log(emails.length);
        // console.log(emails);
          for(let i=0;i<emails.length;i++){

            if(emails[i].email && (emails[i].primary===true || emails[i].primary===false)){
                Validations.isValidEmailFormat(emails[i].email)
                Validations.isBoolean(emails[i].primary)
            }else{
                throw new Error("email and primary fiels are required")
            }

            if(emails[i].primary===true){
                this.#counter++;
            }
            if(this.#counter>1){
                this.#counter=0;
                throw new Error("There should be only one primary email")
              }
          }
          this.#counter=0;

          //ტელეფონის მასივის ვალიდაცია
          for(let i=0;i<phones.length;i++){
           if(phones[i].phone && (phones[i].primary===true || phones[i].primary ===false)){
            Validations.isValidPhoneNumberFormat(phones[i].phone)
            Validations.isBoolean(phones[i].primary)
           }else{
            throw new Error("email and primary fiels are required")
           }
           if(phones[i].primary===true){
            this.#counter++;
            } 
            if(this.#counter>1){
                this.#counter=0;
                throw new Error("There should be only one primary phone")
              }
          }
          this.#counter=0;
          Validations.isValidGender(sex)
          //subject ვალიდაცია
          for(let i=0;i<subjects.length;i++){
            if(subjects[i].subject){
             Validations.isMixedString(subjects[i].subject)
            }else{
             throw new Error("subject field is required")
            }
           }
           if(description){
            Validations.isMixedString(description)
           }
    }

    add(data){
            this.#innerValid(data)
           let id=Random.randBetween(1,100000);
           while(this.#TeachersMap.has(id)){
            id=Random.randBetween(1,100000)  
            }
            this.#TeachersMap.set(id,{id:id, ...data})
            // console.log(this.#TeachersMap);
            return id
    }

    read(teacherId){
        if(teacherId){
            Validations.isNumeric(teacherId)
        }else{
            throw new Error(`${teacherId} should be number`)
        }
        if(!this.#TeachersMap.has(teacherId)){
            return false
        }
        return this.#TeachersMap.get(teacherId)
    }

    update(id,newobj){
        this.#innerValid(newobj)
        if(id){
            Validations.isNumeric(id)
        }else{
            throw new Error("id should be passed")
        }

        if(this.#TeachersMap.has(id)){
           this.#TeachersMap.set(id,{id:id,...newobj})
        }else{
            return "there is not teacher with such id"
        }
    }

    remove(id){
        if(id){
            Validations.isNumeric(id)
        }else{
            throw new Error("id should be provoded")
        }
        if(this.#TeachersMap.has(id)){
            this.#TeachersMap.delete(id)
            return true
         }else{
             return "there is not teacher with such id"
         }
    }


}

const teachers = new Teachers();
let teacher1={
    "name": {
      "first": "string",
      "last": "string"
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
        "subject": "algo" // just name property of subject.
      }
    ],
    "description": "string",
  }

  let teacher2={
    "name": {
      "first": "zura",
      "last": "magalashbili"
    },
    "dateOfBirth": "2022-08-10", // format date
    "emails": [
      {
        "email": "user@example2.com",
        "primary": false,
      },
      {
        "email": "user@example.com",
        "primary": true,
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
        "subject": "algo" // just name property of subject.
      }
    ],
    "description": "string",
  }


let id=teachers.add(teacher1)
let id2=teachers.add(teacher2)

// let id2= teachers.update(id,teacher2)
// console.log(teachers.read(id));
teachers.remove(id)






// Validations.isValidDateFormat("2022-02-28")
// console.log("2027-12-10".split("-")[0]>new Date().getFullYear());
// console.log("2027-12-10".split("-")[0] );
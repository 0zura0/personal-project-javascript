import { Validations } from "./ValidationsTs";
import { Random } from "./RandomTs";
import { addANDremove } from "./abstracts";
import { teacherAdder } from "./interfaces";
import { pupilObj } from "./interfaces";



export class Teachers extends addANDremove<pupilObj&teacherAdder> {
    private TeachersMap:Map<number, pupilObj&teacherAdder& {id:number}>;
    private counter:number=0;

    constructor() {
        super()
        this.TeachersMap = new Map();
      }

    private innerValidation(data:pupilObj&teacherAdder){
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
          }= data 
              //თუ რამეა rest-ში ესეიგი არასწორად დავალიდირებული ობიექტია და err
          if (Object.keys(rest).length !== 0) {
            throw new Error("Object is not formated well, it have unexpected filed(s)")
          }
          Validations.onlyCharacters(first)
          Validations.onlyCharacters(last)
          Validations.isValidDateFormat(dateOfBirth)

          //ვალიდირდება ემაილის ყველა ველი და ასევე მოწმდება რომ იყოს ერთი primary ველი
    for (let i = 0; i < emails.length; i++) {
          Validations.isValidEmailFormat(emails[i].email)
        if (emails[i].primary === true) {
          this.counter++;
          // console.log(this.counter);
          
        }
      }
      if (this.counter > 1 || this.counter === 0) {
        // console.log(this.counter);
        
        this.counter = 0;
        throw new Error("There must one primary email")
      }
      this.counter = 0;
      
    //ტელეფონის მასივის ვალიდაცია
    for (let i = 0; i < phones.length; i++) {
        Validations.isValidPhoneNumberFormat(phones[i].phone)
      if (phones[i].primary === true) {
        this.counter++;
      }
      if (this.counter > 1 || this.counter === 0) {
        this.counter = 0;
        throw new Error("There should be only one primary phone")
      }
    }
    this.counter = 0;
    
      //subject ვალიდაცია
      for (let i = 0; i < subjects.length; i++) {
          Validations.isMixedString(subjects[i].subject)
      }

      //თუ დესქრიფშენი იქნება მაშინ დაავალიდირებს 
      if (description) {
        Validations.isMixedString(description)
      }
      
    }

    public add(data:pupilObj&teacherAdder):number{
        //გადმოცემული ინფორმაციის ვალიდაცია
        this.innerValidation(data)
        //თუ ყველაფერი სწორია მაშინ დავაგენერიროთ აიდი
        let id:number = Random.randBetween(1, 100000);
        while (this.TeachersMap.has(id)) {
        id = Random.randBetween(1, 100000)
    }
    //ვნახულობ ხომ არ არის მსგავსი სახელი და გვარით მეპში ადამიანი
    let objectarr : (pupilObj&teacherAdder)[] = Array.from(this.TeachersMap.values())
    for (let i = 0; i < objectarr.length; i++) {
      if (objectarr[i].name.first === data.name.first && objectarr[i].name.last === data.name.last) {
        throw new Error("there is teacher with such firstname and lastname")
      }
    }
    //დავამატებ მეპში ისე რომ აიდიც ქონდეს data-ს
    this.TeachersMap.set(id, { id: id, ...data })
    // console.log(this.TeachersMap);
    return id
    }



    public read(teacherId:number):pupilObj&teacherAdder {
        //თუ არ აქვს მსგავსი აიდი მაშინ დააბრუნებს false-ს თუ არადა დააბრუნებს ობიექტს
        if (!this.TeachersMap.has(teacherId)) {
          throw new Error("There is not such teahcer")
        }
        return this.TeachersMap.get(teacherId)
      }

    public update(id:number, newobj:pupilObj&teacherAdder) :string | boolean {
        //დაავალიდირებს გადმოცემულ ობიექტს
        this.innerValidation(newobj)  
        //ვნახავ თუ არის მეპში მსგავსი ადამიანი სხვა რადგან დუბლიკატები არ მქონდეს
        let objectarr:(pupilObj&teacherAdder)[] = Array.from(this.TeachersMap.values())
        for (let i = 0; i < objectarr.length; i++) {
          if (objectarr[i].name.first === newobj.name.first && objectarr[i].name.last === newobj.name.last) {
            return "there is teacher with such firstname and lastname"
          }
        }
        // console.log(this.TeachersMap);
        //თუ მეპში არის მსგავსი აიდი დააფდეითებს და თუ არარის დააბრუნებს there is not teacher with such id
        if (this.TeachersMap.has(id)) {
          this.TeachersMap.set(id, { id: id, ...newobj })
        } else {
          return "there is not teacher with such id"
        }
        // console.log(this.TeachersMap);
        return true
      }

    public remove(id: number): boolean {
        if (this.TeachersMap.has(id)) {
            this.TeachersMap.delete(id)
            return true
          } else {
            throw new Error("there is not teacher with such id")
          }
    }
    
    public log(){
      console.log(this.TeachersMap);
      
    }
} 



// let data:pupilObj&teacherAdder = {
//         "name": {
//         "first": "zura",
//         "last": "magalashvili"
//       },
//       "dateOfBirth": "2002-09-05", // format date
//       "emails": [
//         {
//           "email": "zuramagalashvili@gmail.com",
//           "primary": true
//         }
//       ],
//       "phones": [
//         {
//           "phone": "551566888",
//           "primary": true
//         }
//       ],
//       "sex": "male", // male or female
//       "subjects": [
//         {
//           "subject": "history" // just name property of subject.
//         }
//       ],
//       "description": "string",
// }


// var data2:pupilObj&teacherAdder = {
//     "name": {
//         "first": "nika",
//         "last": "mgeladze"
//     },
//     "dateOfBirth": "2002-09-05",
//     "emails": [
//         {
//             "email": "zuramagalashvili@gmail.com",
//             "primary": true
//         }
//     ],
//     "phones": [
//         {
//             "phone": "551566888",
//             "primary": true
//         },
//         {
//           "phone": "551566881",
//           "primary": false
//         },
//         {
//           "phone": "551566881",
//           "primary": true
//         }
//     ],
//     "sex": "male",
//     "subjects": [
//         {
//             "subject": "history" // just name property of subject.
//         }
//     ],
//     "description": "string",
// };

// let teach = new Teachers()

// let id=teach.add(data2);
// // let id2 = teach.add(data2)
// // console.log(teach.update(id,data2));
// console.log(teach.read(id));
// // console.log(teach.remove(id));
// // console.log(teach.read(id));

import { Validations } from "./validations.js"
import { Random } from "./random.js"

export class Pupils {
  #counter = 0;
  #pupilsMap;

  constructor() {
    this.#pupilsMap = new Map();
  }
  #pupilValidator(data) {
    if (data) {
      Validations.isObject(data);
    } else {
      throw new Error("Parameter should be provided")
    }
    let {
      name: {
        first,
        last,
      },
      dateOfBirth, // format date
      phones, //array of phones
      sex, // male OR female
      description,
      ...rest
    } = data
    //თუ რამეა rest-ში ესეიგი არასწორად დავალიდირებული ობიექტია და err
    if (Object.keys(rest).length !== 0) {
      throw new Error("Object is not formated well, it have unexpected filed(s)")
    }
    //თუ რომელიმე required ველი არაა გადმოცემული err და თუ არის დავალიდირდება
    if (!(first && last && dateOfBirth && phones && sex && description)) {
      throw new Error("first && last && dateOfBirth && phones && sex && description should be provided, they're required fields")
    }

    Validations.onlyCharacters(first)
    Validations.onlyCharacters(last)
    Validations.isValidDateFormat(dateOfBirth)
    //ტელეფონის ვალიდაცია და პარალელურად ის რომ არ იყოს ერთზე მეტი primary ტელეფონის ნომერი
    for (let i = 0; i < phones.length; i++) {
      if (phones[i].phone && (phones[i].primary === true || phones[i].primary === false)) {
        Validations.isValidPhoneNumberFormat(phones[i].phone)
        Validations.isBoolean(phones[i].primary)
      } else {
        throw new Error("phone and primary fiels are required")
      }
      if (phones[i].primary === true) {
        this.#counter++;
      }
    }
    if (this.#counter > 1 || this.#counter === 0) {
      this.#counter = 0;
      throw new Error("There should be only one primary phone")
    }
    this.#counter = 0;
    //სქესის ვალიდაცია male ან female
    Validations.isValidGender(sex)
    //თუ დესქრიფშენი აქვს დაავალიდირებს
    if (description) {
      Validations.isMixedString(description)
    }
  }

  #checkIfExists(obj) {
    //ეს ამოწმებს სახელს გვარს ტელეფონს რომ იგივე ხალხი არ დაემატოს და არ დააბინძუროს კონტეინერი ერთნაირი ობიექტებით
    //უფრო მეტი ვალიდაცია მეწერა აქ მარა ესეც საკმარისია
    let counter = 0
    let arrOfCont = Array.from(this.#pupilsMap.values());
    for (let i = 0; i < arrOfCont.length; i++) {
      if (arrOfCont[i].name.first === obj.name.first &&
        arrOfCont[i].name.last === obj.name.last
      ) {
        for (let j = 0; j < arrOfCont[i].phones.length; j++) {
          for (let x = 0; x < obj.phones.length; x++) {
            if (arrOfCont[i].phones[j].phone === obj.phones[x].phone
              && arrOfCont[i].phones[j].length === obj.phones[x].length) {
              counter++
            }
          }
        }
      }
      if (counter === obj.phones.length) {
        counter = 0;
        return true
      }
    }
    return false
  }

  add(data) {
    this.#pupilValidator(data)
    //თუ ვალდიაციას გაივლის დაგენერირდება id
    let id = Random.randBetween(1, 100000)
    while (this.#pupilsMap.has(id)) {
      id = Random.randBetween(1, 100000)
    }
    // ჩექერი ხომ არ არის საჭირო რომ იგივე ობიექტი არ დაემატოს
    if (this.#checkIfExists(data)) {
      return "there is such person in pupils container"
    }
    //სეტავს ახალ ობიექტს შიგნით id-თ
    this.#pupilsMap.set(id, { id: id, ...data })
    // console.log(this.#pupilsMap);
    return this.#pupilsMap.get(id)
  }

  read(id) {
    //შეამოწმებს თუ არის id გადმოწოდებული და თუ არის დაავალიდირებს
    if (id) {
      Validations.isNumeric(id)
    } else {
      throw new Error(`${id} should be number`)
    }
    //შეამოწმებს თუ აქვს ასეთი აიდი მაპში თუ არ აქვს false დააბრუნებს თუ არადა ობიექტს
    if (!this.#pupilsMap.has(id)) {
      return false
    }
    return this.#pupilsMap.get(id)
  }

  update(id, newObj) {
    //შეამოწმებს სწორი ობიექტია თუ არა
    this.#pupilValidator(newObj)
    //შეამოწმებს არის თუ არა გადმოწოდებული id და თუ არი დაავალიდირებს
    if (id) {
      Validations.isNumeric(id)
    } else {
      throw new Error('id must be provided')
    }
    //იგივე ობიექტი არის თუ არა მაპში მაგის შემოწმებაც 
    if (this.#checkIfExists(newObj)) {
      return "there is such person in pupils container"
    }
    //შეამოწმებს არის თუ არა ასეთი აიდი მაპში
    if (!this.#pupilsMap.has(id)) {
      return false
    } else {
      this.#pupilsMap.set(id, { id: id, ...newObj })
      // console.log(this.#pupilsMap);
    }
    return true
  }

  remove(id) {
    //შეამოწმებს არის თუ არა გადმოცემული აიდი და თუ არის დაავალიდირებს
    if (id) {
      Validations.isNumeric(id)
    } else {
      throw new Error('id must be provided')
    }
    //შეამოწმებს არსებობს თუ არა მსგავსი აიდი მეპში და თუ არ არსებობს დააბრუნებს false-ს თუ არადა წაშლის და დააბრუნებს true-ს
    if (!this.#pupilsMap.has(id)) {
      return false
    } else {
      this.#pupilsMap.delete(id)
      // console.log(this.#pupilsMap);
      return true
    }
  }
  // ----------------------------------------------------
//ამას წავშლი მერე )
readPupilsMap(){
  // console.log(this.#pupilsMap);
  return this.#pupilsMap

}
}

let data = {
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

let data2 = {
  "name": {
    "first": "zuka",
    "last": "kakauridze"
  },
  "dateOfBirth": "2022-08-10", // format date
  "phones": [
    {
      "phone": "551566881",
      "primary": true
    },
    {
      "phone": "551566889",
      "primary": false
    }
  ],
  "sex": "male", // male OR female 
  "description": "string"
}
// let pupils = new Pupils()
// const pupil = pupils.add(data);
// const pupil2 = pupils.add(data2);
// console.log(pupil2);
// console.log(pupil.id);
// console.log(pupils.read(pupil.id));
// console.log(pupils.update(pupil.id, data2));
// console.log(pupils.remove(pupil.id));



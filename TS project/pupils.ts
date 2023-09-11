import { Validations } from "./ValidationsTs";
import { Random } from "./RandomTs";
import { pupilObj } from "./interfaces";

export class Pupils{
private counter:number=0;
private pupilsMap:Map<number,pupilObj&{id:number}>;

constructor() {
    this.pupilsMap = new Map();
  }

  private pupilValidator(data:pupilObj):void{
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
    Validations.onlyCharacters(first)
    Validations.onlyCharacters(last)
    Validations.isValidDateFormat(dateOfBirth)
    //ტელეფონის ვალიდაცია და პარალელურად ის რომ არ იყოს ერთზე მეტი primary ტელეფონის ნომერი
    for (let i = 0; i < phones.length; i++) {
        Validations.isValidPhoneNumberFormat(phones[i].phone)
      if (phones[i].primary === true) {
        this.counter++;
      }
    }
    if (this.counter > 1 || this.counter === 0) {
      this.counter = 0;
      throw new Error("There should be only one primary phone")
    }
    this.counter = 0;
    //თუ დესქრიფშენი აქვს დაავალიდირებს
    if (description) {
      Validations.isMixedString(description)
    }
  }

  private checkIfExists(obj:pupilObj):boolean {
    //ეს ამოწმებს სახელს გვარს ტელეფონს რომ იგივე ხალხი არ დაემატოს და არ დააბინძუროს კონტეინერი ერთნაირი ობიექტებით
    let counter:number = 0
    let arrOfCont:(pupilObj&{id:number})[] = Array.from(this.pupilsMap.values());
    for (let i = 0; i < arrOfCont.length; i++) {
      if (arrOfCont[i].name.first === obj.name.first &&
        arrOfCont[i].name.last === obj.name.last)
      {
        for (let j = 0; j < arrOfCont[i].phones.length; j++) {
          for (let x = 0; x < obj.phones.length; x++) {
            if (arrOfCont[i].phones[j].phone === obj.phones[x].phone) {
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
 
  public add(input: pupilObj): pupilObj&{id:number} {
     this.pupilValidator(input)
    //თუ ვალდიაციას გაივლის დაგენერირდება id
    let id:number = Random.randBetween(1, 100000)
    while (this.pupilsMap.has(id)) {
      id = Random.randBetween(1, 100000)
    }
    // ჩექერი იმისთვის რომ იგივე ობიექტი არ დაემატოს    
    if (this.checkIfExists(input)) {
        throw new Error("object already exists")
    }
    //სეტავს ახალ ობიექტს შიგნით id-თ
    this.pupilsMap.set(id, { id: id, ...input })
    return this.pupilsMap.get(id)
  }

  public read(id:number):pupilObj&{id:number}{
    //შეამოწმებს თუ აქვს ასეთი აიდი მაპში თუ არ აქვს err თუ არადა ობიექტს
    if (!this.pupilsMap.has(id)) {
      throw new Error("we do not have such person")
    }
    return this.pupilsMap.get(id)
  }

  public update(id:number, newObj:pupilObj) {
    //შეამოწმებს სწორი ობიექტია თუ არა
    this.pupilValidator(newObj)
    //იგივე ობიექტი არის თუ არა მაპში მაგის შემოწმებაც 
    if (this.checkIfExists(newObj)) {
      return "there is such person in pupils container"
    }
    //შეამოწმებს არის თუ არა ასეთი აიდი მაპში
    if (!this.pupilsMap.has(id)) {
      return false
    } else {
      this.pupilsMap.set(id, { id: id, ...newObj })
    }
    return true
  }

  public remove(id: number): boolean {
      //შეამოწმებს არსებობს თუ არა მსგავსი აიდი მეპში და თუ არ არსებობს დააბრუნებს false-ს თუ არადა წაშლის და დააბრუნებს true-ს
      if (!this.pupilsMap.has(id)) {
        return false
      } else {
        this.pupilsMap.delete(id)
        return true
      }
  }
}


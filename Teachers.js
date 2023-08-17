import { Validations } from "./validations.js";
import { Random } from "./random.js";

export class Teachers {
  #TeachersMap
  #counter = 0
  constructor() {
    this.#TeachersMap = new Map();
  }

  #innerValid(data) {
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
      emails, //array of objects
      phones, //array of object
      sex, // male or female
      subjects, //array of objects
      description,
      ...rest
    } = data
    //თუ რამეა rest-ში ესეიგი არასწორად დავალიდირებული ობიექტია და err
    if (Object.keys(rest).length !== 0) {
      throw new Error("Object is not formated well, it have unexpected filed(s)")
    }
    //თუ რომელიმე required ველი არაა გადმოცემული err და თუ არის დავალიდირდება
    if (!(first && last && dateOfBirth && emails && phones && sex && subjects && description)) {
      throw new Error("first && last && dateOfBirth && emails && phones && sex && subjects && description should be provided, they're required fields")
    }
    Validations.onlyCharacters(first)
    Validations.onlyCharacters(last)
    Validations.isValidDateFormat(dateOfBirth)
    //ვალიდირდება ემაილის ყველა ველი და ასევე მოწმდება რომ იყოს ერთი primary ველი
    for (let i = 0; i < emails.length; i++) {
      if (emails[i].email && (emails[i].primary === true || emails[i].primary === false)) {
        Validations.isValidEmailFormat(emails[i].email)
        Validations.isBoolean(emails[i].primary)
      } else {
        throw new Error("email and primary fiels are required")
      }
      if (emails[i].primary === true) {
        this.#counter++;
      }
    }
    if (this.#counter > 1 || this.#counter === 0) {
      this.#counter = 0;
      throw new Error("There must one primary email")
    }
    this.#counter = 0;

    //ტელეფონის მასივის ვალიდაცია
    for (let i = 0; i < phones.length; i++) {
      if (phones[i].phone && (phones[i].primary === true || phones[i].primary === false)) {
        Validations.isValidPhoneNumberFormat(phones[i].phone)
        Validations.isBoolean(phones[i].primary)
      } else {
        throw new Error("email and primary fiels are required")
      }
      if (phones[i].primary === true) {
        this.#counter++;
      }
      if (this.#counter > 1 || this.#counter === 0) {
        this.#counter = 0;
        throw new Error("There should be only one primary phone")
      }
    }
    this.#counter = 0;
    //სქესის ვალიდაცია ან male ან female
    Validations.isValidGender(sex)
    //subject ვალიდაცია
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].subject) {
        Validations.isMixedString(subjects[i].subject)
      } else {
        throw new Error("subject field is required")
      }
    }
    //თუ დესქრიფშენი იქნება მაშინ დაავალიდირებს 
    if (description) {
      Validations.isMixedString(description)
    }
  }

  add(data) {
    //გადმოცემული ინფორმაციის ვალიდაცია
    this.#innerValid(data)
    //თუ ყველაფერი სწორია მაშინ დავაგენერიროთ აიდი
    let id = Random.randBetween(1, 100000);
    while (this.#TeachersMap.has(id)) {
      id = Random.randBetween(1, 100000)
    }
    //ვნახულობ ხომ არ არის მსგავსი სახელი და გვარით მეპში ადამიანი
    let objectarr = Array.from(this.#TeachersMap.values())
    for (let i = 0; i < objectarr.length; i++) {
      if (objectarr[i].name.first === data.name.first && objectarr[i].name.last === data.name.last) {
        return "there is teacher with such firstname and lastname"
      }
    }
    //დავამატებ მეპში ისე რომ აიდიც ქონდეს data-ს
    this.#TeachersMap.set(id, { id: id, ...data })
    // console.log(this.#TeachersMap);
    return id
  }

  read(teacherId) {
    //თუ არსებობს აიდი დაავალიდირებს
    if (teacherId) {
      Validations.isNumeric(teacherId)
    } else {
      throw new Error(`${teacherId} should be number`)
    }
    //თუ არ აქვს მსგავსი აიდი მაშინ დააბრუნებს false-ს თუ არადა დააბრუნებს ობიექტს
    if (!this.#TeachersMap.has(teacherId)) {
      return false
    }
    return this.#TeachersMap.get(teacherId)
  }

  update(id, newobj) {
    //დაავალიდირებს გადმოცემულ ობიექტს
    this.#innerValid(newobj)
    //თუ აიდი არსებობს მაშინ დაავალიდირებს თუ არადა err
    if (id) {
      Validations.isNumeric(id)
    } else {
      throw new Error("id should be passed")
    }
    //ვნახავ თუ არის მეპში მსგავსი ადამიანი სხვა რადგან დუბლიკატები არ მქონდეს
    let objectarr = Array.from(this.#TeachersMap.values())
    for (let i = 0; i < objectarr.length; i++) {
      if (objectarr[i].name.first === newobj.name.first && objectarr[i].name.last === newobj.name.last) {
        return "there is teacher with such firstname and lastname"
      }
    }
    console.log(this.#TeachersMap);
    //თუ მეპში არის მსგავსი აიდი დააფდეითებს და თუ არარის დააბრუნებს there is not teacher with such id
    if (this.#TeachersMap.has(id)) {
      this.#TeachersMap.set(id, { id: id, ...newobj })
    } else {
      return "there is not teacher with such id"
    }
    console.log(this.#TeachersMap);
    return true
  }

  remove(id) {
    //თუ არსებობს id მაშინ დაავალიდირებს
    if (id) {
      Validations.isNumeric(id)
    } else {
      throw new Error("id should be provoded")
    }
    //თუ მეპში არის მასწავლებელი მსგავსი აიდით წაშლის და დააბრუნებს წარმატებისთვის true-ს თუ 
    //არ არსებობს მსგავსი აიდი დააბრუნებს there is not teacher with such id 
    if (this.#TeachersMap.has(id)) {
      this.#TeachersMap.delete(id)
      return true
    } else {
      return "there is not teacher with such id"
    }
  }
}











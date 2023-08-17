export class Validations {
    //გადმოცემული არგუმენტი უბრალოდ სტრინგი იყოს მარტო რიცხვები არ დაიშვება "123"=== false, მარტო სიმბოლოებიც არ დაიშვება
    static isMixedString(value) {
        const numericPattern = /^[0-9]+$/;
        const symbolPattern = /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/\-|=]+$/;
        if (!(typeof value === 'string' && !numericPattern.test(value) && !symbolPattern.test(value) && value !== '')) {
            throw new Error(`Parameter:(${value}) should be string <not only symbols and not only numbers>`)
        }
    }
    //მხოლოდ რიცხვებს იღებს
    static isNumeric(value) {
        if (!(typeof value === 'number' && !isNaN(value))) {
            throw new Error(`Parameter:(${value}) is not numeric`)
        }
    }
    //ობიექტზე აბრუნებს true წინააღმდეგ შემთხვევაში false
    static isObject(obj) {
        if (!(typeof obj === 'object' && !Array.isArray(obj) && obj !== null)) {
            throw new Error(`Parameter:(${obj}) is not object`)
        }
    }
    //იღებს მარტო სიმბოლოებს
    static onlyCharacters(value) {
        const letterPattern = /^[a-zA-Z]+$/;
        if (!(letterPattern.test(value))) {
            throw new Error(`${value} must only contain characters`)
        }
    }
    //იღებს მხოლოდ სპეციფიურად დაწერილ თარიღს 
    static isValidDateFormat(value) {
        if (!(new Date(value) < new Date)) { //yyyy-mm-dd
            throw new Error("date shoul be formatted like that: yyyy-mm-dd and must be string")
        }
    }
    //იღებს მხოლოდ ვალიდურ იმეილს
    static isValidEmailFormat(email) {
        const emailFormatPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailFormatPattern.test(email)) {
            throw new Error("Invalid email format");
        }
    }
    //იღებს მხოლოდ bool მნიშვნელობებს
    static isBoolean(value) {
        if (!(typeof value === 'boolean')) {
            throw new Error(`${value} type of ${typeof value} should be boolean`)
        }
    }
    //იღებს ყველანაირ 9 რიცხვს
    static isValidPhoneNumberFormat(phoneNumber) {  //9 რიცხვს მიიღებს ნებისიერს, მთავარია 0-ით არ იწყებოდეს
        const phoneNumberFormatPattern = /^[1-9]\d{8}$/;

        if (!phoneNumberFormatPattern.test(phoneNumber)) {
            throw new Error("Invalid phone number format");
        }
    }
    //გენდერის ვალიდატორი იღებს მხოლოდ male და famale-ს
    static isValidGender(gender) {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(gender.toLowerCase())) {
            throw new Error("Invalid gender");
        }
    }
}




export class Validations {
    //გადმოცემული არგუმენტი უბრალოდ სტრინგი იყოს მარტო რიცხვები არ დაიშვება "123"=== false, მარტო სიმბოლოებიც არ დაიშვება
    static isMixedString(value:string):void{
        const numericPattern = /^[0-9]+$/;
        const symbolPattern = /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/\-|=]+$/;
        if (!(!numericPattern.test(value) && !symbolPattern.test(value) && value !== '')) {
            throw new Error(`Parameter:(${value}) should not be only symbols and not only numbers`)
        }
    }

    //მხოლოდ რიცხვებს იღებს
    static isNumeric(value:number):void{
        if (isNaN(value)) {
            throw new Error(`Parameter:(${value}) is not numeric`)
        }
    }

    //იღებს მარტო სიმბოლოებს
    static onlyCharacters(value:string):void{
        const letterPattern = /^[a-zA-Z]+$/;
        if (!(letterPattern.test(value))) {
            throw new Error(`${value} must only contain characters`)
        }
    }

    //იღებს მხოლოდ სპეციფიურად დაწერილ თარიღს 
    static isValidDateFormat(value:string):void{
        if (!(new Date(value) < new Date)) { //yyyy-mm-dd
            throw new Error("date shoul be formatted like that: yyyy-mm-dd and must be string")
        }
    }

    //იღებს მხოლოდ ვალიდურ იმეილს
    static isValidEmailFormat(email:string):void{
        const emailFormatPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailFormatPattern.test(email)) {
            throw new Error("Invalid email format");
        }
    }

    //იღებს ყველანაირ 9 რიცხვს
    static isValidPhoneNumberFormat(phoneNumber:string):void {  //9 რიცხვს მიიღებს ნებისიერს, მთავარია 0-ით არ იწყებოდეს
        const phoneNumberFormatPattern = /^[1-9]\d{8}$/;

        if (!phoneNumberFormatPattern.test(phoneNumber)) {
            throw new Error("Invalid phone number format");
        }
    }
}




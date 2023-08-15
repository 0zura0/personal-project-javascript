 export class Validations{
    //გადმოცემული არგუმენტი უბრალოდ სტრინგი იყოს მარტო რიცხვები არ დაიშვება "123"=== false, მარტო სიმბოლოებიც არ დაიშვება
    static isMixedString(value) {
        const numericPattern = /^[0-9]+$/;
        const symbolPattern = /^[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/\-|=]+$/;
        if(!(typeof value === 'string' && !numericPattern.test(value) && !symbolPattern.test(value) && value!=='')){
            throw new Error(`Parameter:(${value}) should be string <not only symbols and not only numbers>`)
        }
    }
    //მხოლოდ რიცხვებს იღებს
    static isNumeric(value) {
        if(!(typeof value === 'number' && !isNaN(value))){
            throw new Error(`Parameter:(${value}) is not numeric`)
        }
    }
    //ობიექტზე აბრუნებს true წინააღმდეგ შემთხვევაში false
    static isObject(obj){
        if(!(typeof obj === 'object' && !Array.isArray(obj) && obj !== null )){
            throw new Error(`Parameter:(${obj}) is not object`)
        }
    }
}



import { Validations } from "./validations.js";
import { Random } from "./random.js";

class Groups{
    #groupMap
    constructor(){
        this.#groupMap=new Map()
    }
    add(room){
        //ვამოწმებ გადმოცემულია თუ არა room და თუ არუს ვალიდაციას ვუკეთებ თუ არადა err
        if(room){
            Validations.isNumeric(room)
        }else{
            throw new Error("Parameter should be provided")
        }
        //ვამოწმებ არის თუ არა ოთახი მსგავსი ნომერით
        let mapsArr = Array.from(this.#groupMap.values())
        for(let i=0;i<mapsArr.length;i++){
            if(mapsArr[i].room===room){
                return "we already have room with such roomNumber, duplicates doesn't accept"
            }
        }
        //ვაგენერირებ აიდის
        let id=Random.randBetween(1,100000)
        while(this.#groupMap.has(id)){
             id=Random.randBetween(1,100000)  
        }
        let map= new Map()
        this.#groupMap.set(id,{id:id,room:room,pupils:map})
        
        return id
    }

    addPupils(groupId,pupil){
        //შეამოწმებს არსებობს თუ არა, თუ არსებობს დავალიდირებს რომ number-ია თუ არადა err
        if(groupId){
            Validations.isNumeric(groupId)
        }else{
            throw new Error("parameter should be provided")
        }
        //შეამოწმებს არსებობს თუ არა თუ არსებობს დავალიდირებს რომ ობიექტია თუ არადა err
        if(pupil){
            Validations.isObject(pupil)
        }else{
            throw new Error("parameter should be provided")
        }

        //შეამოწმებს გვაქვს თუ არა room გადმოცემული groupid-თ
        if(this.#groupMap.has(groupId)){
            this.#groupMap.get(groupId).pupils.set(pupil.id,pupil);
        }else{
            return "There is not room with such id"
        }
        console.log(this.#groupMap);
        //ყველაფრის კარგად დასრულების შემთხვევაში აბრუნებს true-ს
        return true
    }

    removePupil(groupId,pupilID){
        //ამოწმებს არის თუ არა გადმოწვდილი groupid თუ არის ვალიდაციას უკეთებს რომ რიცხვი იყოს თუ არადა err
        if(groupId){
            Validations.isNumeric(groupId)
        }else{
            throw new Error("parameter should be provided")
        }
        //ამოწმებს არის თუ არა გადმოწვდილი pupilid თუ არის ვალიდაციას უკეთებს რომ რიცხვი იყოს თუ არადა err
        if(pupilID){
            Validations.isNumeric(groupId)
        }else{
            throw new Error("parameter should be provided")
        }
        //ამოწმებს არსებობს თუ არა room გადმოწოდებული id-თ
        if(!this.#groupMap.has(groupId)){
            throw new Error("There is not room with such id")
        }
        //ამოწმებს არის თუ არა ამ ოთახში მოსწავლე გადმოწვდილი id-თ, თუ არსებობს შლის თუ არადა აბრუნებს "we do not have pupil in that room with that id"
        if(this.#groupMap.get(groupId).pupils.has(pupilID)){
            this.#groupMap.get(groupId).pupils.delete(pupilID)
        }else{
            return "we do not have pupil in that room with that id"
        }
        //წაშლის შემთხვევაში აბრუნებს true-ს
        return true
    }
    update(groupId,obj){
        //ამოწმებს არის თუ არა გადმოწვდილი groupid თუ არის ვალიდაციას უკეთებს რომ რიცხვი იყოს თუ არადა err
        if(groupId){
            Validations.isNumeric(groupId)
        }else{
            throw new Error("parameter should be provided")
        }
        //ამოწმებს არის თუ არა გადმოწვდილი obj თუ არის ვალიდაციას უკეთებს რომ ობიექტი იყოს თუ არადა err
        if(obj){
            Validations.isObject(obj)
        }else{
            throw new Error("parameter should be provided") 
        }

        let {room,...rest}=obj
        //თუ rest ში რამე არის ესეიგი არასწორი ობიექტია გადმოწოდებული და მაშინ ერორი
        if(Array.from(Object.keys(rest)).length>0){
            throw new Error("Object have more propertys then it's required... it must have one propery room")
        }
        //თუ room ფტოფერტი არის გადმოცემულ ობიექტში მაშინ დაავალიდირებს თუ არადა ERR
        if(room){
            Validations.isNumeric(room)
        }else{
            throw new Error("In object room property is required")
        }
        //თუ გადმოწვდილი room-ის ნომერი უკვე აქვს სხვა ოთახს 
        //ანუ თუ გადმოწვდილ დასააფდეითებელ ოთახში უკვე არიან სხვა კლასის ბავშვები 
        //მაშინ მაშინ დააბრუნებს we already have room with such roomNumber, Duplicates does not accept
        let mapsArr = Array.from(this.#groupMap.values())
        for(let i=0;i<mapsArr.length;i++){
            if(mapsArr[i].room===room){
                return "we already have room with such roomNumber, duplicates doesn't accept"
            }
        }
        //შეამოწმებს არის თუ არა groupid აიდის მქონე room
        if(this.#groupMap.has(groupId)){
            this.#groupMap.get(groupId).room=room
        }else{
            return "we do not have pupil in that room with that id"
        }
        //წარმატებით დასრულების შემთხვევაში აბრუნებს true-ს
        return true
    }
    read(groupId){
        //ამოწმებს არის თუ არა გადმოწვდილი groupid თუ არის ვალიდაციას უკეთებს რომ რიცხვი იყოს თუ არადა err
        if(groupId){
            Validations.isNumeric(groupId)
        }else{
            throw new Error("parameter should be provided")
        }
         //შეამოწმებს არის თუ არა მსგავსი აიდის მქონე room თუ არის დააბრუნებს პასუხს სწორი ფორმატით თუ არა დააბრუნებს there is not room with such id
         if(this.#groupMap.has(groupId)){
            let obj = this.#groupMap.get(groupId);
            let pupils = this.#groupMap.get(groupId).pupils;
            return {id:obj.id,
                    room:obj.room,
                    pupils:Array.from(pupils.values())}
        }else{
            return "there is not room with such id"
        }
    }
    readAll(){
        //აბრუნებს ყველა მონაცემს სწორი ფორმატით
        let temparr=[]
        let arr =Array.from(this.#groupMap.values());
        for(let i=0;i<arr.length;i++){
            let val = arr[i];
            let tempObj={
                id:val.id,
                room:val.room,
                pupils:Array.from(val.pupils.values())
            }
            temparr.push(tempObj)
        }
        return temparr
    }

}


const room = 236;
const groups = new Groups();
const groupId = groups.add(room);

let data={
    "id":1,
    "name": {
      "first": "nika",
      "last": "kakauridze"
    },
    "dateOfBirth": "2022-08-10", // format date
    "phones": [
      {
        "phone": "551566889",
        "primary": true 
      }
    ],
    "sex": "male", // male OR female 
    "description": "string"
  }

  const add =groups.addPupils(groupId,data)
//   console.log(data.id);
//   groups.removePupil(groupId, data.id)

//   console.log(groups.update(groupId, {
//     room: 237,
//   }));

//   console.log(groups.read(groupId));

// {
//   id: 'JEF5H43H'
//   room: 237,
//   pupils:[] // array of pupils.     
// }

// console.log(groups.readAll()); 

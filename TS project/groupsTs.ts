import { Random } from "./RandomTs";
import {Igroups, pupilObj,ReadIgroup} from "./interfaces"


export class Groups{
    private groupMap:Map<number,Igroups>;
    constructor() {
        this.groupMap = new Map()
    }

    public add(room:number):number{
        //ვამოწმებ არის თუ არა ოთახი მსგავსი ნომერით
        let mapsArr:Igroups[]= Array.from(this.groupMap.values())
        for (let i = 0; i < mapsArr.length; i++) {
            if (mapsArr[i].room === room) {
                throw new Error("we already have room with such roomNumber, duplicates doesn't accept")
            }
        }
        //ვაგენერირებ აიდის
        let id:number = Random.randBetween(1, 100000)
        while (this.groupMap.has(id)) {
            id = Random.randBetween(1, 100000)
        }
        let map:Map<number,pupilObj&{id:number}> = new Map()
        this.groupMap.set(id, { id: id, room: room, pupils: map })
        // console.log(mapsArr);
        return id
    }
    public addPupil(groupId:number, pupil:pupilObj&{id:number}):boolean{
        //შეამოწმებს გვაქვს თუ არა room გადმოცემული groupid-თ
        if (this.groupMap.has(groupId)) {
            this.groupMap.get(groupId).pupils.set(pupil.id, pupil);
        } else {
            throw new Error("There is not room with such id")
        }
        // console.log(this.groupMap.get(groupId).pupils);
        //ყველაფრის კარგად დასრულების შემთხვევაში აბრუნებს true-ს
        return true
    }

    public removePupil(groupId:number, pupilID:number):boolean{
        //ამოწმებს არსებობს თუ არა room გადმოწოდებული id-თ
        if (!this.groupMap.has(groupId)) {
            throw new Error("There is not room with such id")
        }
        //ამოწმებს არის თუ არა ამ ოთახში მოსწავლე გადმოწვდილი id-თ, თუ არსებობს შლის თუ არადა აბრუნებს "we do not have pupil in that room with that id"
        if (this.groupMap.get(groupId).pupils.has(pupilID)) {
            this.groupMap.get(groupId).pupils.delete(pupilID)
        } else {
            throw new Error("we do not have pupil in that room with that id")
        }
        //წაშლის შემთხვევაში აბრუნებს true-ს
        return true
    }

    public update(groupId:number, obj:{room:number}):boolean{
        let { room, ...rest } = obj
        //თუ rest ში რამე არის ესეიგი არასწორი ობიექტია გადმოწოდებული და მაშინ ერორი
        if (Array.from(Object.keys(rest)).length > 0) {
            throw new Error("Object have more propertys then it's required... it must have one propery room")
        }
        //თუ გადმოწვდილი room-ის ნომერი უკვე აქვს სხვა ოთახს 
        //ანუ თუ გადმოწვდილ დასააფდეითებელ ოთახში უკვე არიან სხვა კლასის ბავშვები 
        //მაშინ მაშინ დააბრუნებს we already have room with such roomNumber, Duplicates does not accept
        let mapsArr:Igroups[] = Array.from(this.groupMap.values())
        for (let i = 0; i < mapsArr.length; i++) {
            if (mapsArr[i].room === room) {
                throw new Error("we already have room with such roomNumber, duplicates doesn't accept")
            }
        }
        //შეამოწმებს არის თუ არა groupid აიდის მქონე room
        if (this.groupMap.has(groupId)) {
            this.groupMap.get(groupId).room = room
        } else {
            throw new Error("we do not have pupil in that room with that id")
        }
        //წარმატებით დასრულების შემთხვევაში აბრუნებს true-ს
        return true
    }

   public read(groupId:number):ReadIgroup{
        //შეამოწმებს არის თუ არა მსგავსი აიდის მქონე room თუ არის დააბრუნებს პასუხს სწორი ფორმატით თუ არა 
        //დააბრუნებს there is not room with such id
        if (this.groupMap.has(groupId)) {
            let obj = this.groupMap.get(groupId);
            let pupils = this.groupMap.get(groupId).pupils;
            return {
                id: obj.id,
                room: obj.room,
                pupils: Array.from(pupils.values())
            }
        } else {
            throw new Error("there is not room with such id")
        }
    }

    public readAll():ReadIgroup[]{
        //აბრუნებს ყველა მონაცემს სწორი ფორმატით
        let temparr:ReadIgroup[]= []
        let arr:Igroups[] = Array.from(this.groupMap.values());
        for (let i = 0; i < arr.length; i++) {
            let val = arr[i];
            let tempObj = {
                id: val.id,
                room: val.room,
                pupils: Array.from(val.pupils.values())
            }
            temparr.push(tempObj)
        }
        return temparr
    }

    public log(){
        console.log(this.groupMap);
        
    }
}


// const room = 236;
// const room2=500;
// const groups = new Groups();

// let pupil:pupilObj&{id:number} ={
//     "id":1,
//     "name": {
//       "first": "zura",
//       "last": "magalashvili"
//     },
//     "dateOfBirth": "2002-09-05", // format date
//     "phones": [
//       {
//         "phone": "551566888",
//         "primary": true
//       }
//     ],
//     "sex": "male", // male OR female
//     "description": "string"
//   }
        
// // Create a new group. add methods takes integer as a parameter. returns id of group
// const groupId = groups.add(room);
// const groupId2 = groups.add(room2);
// groups.log()

// // Add this pupil to this group
// groups.addPupil(groupId, pupil);

// // Remove this pupil from this group
// groups.removePupil(groupId, pupil.id);

// // Update room for this group
// groups.update(groupId, {
//   room: 237
// });

// // Read information about group
// groups.read(groupId);
// // {
// //   id: 'JEF5H43H'
// //   room: 237,
// //   pupils:[] // array of pupils.     
// // }

// // It will return array of groups
// groups.readAll() 

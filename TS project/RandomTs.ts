export class Random {
    static randBetween(min:number, max:number):number {
        //ამ ფუნქციას გადასცემ ორ რიცხვს და ამ ორ რიცხვს შორის გიგენერირებს მთელ რიცხვებს
        if (min > max) {
            [min, max] = [max, min]
        }
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
} 
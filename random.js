export class Random{
    static randBetween(min,max){
     if(min>max){
         [min,max] = [max,min]
     }
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
     }
 }
const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field){
        this.fieldGrid = field;
    }
    print(){
        // print out a string representation of the board. .join('') on each row array to join up elements without spaces in a new string.
        this.fieldGrid.forEach((fieldRow)=>{
            console.log( fieldRow.join('') );
        });
    }
};
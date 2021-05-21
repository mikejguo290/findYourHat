const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field){
        this.fieldGrid = field;
        this.moves=[];
        this.continueGame=true;
        this.currentCoordinates=[0,0];  // [x, y]
    };

   
    print(){
        // print out a string representation of the board. .join('') on each row array to join up elements without spaces in a new string.
        this.fieldGrid.forEach((fieldRow)=>{
            console.log( fieldRow.join('') );
        });
    };

    updateMoveHistory(move){
        // store a history of moves for the game. can't do time travel. 
        this.moves.concat([move]);
    }

    processInput(move){
        // 1. get new coordinates.

        // check whether coordinates work before assigning new coordinates! flaw in programme. 

        let direction = move.toUpperCase();
        let currentCoordinates=this.currentCoordinates;
        let newCoordinates;
        switch(direction){
            case 'U':
                // Up
                newCoordinates=[currentCoordinates[0] , currentCoordinates[1]-1 ];
                break;
            case 'D':
                // Down
                newCoordinates=[currentCoordinates[0] , currentCoordinates[1]+1 ];
                break;
            case 'L':
                // left
                newCoordinates=[currentCoordinates[0]-1 , currentCoordinates[1]];
                break;
            case 'R':
                 // right
                newCoordinates=[currentCoordinates[0]+1 , currentCoordinates[1]];
                break;
            default: 
                console.log('invalid move! Please choose from u, d, l, r as inputs')
                // in case input is not formatted correctly, let game continue as if player given another chance. location unchanged
                newCoordinates=this.currentCoordinates;
                break;

        }
        return newCoordinates;
    }

    processMove(coordinates){
        // 
        let x=coordinates[0]; 
        let y=coordinates[1];

        console.log(`x is ${x}`);
        console.log(`y is ${y}`); // coordinates can be out of bounds!
        // vet new coordinates before passing them to access field array values. 
        let field = this.fieldGrid;
        // if x < 0 or x > length of inner array
        // if y < 0 or y > length of outer array. 

        if ( y < 0 || y > field.length || x < 0 || x > field[0].length){
            return 'Out'
        }

        if (field[y][x]==='^'){
            return 'Won';
        }else if (field[y][x]==='O'){
            return 'Hole';
        }else{
            return 'Continue'; 
        };
    };
    
    updateFieldGrid(coordinates){
        let x = coordinates[0]
        let y = coordinates[1]
        let newFieldGrid = this.fieldGrid.map(x => x );
        newFieldGrid[y][x]="*";
        this.fieldGrid=newFieldGrid;
    }

    static generateField(height, width, percentage) {
        // use the height and width to generate a randomised 2D array representing the field with a hat and holes. 
        // the percentage is used to determine what percentage of the field should be covered in holes. 
        // there has to be at least one pothole.

        // the idea is to populate the arrays with '░' and then randomly insert the hat ^ and the holes O
        // calculate how many holes and find their coordinates 
        //update and return field Array.
        const fieldArray=[];
        // this creates a 2D array. 
        for (let i=0; i<height; i++){
            let rowArray=Array(width) // creates an array of filled with undefined.
            rowArray.fill('░', 0, width)
            fieldArray.push(rowArray);
        };
        
        // function to  return array of random coordinates.
        const createRandomCoordinates=(height, width)=>{
            const x=Math.floor(Math.random()*width);
            const y=Math.floor(Math.random()*height);
            return [x, y]
        }

        // calculate holes from percentage
        let holes = Math.floor(height * width * percentage / 100); // number of holes you need.
     
        //index of randomly selected holes, taken without replacement from all available index..    
        let startCoordinates=[0,0]
        // static method has no concept of this.property.

        let selectedCoordinates=[]; // include starter coordinates here so generated coordinates will not duplicate it. 
        let holesInserted=0
        while(holesInserted<holes){
             // select a random coordinate and if it isn't already recorded, update the field and added it to the list of coordinates for the holes. 
            let randomCoordinates=createRandomCoordinates(height, width);
            if (!selectedCoordinates.includes(randomCoordinates) && JSON.stringify(randomCoordinates)!==JSON.stringify(startCoordinates) ){// arrays are objects. so === only returns true if the arrays have the same reference!
                let x = randomCoordinates[0]
                let y = randomCoordinates[1]
                fieldArray[y][x]='O';
                selectedCoordinates.push(randomCoordinates);
                holesInserted+=1;
            };
        };

        // place the hat randomly in the field
        let hat=[]
        while(hat.length===0){
            let randomCoordinates=createRandomCoordinates(height, width);
            if (!selectedCoordinates.includes(randomCoordinates) && JSON.stringify(randomCoordinates)!==JSON.stringify(startCoordinates)){
                let x = randomCoordinates[0]
                let y = randomCoordinates[1]
                fieldArray[y][x]='^';
                hat.push(randomCoordinates);
            }
        }

        // debugging code
        
        console.log(`number of holes required is ${holes}`);
        console.log('holes index is ');
        console.log(selectedCoordinates); 
        console.log('field array is ');
        console.log(fieldArray);
        console.log('start coordinates ');
        console.log();
        
    }

    runGame(){
        let continueGame=this.continueGame;
        // 0. print field at the start of the game
        this.print();
        while(continueGame){
            
            // 1, promptForMove() 
            const move=prompt('which way to move? ');

            // update history of moves
            this.updateMoveHistory(move);

            // 2. get new coordinates.
            let newCoordinates=this.processInput(move); // this line could move into processMove, then processMove(move) would suffice. 
            
            // 3. check whether new coordinates is legal for the player, or if they've won. 
            let gameStatus=this.processMove(newCoordinates);

            // 4. do something conditional on gameStatus. // this could also move into processMove. 
            if (gameStatus==='Won'){
                console.log('Congrats! You found your hat!');
                this.continueGame=false;
                return;
                
            }else if(gameStatus==='Hole'){
                console.log('Sorry. You fell down a hole')
                this.continueGame=false;
                return;
                
            }else if(gameStatus==='Out'){
                console.log('Out of bounds instruction given')
                this.continueGame=false;
                return;
            }
            else{ 
                // 5. update properties. 
                // if the process hasn't stopped yet. update fieldGrid with a * to show where player is in the new location after the move.  
                this.updateFieldGrid(newCoordinates);

                // 6. update player location
                let x = newCoordinates[0];
                let y = newCoordinates[1];
                this.currentCoordinates=[x, y]
                // 7. print out what the field looks like after each move. 
                this.print();
                // debugging
                console.log(this.moves);
                console.log(this.continueGame);
                console.log(this.currentCoordinates);
            };
        
        };
    };
};

/* Game has to be able to update the fieldGrid to allow a print out after each move. 
    It has to support keeping track the number of moves made to allow board to updat properly 
    It has to understand what is a legal move and what cause the player to lose
    It has to keep track of where the player was before, to work out where it can end up. and whether that move is legal or not!

    // propse new move
        // check legality - terminate game if necessary. don't render winning or illgal moves
        // update grid
    */
const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
    ]);

//myField.runGame();

Field.generateField(4,4,34);
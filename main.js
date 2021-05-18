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
                break;

        }
        return newCoordinates;
    }

    checkGameStatus(coordinates){
        // 
        let x=coordinates[0]; 
        let y=coordinates[1];

        console.log(`x is ${x}`);
        console.log(`y is ${y}`); // coordinates can be out of bounds!
        
        let field = this.fieldGrid;
        if (field[y][x]==='^'){
            return 'Won';
        }else if (field[y][x]==='O'){
            return 'Hole';
        }else if(field[y][x]===undefined){
            return 'Out'
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
    // 
    runGame(){
        let continueGame=this.continueGame;
        // 0. print field at the start of the game
        this.print();
        while(continueGame){
            
            // 1, promptForMove() 
            const move=prompt('which way to move?');
            this.updateMoveHistory(move);

            // 2. get new coordinates.
            let newCoordinates=this.processInput(move);
            
            // 3. check whether new coordinates is legal for the player, or if they've won. 
            let gameStatus=this.checkGameStatus(newCoordinates);

            // 4. do something conditional on gameStatus. 
            if (gameStatus==='Won'){
                console.log('Congrats! You found your hat!');
                this.continueGame=false;
                return;
                // exit runGame???
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

myField.runGame();
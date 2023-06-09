import { Next } from "futura";
import { checkIfGlyph, getUnicodeCharacter } from "../../services/lib";
import { Alphabet, Letter, Status } from "../../services/models/alphabet";
import { Solved } from "../solved";
//import shabdkosh from '../../shabdkosh.json';

/** State */
export class Unsolved implements Unsolved.State {
  public static init = (): Next<Unsolved> => ({
    state: new Unsolved(
      "विमान",
      [],
      0,
      ({  
        glyphs: ([2305, 2306, 2307]
        .concat(Array.from(Array(2381 - 2364 + 1).keys()).map(x => x + 2364))
        .filter((value) => ![2374, 2378, 2365].includes(value)))
        .map(fillLetters),
        vowels: (Array.from(Array(2324 - 2309 + 1).keys()).map(x => x + 2309))
        .map(fillLetters),
        consonants: (Array.from(Array(2361 - 2325 + 1).keys()).map(x => x + 2325))
        .map(fillLetters),
      })
    ),
    requests: [
    ],
  });

  public update(message: any): Next<Unsolved | Solved> {
    if(message instanceof EnterLetter &&
        ((this.alphabet.glyphs.some((value) => value.characterCode === message.letter.characterCode)) ||
        (!this.currentIndex || (this.currentIndex) % 3 ||
        (this.grid.every((value, index) => (index >= this.currentIndex) ||
          value.status !== Status.Unselected))))) {
      
      const { glyphs } = this.alphabet;
      const isGlyph = (glyphs.some((value) => value.characterCode === message.letter.characterCode) || (this.grid[this.currentIndex] && this.grid[this.currentIndex].characterCode === 2381));
      const currentIndex = this.currentIndex < 15 && !isGlyph
                          ? this.currentIndex + 1
                          : this.currentIndex;

      return {
        state: new Unsolved(
          this.answer,
          [...this.grid, message.letter],
          currentIndex,
          this.alphabet,
        ),
      };
    } else if (message instanceof RemoveLetter) {
      if(this.grid[this.grid.length - 1].status !== Status.Unselected){
        return { state: this };
      }

      return {
        state: new Unsolved(
          this.answer,
          this.grid.slice(0, this.grid.length - 1),
         (this.currentIndex - 1) >= 0 ? this.currentIndex - 1 : this.currentIndex,
          this.alphabet,
        ),
      };
    } else if (message instanceof Submit &&
      !((this.currentIndex) % 3)) {
      const answer: ReadonlyArray<Letter> = this.answer.split('').map((value) => ({
        characterCode: value.charCodeAt(0),
        character: value,
        status: Status.Unselected,
      }));

      const { glyphs } = this.alphabet;
      const checkGlyph = (answerIndex: number, gridIndex: number) =>
        (gridIndex + 1) < this.grid.length && (answerIndex + 1) < answer.length &&
        !checkIfGlyph(this.grid[gridIndex + 1], glyphs) &&
        checkIfGlyph(answer[answerIndex + 1], glyphs)


      let answerIndex = 0,
        gridIndex = this.grid.findIndex((value) => value.status === Status.Unselected),
        revealed = this.grid.filter((value) => value.status !== Status.Unselected);

      while(answerIndex < answer.length && gridIndex < this.grid.length){
        const answerLetter = answer[answerIndex].character;
        const letter = this.grid[gridIndex].character;

        if(answerLetter === letter){
          revealed.push({
            ...this.grid[gridIndex],
            status: Status.CorrectPosition,
            needsGlyph: checkGlyph(answerIndex, gridIndex),
          });
        } else if (letter && checkIfGlyph(this.grid[gridIndex], answer) &&
          checkIfGlyph(this.grid[gridIndex], revealed)){
          if(checkIfGlyph(answer[answerIndex], glyphs) &&
            !checkIfGlyph(this.grid[gridIndex], glyphs)){
            answerIndex++;
            continue;
          }
          
          revealed.push({
            ...this.grid[gridIndex],
            status: Status.IncorrectPosition,
            needsGlyph: checkGlyph(answerIndex, gridIndex),
          });

          if(checkIfGlyph(this.grid[gridIndex], glyphs) &&
            !checkIfGlyph(answer[answerIndex], glyphs)){
            gridIndex++;
            continue;
          }
        } else {
          
          if(checkIfGlyph(answer[answerIndex], glyphs) &&
          !checkIfGlyph(this.grid[gridIndex], glyphs)){
            answerIndex++;
            continue;
          }
          
          revealed.push({
            ...this.grid[gridIndex],
            status: Status.NotInWord,
          });

          if(checkIfGlyph(this.grid[gridIndex], glyphs) &&
          !checkIfGlyph(answer[answerIndex], glyphs)){
            gridIndex++;
            continue;
          }
        }

        gridIndex++;
        answerIndex++;
      }

      return {
        state: new Unsolved(
          this.answer,
          revealed,
          this.currentIndex,
          this.alphabet
        )
      };
    } else {
      return { state: this };
    }
  }

  public subscriptions = () => [
    
  ]

  private constructor(
    readonly answer: string,
    readonly grid: ReadonlyArray<Letter>,
    readonly currentIndex: number,
    readonly alphabet: Alphabet,
  ) {}
}

// const getAnswer = () => {
//   return shabdkosh[Math.floor(Math.random() * (shabdkosh.length))]
// }


const fillLetters = (characterCode: number) => ({
  characterCode,
  character: getUnicodeCharacter(characterCode),
  status: Status.Unselected,
});


/** Types */

export namespace Unsolved {
  export interface State {
    readonly answer: string;
    readonly grid: ReadonlyArray<Letter>;
    readonly currentIndex: number;
    readonly alphabet: Alphabet;
  }

  export type Message
  = Submit
  | EnterLetter
  | RemoveLetter;
}


/** Messages */
export class EnterLetter {
  constructor(readonly letter: Letter){}
}

export class RemoveLetter {}

export class Submit {}

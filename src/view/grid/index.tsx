import React from 'react';
import { Dispatch } from "futura";
import { checkIfGlyph, getUnicodeCharacter } from '../../services/lib';
import { makeStyles} from "@material-ui/core/styles";
import { Unsolved } from '../../state/unsolved';
import { Letter, Status } from '../../services/models/alphabet';
import InputTile from './input-tile';
import Revealed from './revealed';
import { EndModal } from '../end-modal';

const useStyles = makeStyles((revealedAnswer: boolean) => ({
  row: {
    margin: 0,
		backgroundColor: revealedAnswer ? "white" : "transparent",
		padding: "0px 30px",
		borderColor: "black",
		borderStyle: revealedAnswer ? "groove" : "none",
  },
}));

const Grid: React.FunctionComponent<Props> = ({ state, dispatch }) => {
	const { alphabet, grid, currentIndex } = state;

	const filledGrid = (grid.length)
		? grid.concat(new Array(
		grid.reduce((acc: number, val: Letter, index: number) => {
			const count = acc - (val &&
				val.characterCode &&
				(!alphabet.glyphs.some(value => val.characterCode === value.characterCode) &&
				!(grid[index - 1] &&
					grid[index -1].characterCode === 2381))
				? 1
				: 0);

			return count;
		}
	, 3*5)).fill({}))
	: new Array(3*5).fill({});

	let rows: Array<Array<Letter>> = [];
	let count = 0;
	let start = 0;

	for(let i = 0; i < filledGrid.length; i++){
		if(!alphabet.glyphs.some((value) => value.characterCode === filledGrid[i].characterCode) && !(filledGrid[i] && filledGrid[i].characterCode && filledGrid[i - 1] && filledGrid[i - 1].characterCode === 2381)){
			count++;
		}

		if((i + 1) < filledGrid.length &&
			(alphabet.glyphs.some((value) => value.characterCode === filledGrid[i].characterCode) ||
			filledGrid[i].characterCode === 2381)){
			continue;
		}

		if(!(count % 3)) {
			rows.push(filledGrid.slice(start, (i + 1)));
			start = i + 1;
		}
	}

	return (
		<>
			{rows.map((value, index) => {
				const revealedAnswer = value.every((letter) =>
					letter.characterCode && letter.status !== Status.Unselected);

					const isGlyph = (letter: Letter) => alphabet.glyphs.some((value) => value.characterCode === letter.characterCode);

					return (
						<p
							key={index}
							style={{
								margin: 0,
								backgroundColor: "transparent",
								alignSelf: "center",
								width: "max-content",
								padding: "0px 30px",
								borderColor: "black",
								borderStyle: revealedAnswer ? "groove" : "none",
							}}>
						{revealedAnswer
							? value
							.map((letter, index) => {
								if((index + 1) < value.length && isGlyph(value[index + 1])){
									return value[index + 1];
								} else if ((index - 1) >= 0 && isGlyph(letter)){
									return value[index - 1];
								} else {
									return letter;
								}
							})
							.map((letter) =>
								<Revealed
									key={Math.random()}
									letter={letter}
									glyphs={alphabet.glyphs} />)
							: value.map((letter, count) => {
								const current = letter && letter.characterCode && makeGlyph(value, alphabet.glyphs, letter, count);

								return (alphabet.glyphs.includes(letter) || (letter.characterCode && value[count - 1] && value[count - 1].characterCode === 2381))
								? <></>
								: <InputTile
										key={Math.random()}
										character={current || ""}
										autofocus={((index * 3) + count) === currentIndex} />   
							})}
						</p>
					);
			})}
		</>
	);
}

const makeGlyph = (
	row: ReadonlyArray<Letter>,
	glyphs: ReadonlyArray<Letter>,
	letter: Letter,
	index: number,
): string => (
	(index + 1) < row.length &&
	row[index + 1] &&
	row[index + 1].characterCode &&
	glyphs.includes(row[index + 1])
	? (getUnicodeCharacter(letter.characterCode) + makeGlyph(row, glyphs, row[index + 1], index + 1))
	: ( letter.characterCode === 2381
		? getUnicodeCharacter(letter.characterCode) + makeGlyph(row, glyphs, row[index + 1], index + 1)
		: getUnicodeCharacter(letter.characterCode) || ""));


interface Props {
	readonly state: Unsolved.State;
	readonly dispatch: Dispatch<Unsolved.Message>;
}

export default Grid;
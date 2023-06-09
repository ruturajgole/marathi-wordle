export interface Alphabet {
	readonly vowels: ReadonlyArray<Letter>;
	readonly consonants: ReadonlyArray<Letter>;
	readonly glyphs: ReadonlyArray<Letter>;
}

export interface Letter {
	readonly characterCode: number;
	readonly character?: string;
	readonly status: Status;
	readonly needsGlyph?: boolean;
}

export enum Status {
	Unselected = "ghostwhite",
	NotInWord = "grey",
	CorrectPosition = "lightgreen",
	IncorrectPosition = "gold",
}
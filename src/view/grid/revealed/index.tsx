import { makeStyles } from "@material-ui/styles";
import { Letter } from "../../../services/models/alphabet";

const useStyles = makeStyles(({
	answered: {
	display: "inline-flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "transparent",
    borderColor: "white",
    color: "white",
    height: "70px",
    width: "70px",
    fontWeight: "bolder",
    margin: "0px",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "xxx-large",
    lineHeight: 0,
	},
}));

const diacritics = {
	rightAligned: [2366, 2368, 2377, 2379, 2380],
	leftAligned: [2367],
};

const Revealed: React.FunctionComponent<Props> = ({ glyphs, letter}) => {
	const classes = useStyles();

	return glyphs.some((value) => value.characterCode === letter.characterCode)
	? <span
			key={Math.random()}
			className={classes.answered}
			style={{
				position: "absolute",
				color: letter.status,
				justifyContent: diacritics.rightAligned.includes(letter.characterCode)
				? "right"
				: diacritics.leftAligned.includes(letter.characterCode)
					? "left"
					: "center"
			}}>&nbsp;{letter.character}
		</span>
	: <span
			key={Math.random()}
			className={classes.answered}
			style={{
				color: letter.status,
				borderRadius: "50px",
				backgroundColor: letter.needsGlyph ? "purple" : "none",
			}}>{letter.character}
		</span>;
}

interface Props {
	readonly glyphs: ReadonlyArray<Letter>;
	readonly letter: Letter;
}

export default Revealed;
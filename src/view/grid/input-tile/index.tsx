import { makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
	input: {
    backgroundColor: "transparent",
    borderColor: "white",
    color: "white",
    height: "70px",
    width: "70px",
    fontWeight: "bolder",
    margin: "10px",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "xxx-large",
    lineHeight: 0,
	}
}));

const InputTile: React.FunctionComponent<Props> = ({ character, autofocus }) => {
	const classes = useStyles();
	
	return (
		<input
			disabled
			style={{backgroundColor: "transparent"}}
			key={Math.random()}
			defaultValue={character || " "}
			autoFocus={autofocus}
			maxLength={1}
			className={classes.input}
			type="text" />
	);
}

interface Props {
	readonly character: string;
	readonly autofocus: boolean;
}

export default InputTile;
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    overlay: {
        opacity: 0.7,
        userSelect: "none",
    },
    paper: {
        "&.paper": { position: "relative", overflow: "hidden" },
        "&.paper .control-wrapper": { opacity: 0, zIndex: -1 },
        "&.paper.active-hover:hover .control-wrapper": { opacity: 1, zIndex: 0, cursor: "pointer" },
        "&.paper.active-hover:hover": { opacity: 1, zIndex: 0, cursor: "pointer" },
        "& .control-wrapper": {
            padding: 8,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgb(255 255 255 / 80%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
        },
    },
}));

export default useStyles
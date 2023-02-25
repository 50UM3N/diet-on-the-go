import { Center, createStyles, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: 8,
        paddingTop: 8,
        paddingBottom: 8,
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
        backgroundColor: theme.colors.gray[0],
    },
    copyrignt: {
        color: theme.colors.dark[2],
        fontSize: 12,
    },
}));

const Footer = () => {
    const { classes } = useStyles();
    return (
        <footer className={classes.footer}>
            <Center>
                <Text className={classes.copyrignt}>
                    {" "}
                    Diet On The Go © 2022-2023
                </Text>
            </Center>
        </footer>
    );
};

export default Footer;

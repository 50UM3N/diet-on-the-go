import { Badge, Center, DefaultMantineColor, Paper, PaperProps, Text, Title, useMantineColorScheme } from "@mantine/core";

const MacroCard = ({ type, amount, total, color, ...rest }: { type: string; amount: string | number; total: number; color?: DefaultMantineColor } & PaperProps) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Paper bg={colorScheme !== "dark" ? `${color}.0` : `${color}.9`} p={6} {...rest}>
      <Title order={6} mb={4} ta="center">
        {type}
      </Title>
      <Center>
        <Badge color={color} size="xs" variant="filled">
          {total}%
        </Badge>
      </Center>
      <Text size="xs" ta="center" mt={4}>
        {amount}
      </Text>
    </Paper>
  );
};

export default MacroCard;

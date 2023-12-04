import { Badge, DefaultMantineColor, Paper, PaperProps, Text, Title } from "@mantine/core";
import { IconBaguette, IconCheese, IconEggs, IconFlame } from "@tabler/icons-react";

const MacroCard = ({ type, amount, total, color, ...rest }: { type: "Protein" | "Carb" | "Fat" | "Calories"; amount: string | number; total: number; color?: DefaultMantineColor } & PaperProps) => {
  const Icon = generateIcons(type);
  return (
    <Paper
      styles={{
        root: {
          background: `var(--mantine-color-${color}-light)`,
          position: "relative",
        },
      }}
      px="md"
      py="sm"
      {...rest}
    >
      <div>
        <Title order={6}>{type}</Title>
        <Badge color={color} size="xs" variant="filled">
          {total}%
        </Badge>
        <Text size="xs">{amount} kcal</Text>
      </div>
      <Icon size={60} style={{ position: "absolute", top: "8", right: "8", color: `var(--mantine-color-${color}-filled)`, opacity: 0.3 }} />
    </Paper>
  );
};

export default MacroCard;

const generateIcons = (type: "Protein" | "Carb" | "Fat" | "Calories") => {
  switch (type) {
    case "Protein":
      return IconEggs;
    case "Carb":
      return IconBaguette;
    case "Fat":
      return IconCheese;
    case "Calories":
      return IconFlame;
  }
};

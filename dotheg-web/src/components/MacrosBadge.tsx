import { MacrosInfo } from "@/types/index.type";
import { Badge, BadgeProps, Group, GroupProps } from "@mantine/core";
import React from "react";

const MacrosBadge: React.FC<BadgeProps & MacrosInfo & { wrapper?: GroupProps }> = ({ protein, carb, fat, radius = "md", wrapper, style, ...rest }) => {
  return (
    <Group gap={0} {...wrapper}>
      <Badge radius={radius} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, textTransform: "unset", ...style }} variant="light" {...rest}>
        {protein.toFixed(1)}g P
      </Badge>
      <Badge style={{ borderLeft: 0, borderRight: 0, textTransform: "unset", ...style }} radius={0} variant="light" {...rest}>
        {fat.toFixed(1)}g F
      </Badge>
      <Badge radius={radius} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textTransform: "unset", ...style }} variant="light" {...rest}>
        {carb.toFixed(1)}g C
      </Badge>
    </Group>
  );
};

export default MacrosBadge;

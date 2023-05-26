import { Badge, BadgeProps, Group, GroupProps } from "@mantine/core";
import React from "react";

const MacrosBadge: React.FC<BadgeProps & Macros & { wrapper?: GroupProps }> = ({
    protein,
    carbohydrate,
    fat,
    radius = "lg",
    wrapper,
    style,
    ...rest
}) => {
    return (
        <Group spacing={0} {...wrapper}>
            <Badge
                color="dark"
                radius={radius}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, textTransform: "unset", ...style }}
                variant="outline"
                {...rest}
            >
                {protein.toFixed(1)}g P
            </Badge>
            <Badge
                color="dark"
                style={{ borderLeft: 0, borderRight: 0, textTransform: "unset", ...style }}
                radius={0}
                variant="outline"
                {...rest}
            >
                {fat.toFixed(1)}g F
            </Badge>
            <Badge
                color="dark"
                radius={radius}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textTransform: "unset", ...style }}
                variant="outline"
                {...rest}
            >
                {carbohydrate.toFixed(1)}g C
            </Badge>
        </Group>
    );
};

export default MacrosBadge;

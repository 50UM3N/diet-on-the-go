import { Badge, BadgeProps, Group, GroupProps } from "@mantine/core";
import React from "react";

const MacrosBadge: React.FC<BadgeProps & Macros & { wrapper?: GroupProps }> = ({
    protein,
    carbohydrate,
    fat,
    radius = "lg",
    wrapper,
    ...rest
}) => {
    return (
        <Group spacing={0} {...wrapper}>
            <Badge
                color="dark"
                radius={radius}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, textTransform: "unset" }}
                variant="outline"
                {...rest}
            >
                {protein}g P
            </Badge>
            <Badge color="dark" style={{ borderLeft: 0, borderRight: 0, textTransform: "unset" }} radius={0} variant="outline" {...rest}>
                {fat}g F
            </Badge>
            <Badge
                color="dark"
                radius={radius}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textTransform: "unset" }}
                variant="outline"
                {...rest}
            >
                {carbohydrate}g C
            </Badge>
        </Group>
    );
};

export default MacrosBadge;

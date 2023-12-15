import { Group, Text } from "@mantine/core";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ data }: { data?: { name: string; path?: string }[] }) => {
  return (
    <Group gap="xs" mb="md">
      <IconHome size={22} /> <Text fw={600}>Home</Text>
      {data?.map(({ name, path }) => (
        <React.Fragment key={name}>
          <IconChevronRight style={{ color: "var(--mantine-color-dimmed)" }} size={22} stroke={3} />
          {path ? (
            <Text component={Link} to={path} fw={600}>
              {name}
            </Text>
          ) : (
            <Text fw={600}>{name}</Text>
          )}
        </React.Fragment>
      ))}
    </Group>
  );
};

export default Breadcrumbs;

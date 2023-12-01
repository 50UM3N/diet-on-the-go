import { Center, Loader as L } from "@mantine/core";

const Loader = () => {
  return (
    <Center h="calc(100vh - 32px - 66px)">
      <L />
    </Center>
  );
};

export default Loader;

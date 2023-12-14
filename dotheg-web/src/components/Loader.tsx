import { Center, Loader as L } from "@mantine/core";

const Loader = ({ full = false }) => {
  return (
    <Center h={full ? "100vh" : "calc(100vh - 32px - 66px)"}>
      <L />
    </Center>
  );
};

export default Loader;

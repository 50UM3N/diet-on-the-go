import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const GlobalFilter = ({ setGlobalFilter, ...rest }: TextInputProps & { setGlobalFilter: React.Dispatch<React.SetStateAction<string>> }) => {
  const [value, setValue] = useState<any>();
  const [debounced] = useDebouncedValue(value, 200);
  useEffect(() => {
    setGlobalFilter(debounced);
  }, [debounced, setGlobalFilter]);

  return <TextInput styles={{ input: { borderWidth: 2 } }} leftSection={<IconSearch size={16} />} placeholder="Global Search " value={value} onChange={(e) => setValue(e.currentTarget.value)} {...rest} />;
};

export default GlobalFilter;

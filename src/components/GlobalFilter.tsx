import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const GlobalFilter = ({
    setGlobalFilter,
}: {
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) =>{
    const [value, setValue] = useState<any>();
    const [debounced] = useDebouncedValue(value, 200);
    useEffect(() => {
        setGlobalFilter(debounced);
    }, [debounced, setGlobalFilter]);

    return (
        <TextInput
            icon={<IconSearch size={16} />}
            label="Search your data"
            placeholder="Global Search "
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
        />
    );
}

export default GlobalFilter
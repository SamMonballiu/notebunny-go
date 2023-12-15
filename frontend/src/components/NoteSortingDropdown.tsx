import { FC } from "react";
import { NoteSortOption } from "../models";

interface Props {
  selectedSortOption: NoteSortOption;
  onSelect: (option: NoteSortOption) => void;
}

const options: NoteSortOption[] = ["name", "creationDate"];
const strings: Record<NoteSortOption, string> = {
  name: "Name",
  creationDate: "Creation date",
};

export const NoteSortingDropdown: FC<Props> = ({
  selectedSortOption,
  onSelect,
}) => {
  return (
    <select
      name="note-sort"
      defaultValue={selectedSortOption}
      onChange={(e) => onSelect(e.target.value as NoteSortOption)}
    >
      {options.map((x) => (
        <option key={x} value={x}>
          {strings[x as NoteSortOption]}
        </option>
      ))}
    </select>
  );
};

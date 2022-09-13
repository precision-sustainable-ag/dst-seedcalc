import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

/* 
{
    name: Dropdown,
    description: Re-usable dropdown component,
    params: {
        data: Dropdown value,
        buttonClass: Class of button,
        size: Size of the Dropdown,
        theme: Theme of the button
    }
}
*/
export const Dropdown = ({
  value,
  label,
  handleChange,
  size,
  theme,
  items,
}) => {
  const renderedItems = items.map((item, i) => {
    return (
      <MenuItem key={item + "" + i} value={item}>
        {item}
      </MenuItem>
    );
  });

  return (
    <Box className="dropdown-container" sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={value} label={label} onChange={handleChange}>
          {renderedItems}
        </Select>
      </FormControl>
    </Box>
  );
};

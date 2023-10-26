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
  disabled = false,
}) => {
  return (
    <Box sx={{ minWidth: 120, color: "#4F5F30" }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disabled}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {items.map((item, i) => {
            return (
              <MenuItem key={item + "" + i} value={item.label} color="#4F5F30">
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

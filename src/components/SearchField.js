import { Box, Autocomplete, TextField } from '@mui/material';

const SearchField = ({ setSelectedStudent, label, data }) => {
  return (
    <Box>
      <Autocomplete
        autoHighlight
        disablePortal
        blurOnSelect
        options={data?.map((d, i) => ({
          label: `${d.FIRST} ${d.LAST}`,
          key: i,
        })) || []} // Map data directly, or use an empty array if data is undefined
        sx={{ width: 300 }}
        onChange={(event, value) => {
          // Update selected student with the label of the selected option
          if (value) setSelectedStudent(value.label);
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
};

export default SearchField;
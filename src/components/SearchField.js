import { Box, Autocomplete, TextField } from '@mui/material';

const SearchField = ({ setStudentFilter, label, data }) => {
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
          if (value) {
            setStudentFilter(value.label)
          } else {
            setStudentFilter(null)
          }
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
};

export default SearchField;
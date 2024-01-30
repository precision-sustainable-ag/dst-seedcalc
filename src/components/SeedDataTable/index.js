import React from 'react';
import {
  Typography, Table, TableBody, TableCell, TableRow, TableContainer, Paper,
} from '@mui/material';

const SeedDataTable = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ backgroundColor: 'primary.dark', fontSize: '1rem' }}>
      <TableBody>
        {data.map((d, i) => (
          <TableRow key={i}>
            <TableCell aligh="right">
              <Typography>{d.label}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">{d.value}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SeedDataTable;

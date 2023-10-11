import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./DSTTable.css";

export default function DSTTable({ rows, cells }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 0 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {cells.map((c, i) => {
              return <TableCell key={i}>{c}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={row[cells[0]]}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" key={`${i}-0`}>
                {row[cells[0]]}
              </TableCell>
              {cells.map((cell, idx) => {
                if (idx !== 0) {
                  return <TableCell key={`${i}-${idx}`}>{row[cell]}</TableCell>;
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

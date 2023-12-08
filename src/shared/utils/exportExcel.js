import * as XLSX from 'xlsx/xlsx';
import { saveAs } from 'file-saver';

export const jsonToCSV = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csvData = XLSX.utils.sheet_to_csv(ws);
  return csvData;
};

export const handleDownload = (data, council) => {
  console.log('redux data', data);
  const csvData = jsonToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `data_${council}.csv`);
};

export const handleExport = (json) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(json);

  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

  XLSX.writeFile(wb, 'MyExcel.xlsx');
};

export const handleArrExport = (json) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(json);

  XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

  XLSX.writeFile(wb, 'MyExcel.xlsx');
};

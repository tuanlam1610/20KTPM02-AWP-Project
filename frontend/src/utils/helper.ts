import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const downloadCSV = (data: any[], fileName: string) => {
  const csv = Papa.unparse(data);
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const csvURL = window.URL.createObjectURL(csvData);
  const tempLink = document.createElement('a');
  tempLink.href = csvURL;
  tempLink.setAttribute('download', `${fileName}.csv`);
  tempLink.click();
};

export const downloadXLSX = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grade Board');
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
};

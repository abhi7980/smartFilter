import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField, IconButton, Tooltip,
  Typography,
} from '@mui/material';
import { SaveAlt as ExportIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function DynamicDataTable({ columns, data, onRowClick, title }) {
  const columnKeys = Object.keys(columns);
  const [rows, setRows] = useState(data);
  const [orderBy, setOrderBy] = useState(columnKeys[0]);
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingCell, setEditingCell] = useState({ row: null, column: null });

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEdit = (rowIndex, columnKey, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnKey] = value;
    setRows(updatedRows);
  };

  const sortedRows = [...rows].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];
    return (valA < valB ? -1 : valA > valB ? 1 : 0) * (order === 'asc' ? 1 : -1);
  });

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'export.xlsx');
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <Tooltip title="Export to Excel">
        <IconButton onClick={handleExport} sx={{ float: 'right', m: 1 }}>
          <ExportIcon />
        </IconButton>
      </Tooltip>

      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
        {title}
      </Typography>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {columnKeys.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 13,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                    onClick={() => handleSort(key)}
                    sx={{
                      '& .MuiTableSortLabel-icon': { color: 'white !important' },
                    }}
                  >
                    {columns[key]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow
                  hover
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                >
                  {columnKeys.map((key) => (
                    <TableCell
                      key={key}
                      onDoubleClick={() =>
                        setEditingCell({ row: rowIndex + page * rowsPerPage, column: key })
                      }
                      sx={{ verticalAlign: 'middle' }}
                    >
                      {editingCell.row === rowIndex + page * rowsPerPage &&
                      editingCell.column === key ? (
                        <TextField
                          variant="standard"
                          value={rows[rowIndex + page * rowsPerPage][key]}
                          onChange={(e) =>
                            handleEdit(rowIndex + page * rowsPerPage, key, e.target.value)
                          }
                          onBlur={() => setEditingCell({ row: null, column: null })}
                          autoFocus
                          fullWidth
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2">{row[key]}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{ borderTop: '1px solid #eee' }}
      />
    </Paper>
  );
}

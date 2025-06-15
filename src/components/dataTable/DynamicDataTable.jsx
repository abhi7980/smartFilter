import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField, IconButton, Tooltip,
  Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { SaveAlt as ExportIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AddEditUser from "../forms/users/AddEditUser"

export default function DynamicDataTable({ columns, data, onRowClick, title }) {
  const columnKeys = Object.keys(columns);
  const [rows, setRows] = useState(data);
  const [orderBy, setOrderBy] = useState(columnKeys[0]);
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingCell, setEditingCell] = useState({ row: null, column: null });

  // Add/Edit modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newRow, setNewRow] = useState({});
  const [editRow, setEditRow] = useState({});

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

  // const handleAddSubmit = () => {
  //   setRows([...rows, newRow]);
  //   setNewRow({});
  //   setIsAddOpen(false);
  // };

  // const handleEditSubmit = () => {
  //   const updatedRows = [...rows];
  //   updatedRows[editRow.index] = editRow;
  //   delete updatedRows[editRow.index].index;
  //   setRows(updatedRows);
  //   setIsEditOpen(false);
  // };

  const handleDelete = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  return (
    <Paper elevation={0} sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none', p: 0 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 2, pt: 2, pb: 1, backgroundColor: '#fff',
        borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottom: '1px solid #e0e0e0',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Export to Excel">
            <IconButton onClick={handleExport}><ExportIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Add">
            <Button variant="outlined" size="small" onClick={() => setIsAddOpen(true)}>+ Add</Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderTop: 'none' }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.tableheader' }}>
              {columnKeys.map((key) => (
                <TableCell key={key} sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: 13 }}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                    onClick={() => handleSort(key)}
                    sx={{ '& .MuiTableSortLabel-icon': { color: 'primary.main' } }}
                  >
                    {columns[key]}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', fontSize: 13 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow
                hover key={rowIndex}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: 'pointer' }}
              >
                {columnKeys.map((key) => (
                  <TableCell
                    key={key}
                    onDoubleClick={() =>
                      setEditingCell({ row: rowIndex + page * rowsPerPage, column: key })
                    }
                    sx={{ verticalAlign: 'middle' }}
                  >
                    {editingCell.row === rowIndex + page * rowsPerPage && editingCell.column === key ? (
                      <TextField
                        variant="standard"
                        value={rows[rowIndex + page * rowsPerPage][key]}
                        onChange={(e) =>
                          handleEdit(rowIndex + page * rowsPerPage, key, e.target.value)
                        }
                        onBlur={() => setEditingCell({ row: null, column: null })}
                        autoFocus fullWidth size="small"
                      />
                    ) : (
                      <Typography variant="body2">{row[key]}</Typography>
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditRow({ ...row, index: rowIndex + page * rowsPerPage });
                      setIsEditOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(rowIndex + page * rowsPerPage);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
        sx={{ borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}
      />

      {/* Add Modal */}
      <Dialog scroll="body" open={isAddOpen} onClose={() => setIsAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <AddEditUser/>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained">Add</Button>
        </DialogActions> */}
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {title}</DialogTitle>
        <DialogContent>
          {columnKeys.map((key) => (
            <TextField
              key={key}
              label={columns[key]}
              fullWidth margin="dense"
              value={editRow[key] || ''}
              onChange={(e) => setEditRow({ ...editRow, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Update</Button>
        </DialogActions> */}
      </Dialog>
    </Paper>
  );
}

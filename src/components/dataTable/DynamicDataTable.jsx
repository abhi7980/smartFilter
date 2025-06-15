import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function DynamicDataTable({
  columns,
  data,
  onRowClick,
  title,
  loading,
  onSave,
  onDelete,
  addComponent,
  editComponent,
  handleDelete
}) {
  const [rows, setRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [newRow, setNewRow] = useState({});

  // Set initial rows from props
  useEffect(() => {
    setRows(data || []);
  }, [data]);

  const columnKeys = Object.keys(columns || {});

  const handleEdit = (rowIndex) => {
    setCurrentRow({ ...rows[rowIndex], _originalIndex: rowIndex });
    setEditModalOpen(true);
    
  };

  const handleSaveEdit = () => {
    if (currentRow) {
      const newRows = [...rows];
      newRows[currentRow._originalIndex] = currentRow;
      setRows(newRows);
      if (onSave) onSave(currentRow);
      setEditModalOpen(false);
    }
  };

  const handleAddNew = () => {
    const emptyRow = columnKeys.reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setNewRow(emptyRow);
    setAddModalOpen(true);
  };

  const handleSaveNew = () => {
    if (newRow) {
      const updatedRows = [...rows, newRow];
      setRows(updatedRows);
      if (onSave) onSave(newRow);
      setAddModalOpen(false);
      setNewRow({});
    }
  };

  // const handleDelete = (rowIndex) => {
  //   const rowToDelete = rows[rowIndex];
  //   const newRows = [...rows];
  //   newRows.splice(rowIndex, 1);
  //   setRows(newRows);
  //   if (onDelete) onDelete(rowToDelete);
  // };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = React.useMemo(() => {
    if (!sortConfig.key) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">{title || "Table"}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add New
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnKeys.map((key) => (
                <TableCell
                  key={key}
                  onClick={() => handleSort(key)}
                  sx={{ cursor: "pointer" }}
                >
                  {columns[key]}
                  {sortConfig.key === key
                    ? sortConfig.direction === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {columnKeys.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{ mr: 1 }}
                      />
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))
              : sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      hover
                      onClick={() => onRowClick?.(row)}
                      sx={{ cursor: onRowClick ? "pointer" : "default" }}
                    >
                      {columnKeys.map((key) => (
                        <TableCell key={key}>
                          <Typography variant="body2">
                            {row[key] != null ? row[key].toString() : ""}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(rowIndex + page * rowsPerPage);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(data[rowIndex].id)
                            handleDelete(data[rowIndex].id);
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
        disabled={loading}
      />

      {/* Edit Modal */}
      <Dialog open={editModalOpen} scroll="body" onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          {editComponent({currentRowData:currentRow})}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Close</Button>
          {/* <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* Add New Modal */}
      <Dialog open={addModalOpen}  scroll="body" onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
         {addComponent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Close</Button>
          {/* <Button onClick={handleSaveNew} variant="contained">
            Add
          </Button> */}
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DynamicDataTable({ columns, data, onRowClick, title, loading }) {
  const [rows, setRows] = useState([]);
  const [editingCell, setEditingCell] = useState({ row: null, column: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Set initial rows from props
  useEffect(() => {
    setRows(data || []);
  }, [data]);

  const columnKeys = Object.keys(columns || {});

  const handleEdit = (rowIndex, columnKey, value) => {
    const newRows = [...rows];
    newRows[rowIndex][columnKey] = value;
    setRows(newRows);
  };

  const handleDelete = (rowIndex) => {
    const newRows = [...rows];
    newRows.splice(rowIndex, 1);
    setRows(newRows);
  };

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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{title || "Table"}</Typography>
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
                  {sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
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
                      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
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
                      sx={{ cursor: "pointer" }}
                    >
                      {columnKeys.map((key) => (
                        <TableCell
                          key={key}
                          onDoubleClick={() =>
                            setEditingCell({ row: rowIndex + page * rowsPerPage, column: key })
                          }
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
                              size="small"
                              fullWidth
                            />
                          ) : (
                            <Typography variant="body2">
                              {row[key] != null ? row[key].toString() : ""}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCell({ row: rowIndex + page * rowsPerPage, column: null });
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
    </Paper>
  );
}

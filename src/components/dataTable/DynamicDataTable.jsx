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
  IconButton,
  Typography,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import waterfilter from "../../assets/images/filter.jpg";

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
  handleDelete,
  onToggle
}) {
  const [rows, setRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL || "";

  useEffect(() => {
    setRows(data || []);
  }, [data]);

  const columnKeys = Object.keys(columns || {});
  const imageColumnKeys = ["image", "photo", "avatar", "profilePic"];
  const fallbackImage = waterfilter;

  const handleEdit = (rowIndex) => {
    setCurrentRow({ ...rows[rowIndex], _originalIndex: rowIndex });
    setEditModalOpen(true);
  };

  const handleAddNew = () => {
    const emptyRow = columnKeys.reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setAddModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusToggle = (row, key) => {
    const updatedRow = {
      ...row,
      [key]: !row[key],
    };

    // Optional: Call external save function
    onSave?.(updatedRow);

    const updatedRows = rows.map((r) =>
      r.id === row.id ? updatedRow : r
    );
    setRows(updatedRows);
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
              <TableCell>#</TableCell>
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
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
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
                      <TableCell>{page * rowsPerPage + rowIndex + 1}</TableCell>
                      {columnKeys.map((key) => (
                        <TableCell key={key}>
                          {imageColumnKeys.includes(key.toLowerCase()) ? (
                            (() => {
                              const rawImage = row[key];
                              const imageUrl = Array.isArray(rawImage)
                                ? `${baseURL}${rawImage[0]}`
                                : typeof rawImage === "string"
                                ? `${baseURL}${rawImage}`
                                : null;

                              return (
                                <img
                                  src={imageUrl || fallbackImage}
                                  alt="preview"
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    cursor: imageUrl ? "pointer" : "default",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (imageUrl) setPreviewImage(imageUrl);
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = fallbackImage;
                                  }}
                                />
                              );
                            })()
                          ) : key.toLowerCase() === "status" ? (
                            <Switch
                              checked={Boolean(row[key])}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => onToggle(row, key)}
                              color="primary"
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
                            handleEdit(rowIndex + page * rowsPerPage);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id);
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
      <Dialog
        open={editModalOpen}
        scroll="body"
        onClose={() => setEditModalOpen(false)}
      >
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          {editComponent({ currentRowData: currentRow })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add New Modal */}
      <Dialog
        open={addModalOpen}
        scroll="body"
        onClose={() => setAddModalOpen(false)}
      >
        <DialogContent>{addComponent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

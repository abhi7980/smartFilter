import React, { useState, useCallback, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { editProduct } from "../../../networkHandler/services"; // Update this function if needed

export default function EditProduct({
  currentRowData,
  setShouldUpdate,
  shouldUpdate,
}) {
  const [formValues, setFormValues] = useState({
    Id: "",
    // UserId: "",
    // ProductId: "",
    // RentId: "",
    Name: "",
    Serial: "",
    Mac: "",
    IPAddress: "",
    ViewOrder: "",
    Status: false,
    RegDate: "",
    About: "", // <-- new field
    Price: "", // <-- new field
    DepositAmount: "", // <-- new field
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  useEffect(() => {
    if (currentRowData) {
      setFormValues({
        Id: currentRowData.id || "",
        // UserId: currentRowData.userId || "",
        // ProductId: currentRowData.productId || "",
        // RentId: currentRowData.rentId || "",
        Name: currentRowData.name || "",
        Serial: currentRowData.serial || "",
        Mac: currentRowData.mac || "",
        IPAddress: currentRowData.ipAddress || "",
        ViewOrder: currentRowData.viewOrder || "",
        Status: currentRowData.status || false,
        RegDate: currentRowData.regDate || "",
        About: currentRowData.about || "",
        Price: currentRowData.price || "",
        DepositAmount: currentRowData.depositAmount || "",
      });
    }
  }, [currentRowData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const formData = new FormData();
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      await editProduct(formValues); // Adjust this function to handle formData if needed

      setStatus("success");
      setMessage("Product updated successfully!");
      setFiles([]);
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error editing product:", err);
      setStatus("error");
      setMessage(err?.message || "Failed to edit product.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Edit Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.entries(formValues).map(([field, value]) =>
            field !== "Status" ? (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  type={
                    field.toLowerCase().includes("date")
                      ? "datetime-local"
                      : "text"
                  }
                  label={field}
                  name={field}
                  value={value}
                  onChange={handleChange}
                />
              </Grid>
            ) : null
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.Status}
                  onChange={handleChange}
                  name="Status"
                />
              }
              label="Active"
            />
          </Grid>

          <Grid item xs={12}>
            <Paper
              variant="outlined"
              {...getRootProps()}
              sx={{
                p: 3,
                textAlign: "center",
                borderStyle: "dashed",
                backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                {isDragActive
                  ? "Drop files here..."
                  : "Drag & drop files here, or click to select"}
              </Typography>
            </Paper>

            {files.length > 0 && (
              <List dense>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          <Grid item xs={12} py={2}>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <CircularProgress size={24} />
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
          </Grid>

          {status === "success" && (
            <Grid item xs={12}>
              <Alert severity="success">{message}</Alert>
            </Grid>
          )}
          {status === "error" && (
            <Grid item xs={12}>
              <Alert severity="error">{message}</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

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
import { editRental } from "../../../networkHandler/services";
// import { editRental, } from "../../../networkHandler/services";

export default function EditRental({currentRowData, setShouldUpdate,shouldUpdate }) {
  const [formValues, setFormValues] = useState({
    Id: "",
    Name: "",
    About: "",
    Amount: "",
    Status: false,
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("Idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

   useEffect(() => {
       console.log("currentRowData", currentRowData);
    if (currentRowData) {
     
      setFormValues({
        Id: currentRowData.id || "",
        Name: currentRowData.name || "",
        About: currentRowData.about || "",
        Amount: currentRowData.amount || "",
        Status: currentRowData.status || false,
        
      });
    }
  }, [currentRowData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const userData = { ...formValues };
      const response = await editRental(userData);

      setStatus("success");
      setMessage("User added successfully!");
      setFormValues({
        Id: "",
        Name: "",
        About: "",
        Amount: "",
        Status: false,
      });
      setFiles([]);
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error adding user:", err);
      setStatus("error");
      setMessage(err?.message || "Failed to add user. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Add Rental
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {["Id", "Name", "About", "Amount"].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={field}
                name={field}
                value={formValues[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}

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
                {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}
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
              <Button type="submit" variant="contained" disabled={status === "submitting"}>
                {status === "submitting" ? <CircularProgress size={24} /> : "Submit"}
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

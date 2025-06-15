import React, { useState, useCallback } from "react";
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

export default function Settings() {
  const [formValues, setFormValues] = useState({
    Name: "",
    Email: "",
    Mobile: "",
    UserName: "",
    Password: "",
    Role: "",
    Address: "",
    Landmark: "",
    Street: "",
    City: "",
    State: "",
    PinCode: "",
    AddressType: "",
    Status: false,
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });
    files.forEach((file) => {
      formData.append("files", file);
    });

    fetch("https://your-api-url.com/api/AddUser", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setStatus("success");
        setMessage("Form submitted successfully!");
        setFormValues({
          Name: "",
          Email: "",
          Mobile: "",
          UserName: "",
          Password: "",
          Role: "",
          Address: "",
          Landmark: "",
          Street: "",
          City: "",
          State: "",
          PinCode: "",
          AddressType: "",
          Status: false,
        });
        setFiles([]);
      })
      .catch((err) => {
        console.error("Error:", err);
        setStatus("error");
        setMessage("There was an error submitting the form.");
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Add User
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {[
            "Name",
            "Email",
            "Mobile",
            "UserName",
            "Password",
            "Role",
            "Address",
            "Landmark",
            "Street",
            "City",
            "State",
            "PinCode",
            "AddressType",
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                type={field === "Password" ? "password" : "text"}
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
              {isDragActive ? (
                <Typography>Drop files here...</Typography>
              ) : (
                <Typography>
                  Drag & drop files here, or click to select
                </Typography>
              )}
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

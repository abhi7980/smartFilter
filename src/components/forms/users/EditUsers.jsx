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
import { editUser } from "../../../networkHandler/services";

export default function EditUser({currentRowData, setShouldUpdate,shouldUpdate }) {
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

  useEffect(() => {
  if (currentRowData) {
    setFormValues({
      Name: currentRowData.name || "",
      Email: currentRowData.email || "",
      Mobile: currentRowData.mobile || "",
      UserName: currentRowData.userName || "",
      Password: currentRowData.password || "",
      Role: currentRowData.role || "",
      Address: currentRowData.address || "",
      Landmark: currentRowData.landmark || "",
      Street: currentRowData.street || "",
      City: currentRowData.city || "",
      State: currentRowData.state || "",
      PinCode: currentRowData.pinCode?.toString() || "",
      AddressType: currentRowData.addressType || "",
      Status: currentRowData.status || false,
      id: currentRowData.id
    });
  }
}, [currentRowData]);

  console.log("data", currentRowData)

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
    // Prepare the data to send
    const userData = {
      ...formValues,
      Status: formValues.Status, // Convert boolean to status string if needed
      // If your API expects files, you'll need to handle them differently
      // since the current addUser function doesn't support file uploads
    };

    // Call the API
    const response = await editUser(userData);
     setShouldUpdate(!shouldUpdate)
    // Handle success
    setStatus("success");
    setMessage("User edited successfully!");
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
  } catch (err) {
    console.error("Error editing user:", err);
    setStatus("error");
    setMessage(err?.message || "Failed to edit user. Please try again.");
  }
};

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
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

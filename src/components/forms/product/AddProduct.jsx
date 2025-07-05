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
  MenuItem,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { addProduct, getRental } from "../../../networkHandler/services"; // adjust if needed

export default function AddProduct({ setShouldUpdate, shouldUpdate }) {
  const [formValues, setFormValues] = useState({
    Name: "",
    RentalPlan: "",
    ViewOrder: "",
    Status: true,
    About: "",
    Price: "",
    DepositAmount: "",
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [rentalPlans, setRentalPlans] = useState([]);

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
    const fetchDropdowns = async () => {
      try {
        const planRes = await getRental();
        setRentalPlans(planRes.data || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

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

      await addProduct({ ...formValues, files });

      setStatus("success");
      setMessage("Product added successfully!");
      setFormValues({
        Name: "",
        RentalPlan: "",
        ViewOrder: "",
        About: "",
        Price: "",
        DepositAmount: "",
      });
      setFiles([]);
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
      setMessage(err?.message || "Submission failed");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Add Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.entries(formValues).map(([field, value]) => {
            if (field === "RentalPlan" || field === "Status") return null;
            return (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  type={field.toLowerCase().includes("date") ? "datetime-local" : "text"}
                  label={field}
                  name={field}
                  value={value}
                  onChange={handleChange}
                />
              </Grid>
            );
          })}

          <Grid item xs={12} sm={6}>
            <TextField
            sx={{width:'14.5rem'}}
              select
              fullWidth
              label="Rental Plan"
              name="RentalPlan"
              value={formValues.RentalPlan}
              onChange={handleChange}
            >
              <MenuItem value="">Select Rental Plan</MenuItem>
              {rentalPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </TextField>
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
                <Typography>Drag & drop files here, or click to select</Typography>
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

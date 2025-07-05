import React, { useState, useEffect } from "react";
import {
  TextField,
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
import {
  addUser,
  getUsers,
  getProducts,
  getRental,
  addMyProduct,
  editMyProduct,
} from "../../../networkHandler/services";
export default function EditMyProduct({ setShouldUpdate, shouldUpdate, currentRowData }) {
  const [formValues, setFormValues] = useState({
     Id: currentRowData.id || "",
    UserId: "",
    RentId: "",
    ProductId: "",
    Name: "",
    Serial: "",
    Mac: "",
    IPAddress: "",
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [rentalPlans, setRentalPlans] = useState([]);

  // Dropzone Setup
  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const payload = { ...formValues, files };

      let response;
      if (currentRowData && currentRowData.id) {
        response = await editMyProduct({ ...formValues, files }); // ADD THIS API
        setMessage("Product updated successfully!");
      } else {
        response = await addMyProduct(payload);
        setMessage("Product assigned successfully!");
      }

      setStatus("success");
      setFormValues({
         Id: currentRowData.id || "",
        UserId: "",
        RentId: "",
        ProductId: "",
        Name: "",
        Serial: "",
        Mac: "",
        IPAddress: "",
      });
      setFiles([]);
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error:", err);
      setStatus("error");
      setMessage(err?.message || "Something went wrong. Please try again.");
    }
  };

  // Populate dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [userRes, productRes, planRes] = await Promise.all([
          getUsers(),
          getProducts(),
          getRental(),
        ]);

        setUsers(userRes.data.filter((item) => item.role === "CUSTOMER") || []);
        setProducts(productRes.data || []);
        setRentalPlans(planRes.data || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };

    fetchDropdowns();
  }, []);

  // Populate form values in edit mode
  useEffect(() => {
    console.log(currentRowData)
    if (currentRowData) {
      setFormValues({
         Id: currentRowData.id || "",
        UserId: currentRowData.userId || "",
        RentId: currentRowData.rentId || "",
        ProductId: currentRowData.productId || "",
        Name: currentRowData.mpName || "",
        Serial: currentRowData.mpSerial || "",
        Mac: currentRowData.mpMac || "",
        IPAddress: currentRowData.mpipAddress || "",
      });
    }
  }, [currentRowData]);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {currentRowData ? "Edit Assigned Product" : "Assign Product to User"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Dropdowns */}
          {[
            { label: "User", name: "UserId", data: users },
            { label: "Product", name: "ProductId", data: products },
            { label: "Rental Plan", name: "RentId", data: rentalPlans },
          ].map(({ label, name, data }) => (
            <Grid item xs={12} key={name}>
              <TextField
                sx={{ minWidth: "14.5rem" }}
                select
                fullWidth
                label={label}
                name={name}
                value={formValues[name]}
                onChange={handleChange}
              >
                <MenuItem value="">Select {label}</MenuItem>
                {data.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          {/* Input Fields */}
          {["Name", "Serial", "Mac", "IPAddress"].map((field) => (
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

          {/* File Upload */}
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

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button type="submit" variant="contained" disabled={status === "submitting"}>
                {status === "submitting" ? <CircularProgress size={24} /> : currentRowData ? "Update" : "Submit"}
              </Button>
            </Box>
          </Grid>

          {/* Status Message */}
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

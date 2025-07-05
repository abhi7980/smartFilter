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
} from "../../../networkHandler/services";

export default function AddMyProduct({ setShouldUpdate, shouldUpdate }) {
  const [formValues, setFormValues] = useState({
    UserId: "",
    RentId: "",
    ProductId: "",
    Name: "",
    
  });

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [rentalPlans, setRentalPlans] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await addMyProduct({...formValues,files}); // Replace with actual endpoint for adding product if different

      setStatus("success");
      setMessage("Product assigned successfully!");
      setFormValues({
        UserId: "",
        RentId: "",
        ProductId: "",
        Name: "",
      });
      setFiles([]);
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error:", err);
      setStatus("error");
      setMessage(err?.message || "Failed to assign product. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [userRes, productRes, planRes] = await Promise.all([
          getUsers(),
          getProducts(),
            getRental(),
        ]);
        console.log(userRes.data.filter((item)=>(item.role==='CUSTOMER')),productRes,planRes)
        setUsers(userRes.data.filter((item)=>(item.role==='CUSTOMER')) || []);
        setProducts(productRes.data || []);
        setRentalPlans(planRes.data || []);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Assign Product to User
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* User Dropdown */}
          <Grid item xs={12}>
            <TextField
             sx={{minWidth:"14.5rem"}}
              select
              fullWidth
              label="User"
              name="UserId"
              value={formValues.UserId}
              onChange={handleChange}
            >
              <MenuItem value="">Select User</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Product Dropdown */}
          <Grid item xs={12}>
            <TextField
             sx={{minWidth:"14.5rem"}}
              select
              fullWidth
              label="Product"
              name="ProductId"
              value={formValues.ProductId}
              onChange={handleChange}
            >
              <MenuItem value="">Select Product</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Rental Plan Dropdown */}
          <Grid item xs={12}>
            <TextField
             sx={{minWidth:"14.5rem"}}
              select
              fullWidth
              label="Rental Plan"
              name="RentId"
              value={formValues.RentId}
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

          {/* Input Fields */}
          {["Name","Serial","Mac","IPAddress"].map((field) => (
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

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <CircularProgress size={24} />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </Grid>

          {/* Alert Messages */}
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

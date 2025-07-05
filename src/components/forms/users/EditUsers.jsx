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
import { editUser, getCityState, getRoles } from "../../../networkHandler/services";

export default function EditUser({ currentRowData, setShouldUpdate, shouldUpdate }) {
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
    id: null,
  });

  const [roles, setRoles] = useState([]);
  const [addressTypes] = useState(["Home", "Office"]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");    // idle | submitting | success | error
  const [message, setMessage] = useState("");

  // load current data into form
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
        id: currentRowData.id,
      });
    }
  }, [currentRowData]);

  // fetch dropdown data on mount
  useEffect(() => {
    (async () => {
      try {
        const [stateRes, roleRes] = await Promise.all([getCityState(), getRoles()]);
        setStates(stateRes.map((s) => s.state));
        setRoles(roleRes);
        // if editing and a state is already set, populate its cities
        if (currentRowData?.state) {
          const match = stateRes.find((s) => s.state === currentRowData.state);
          setCities(match?.city || []);
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      }
    })();
  }, [currentRowData]);

  // dropzone
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  // handle field changes (including dynamic city reload)
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "State") {
      try {
        const allStates = await getCityState();
        const match = allStates.find((s) => s.state === value);
        setCities(match?.city || []);
        setFormValues((prev) => ({ ...prev, City: "" }));
      } catch {
        setCities([]);
      }
    }
  };

  // submit edited user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      await editUser({ ...formValues, files });
      setStatus("success");
      setMessage("User updated successfully!");
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error editing user:", err);
      setStatus("error");
      setMessage(err?.message || "Failed to update user");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Edit User
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Name / Email */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" name="Name"
              value={formValues.Name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="Email"
              value={formValues.Email} onChange={handleChange} />
          </Grid>

          {/* Mobile / Username */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Mobile" name="Mobile"
              value={formValues.Mobile} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="User Name" name="UserName"
              value={formValues.UserName} onChange={handleChange} />
          </Grid>

          {/* Password / Role */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="password" label="Password" name="Password"
              value={formValues.Password} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Role" name="Role"
              value={formValues.Role} onChange={handleChange} sx={{minWidth:"14.5rem"}}>
              <MenuItem value="">Select Role</MenuItem>
              {roles.map((r) => (
                <MenuItem key={r.id || r} value={r.id || r}>
                  {r.name || r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Address / Landmark */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Address" name="Address"
              value={formValues.Address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Landmark" name="Landmark"
              value={formValues.Landmark} onChange={handleChange} />
          </Grid>

          {/* Street / Address Type */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Street" name="Street"
              value={formValues.Street} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Address Type" name="AddressType"
              value={formValues.AddressType} onChange={handleChange} sx={{minWidth:"14.5rem"}}>
              <MenuItem value="">Select Type</MenuItem>
              {addressTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* State / City */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="State" name="State"
              value={formValues.State} onChange={handleChange} sx={{minWidth:"14.5rem"}}>
              <MenuItem value="">Select State</MenuItem>
              {states.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="City" name="City"
              value={formValues.City} onChange={handleChange} sx={{minWidth:"14.5rem"}}>
              <MenuItem value="">Select City</MenuItem>
              {cities.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* PinCode / Active */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pin Code" name="PinCode"
              value={formValues.PinCode} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
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

          {/* File upload */}
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              {...getRootProps()}
              sx={{ p: 2, textAlign: "center", borderStyle: "dashed", bgcolor: isDragActive ? "grey.100" : "background.paper" }}
            >
              <input {...getInputProps()} />
              <Typography>
                {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}
              </Typography>
            </Paper>
            {files.length > 0 && (
              <List dense>
                {files.map((file, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          {/* Submit & feedback */}
          <Grid item xs={12} textAlign="center" pt={2}>
            <Button type="submit" variant="contained" disabled={status === "submitting"}>
              {status === "submitting" ? <CircularProgress size={24} /> : "Update"}
            </Button>
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

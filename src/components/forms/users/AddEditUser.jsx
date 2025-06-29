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
import axios from "axios";
import { addUser, getCityState, getRoles } from "../../../networkHandler/services";

export default function AddEditUser({ setShouldUpdate, shouldUpdate }) {
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
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const [roles, setRoles] = useState([]);
  const [addressTypes, setAddressTypes] = useState(["Home","Office"]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked)
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Dynamically fetch cities when state changes
    if (name === "State") {
      try {
        const res = await getCityState();
        console.log()
        setCities(res.find((item) => item.state === value).city || []);
        setFormValues((prev) => ({ ...prev, City: "" })); // reset city
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const userData = {
        ...formValues,
        Status: formValues.Status,
      };

      const response = await addUser(userData);

      setStatus("success");
      setMessage("User added successfully!");
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
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error adding user:", err);
      setStatus("error");
      setMessage(err?.message || "Failed to add user. Please try again.");
    }
  };

  // Fetch all dropdown data
 useEffect(() => {
  const fetchDropdowns = async () => {
    try {
      // const [roleRes, addressTypeRes, stateRes] = await Promise.all([
      //   axios.get("/api/roles"),
      //   axios.get("/api/address-types"),
      //   axios.get("/api/states"),
      // ]);
      const stateRes=await getCityState()
      const roleRes=await getRoles()
      console.log(roleRes,"roles")
      setRoles(Array.isArray(roleRes) ? roleRes :  []);
      // setAddressTypes(Array.isArray(addressTypeRes.data) ? addressTypeRes.data : addressTypeRes.data.data || []);
      setStates(Array.isArray(stateRes) ? stateRes.map((state,id)=>(state.state)) : []);
    } catch (err) {
      console.error("Dropdown data load error:", err);
    }
  };
  fetchDropdowns();
}, []);

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
              {field === "Role" ? (
                <TextField
                  sx={{minWidth:"14.5rem"}}
                  select
                  fullWidth
                  label="Role"
                  name="Role"
                  value={formValues.Role}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id || role} value={role.id || role}>
                      {role.name || role}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field === "AddressType" ? (
                <TextField
                  select
                  sx={{minWidth:"14.5rem"}}
                  fullWidth
                  label="Address Type"
                  name="AddressType"
                  value={formValues.AddressType}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Address Type</MenuItem>
                  {addressTypes.map((type) => (
                    <MenuItem key={type.id || type} value={type.id || type}>
                      {type.name || type}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field === "State" ? (
                <TextField
                  select
                  sx={{minWidth:"14.5rem"}}
                  fullWidth
                  label="State"
                  name="State"
                  value={formValues.State}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((s) => (
                    <MenuItem key={s.id || s} value={s.id || s}>
                      {s.name || s}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field === "City" ? (
                <TextField
                  select
                  sx={{minWidth:"14.5rem"}}
                  fullWidth
                  label="City"
                  name="City"
                  value={formValues.City}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {cities.map((c) => (
                    <MenuItem key={c.id || c} value={c.id || c}>
                      {c.name || c}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  sx={{minWidth:"14.5rem"}}
                  type={field === "Password" ? "password" : "text"}
                  label={field}
                  name={field}
                  value={formValues[field]}
                  onChange={handleChange}
                />
              )}
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

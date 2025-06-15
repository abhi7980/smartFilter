import React, { useState } from "react";
import { Button, Box, Container } from "@mui/material";
import FormGenerator from "../components/forms/FormGenerator";

export default function Settings() {
  const [formValues, setFormValues] = useState({});

  // const handleChange = (updatedValues) => {
  //   setFormValues(updatedValues);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <FormGenerator
          title={"Add Product"}
          // title={"Add User"}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'rental-amount', label: 'Amount', type: 'text' },
            { name: 'images', type: 'image-drop' },
          ]}

          // fields={[
          //   { name: "name", label: "Name", type: "text" },
          //   { name: "email", label: "Email", type: "email" },
          //   { name: "mobile", label: "Mobile", type: "text" },
          //   { name: "address", label: "Address", type: "text" },
          // ]}
          values={formValues}
          onChange={(updated) => setFormValues(updated)}
        />

        <Box textAlign="center">
          <Button type="submit" variant="contained">
            {/* Add Product */}
            Add User
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

import React, { useState } from 'react';
import { Button, Box, Container } from '@mui/material';
import FormGenerator from '../components/forms/FormGenerator';

export default function Settings() {
  const [formValues, setFormValues] = useState({});

  const handleChange = (updatedValues) => {
    setFormValues(updatedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <FormGenerator
        title={"Add Product"}
          fields={[
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'rental-amount', label: 'Amount', type: 'text' },
            // { name: 'resume', label: 'Resume PDF', type: 'file' },
            { name: 'images', label: 'Upload Images', type: 'image-drop' },
          ]}
          values={formValues}
          onChange={(updated) => setFormValues(updated)}
        />

        <Box textAlign="right">
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Paper } from '@mui/material';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setProduct({ ...product, image: file });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          {/* Product Name */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Rental Price */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Rental Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} md={3}>
            <Box
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              sx={{
                height: 80,
                border: '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 1,
              }}
            >
              <Typography variant="body2">
                {product.image ? (
                  <>
                    <strong>Uploaded:</strong> {product.image.name}
                  </>
                ) : (
                  'Drag and drop image here'
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box mt={4}>
          <Button variant="contained" type="submit">
            Add Product
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddProductForm;

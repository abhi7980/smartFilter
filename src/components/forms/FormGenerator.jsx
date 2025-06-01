import React from 'react';
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Paper,
  Grid,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

export default function FormGenerator({ fields, values, onChange, title }) {
  const handleInputChange = (e, field) => {
    const { name, value, files } = e.target;

    if (field.type === 'file') {
      onChange({
        ...values,
        [name]: files[0],
      });
    } else {
      onChange({
        ...values,
        [name]: value,
      });
    }
  };

  const renderDropzone = (field) => {
    const onDrop = (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onChange({
          ...values,
          [field.name]: [...(values[field.name] || []), ...acceptedFiles],
        });
      }
    };

    const handleRemoveImage = (e,indexToRemove) => {
      e.stopPropagation()
      const updatedFiles = (values[field.name] || []).filter((_, index) => index !== indexToRemove);
      onChange({
        ...values,
        [field.name]: updatedFiles,
      });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': [],
      },
      multiple: true,
    });

    const files = values[field.name] || [];

    return (
      <Box>
        <InputLabel shrink sx={{ mb: 1 }}>
          {field.label}
        </InputLabel>
        <Paper
          variant="outlined"
          {...getRootProps()}
          sx={{
            p: 3,
            border: '2px dashed #90caf9',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#e3f2fd' : '#f9f9f9',
            borderRadius: 2,
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body2" color="textSecondary">
            {isDragActive
              ? 'Drop the images here...'
              : 'Drag & drop or click to select images'}
          </Typography>

          {files.length > 0 && (
            <Grid container spacing={2} mt={2}>
              {files.map((file, index) => (
                <Grid item xs={4} key={index} sx={{ position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    mt={0.5}
                    textAlign="center"
                    noWrap
                  >
                    {file.name}
                  </Typography>
                  <Box
                    onClick={(e) => handleRemoveImage(e,index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        p: 4,
        maxWidth: 700,
        width: '100%',
        mx: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {title}
      </Typography>

      {fields.map((field) => (
        <FormControl key={field.name} fullWidth sx={{ gap: 1 }}>
          {field.type === 'text' ? (
            <TextField
              name={field.name}
              label={field.label}
              value={values[field.name] || ''}
              onChange={(e) => handleInputChange(e, field)}
              variant="outlined"
              fullWidth
            />
          ) : field.type === 'file' ? (
            <>
              <InputLabel shrink htmlFor={field.name}>
                {field.label}
              </InputLabel>
              <Input
                type="file"
                name={field.name}
                onChange={(e) => handleInputChange(e, field)}
              />
              {values[field.name] && (
                <Typography variant="caption" color="text.secondary" mt={1}>
                  Selected: {values[field.name]?.name}
                </Typography>
              )}
            </>
          ) : field.type === 'image-drop' ? (
            renderDropzone(field)
          ) : null}
        </FormControl>
      ))}
    </Box>
  );
}

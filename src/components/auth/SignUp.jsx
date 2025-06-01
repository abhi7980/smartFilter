import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from "../../assets/images/Logo.png"


export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Submit logic here
    console.log('Registered user:', formData);
    navigate('/'); // redirect after registration
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 900,
          }}
        >
          {/* Left side - Logo and Welcome Text */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <img
              src={logo}
              alt="Gyankendram Logo"
              style={{ width: 120, marginBottom: 16 }}
            />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Join Smart Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account and manage smart water solutions easily.
            </Typography>
          </Box>

          {/* Right side - Signup Form */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              Create Account
            </Typography>
            <Typography variant="body2" gutterBottom>
              Register to access your Gyankendram dashboard
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
  <Stack spacing={2}>
    <TextField
      label="Full Name"
      name="name"
      fullWidth
      required
      value={formData.name}
      onChange={handleChange}
    />
    <TextField
      label="Email"
      name="email"
      type="email"
      fullWidth
      required
      value={formData.email}
      onChange={handleChange}
    />
    <TextField
      label="Mobile"
      name="mobile"
      type="tel"
      fullWidth
      required
      value={formData.mobile}
      onChange={handleChange}
    />
    
    {/* Side by side password fields */}
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        value={formData.password}
        onChange={handleChange}
        sx={{ flex: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type={showPassword ? 'text' : 'password'}
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        sx={{ flex: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Button
      type="submit"
      variant="contained"
      fullWidth
      size="large"
      sx={{
        textTransform: 'none',
        fontSize: '1rem',
        py: 1.5,
        backgroundColor: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      Sign Up
    </Button>
  </Stack>
</Box>


            <Typography variant="body2" textAlign="center" mt={3}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary.main">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

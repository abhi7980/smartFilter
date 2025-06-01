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
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/images/Logo.png'; // Adjust the path to your logo
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, name: 'John Doe' });
    navigate('/');
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
              Welcome to Smart Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your smart solution for clean drinking water smartly. Log in to manage your dashboard efficiently.
            </Typography>
          </Box>

          {/* Right side - Login Form */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              Sign In
            </Typography>
            <Typography variant="body2" gutterBottom>
              Access your Gyankendram dashboard
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" style={{ marginLeft: 8, fontSize: '0.9rem' }}>Remember me</label>
                  </Box>
                  <Link component={RouterLink} to="/forgot-password" color="primary.main">
                    Forgot password?
                  </Link>
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
                  Sign In
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" textAlign="center" mt={3}>
              Don’t have an account?{' '}
              <Link component={RouterLink} to="/signup" color="primary.main">
                Create an account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

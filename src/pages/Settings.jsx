import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';

export default function Settings() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    darkMode: false
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call an API here
    login({ ...user, ...formData });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">
          Please login to access settings
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 800 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>Account Settings</Typography>
          
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>Preferences</Typography>
          
          <FormControlLabel
            control={
              <Switch
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
            }
            label="Email Notifications"
            sx={{ display: 'block', mt: 1 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                name="darkMode"
                checked={formData.darkMode}
                onChange={handleChange}
              />
            }
            label="Dark Mode"
            sx={{ display: 'block', mt: 1 }}
          />

          <Box sx={{ mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
import { Typography, Box, Button, Avatar, Paper } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">
          Please login to view your profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Your Profile
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ width: 80, height: 80, mr: 3 }}
            src="/default-avatar.jpg" 
          />
          <Box>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="subtitle1">{user.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Account Details</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Member Since:</strong> {new Date().toLocaleDateString()}</Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
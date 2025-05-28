import { Typography, Button, Box } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Welcome {user ? user.name : 'Guest'}
      </Typography>
      
      Abcdef

      <Typography variant="body1" paragraph>
        {user 
          ? 'You are logged in and can access your profile.'
          : 'Please login to access your profile.'}
      </Typography>

      <Box sx={{ mt: 3 }}>
        {user ? (
          <Button 
            variant="contained" 
            component={Link} 
            to="/profile"
            sx={{ mr: 2 }}
          >
            View Profile
          </Button>
        ) : (
          <Button 
            variant="contained" 
            component={Link} 
            to="/login"
            sx={{ mr: 2 }}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
}
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#191c1f',
        color: '#FAFBFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h2" color="orange" fontWeight="bold">404</Typography>
      <Typography variant="h5" mt={2}>Página no encontrada</Typography>
      <Typography variant="body1" mt={1} mb={4}>
        La ruta que estás buscando no existe o no tienes autorización.
      </Typography>
      <Button
        variant="contained"
        color="warning"
        onClick={handleGoHome}
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFound;

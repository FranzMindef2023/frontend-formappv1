import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Typography
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ModalPreRegistro from '../components/ModalPreRegistro';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Headerweb: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = {
    name: 'Franz Vasquez',
    email: 'mvmfranzmvm@gmail.com',
    avatar: 'https://i.pravatar.cc/300',
    position: 1,
    points: 2100,
    rankingUrl: '/ranking',
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#fff', color: '#000' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Izquierda: Logo y botón menú móvil */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            edge="start"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' }, color: '#000' }}
          >
          </IconButton>

          <img
            src="/siremil/minlogo.png"
            alt="Ministerio de Defensa"
            style={{ height: 80 }}
          />
        </Box>

        {/* Derecha: Botón de registro */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ ml: 'auto', pr: { xs: 1, sm: 2 } }} // empuja hacia la derecha con padding responsivo
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenModal(true)}
            color="success"
            sx={{
              borderRadius: 9999,
              fontWeight: 'bold',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              backgroundColor: '#43a047',
              color: '#fff',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: '#2e7d32',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.3)'
              }
            }}
            startIcon={<TouchAppIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />}
          >
            Regístrate
          </Button>
        </Box>
      </Toolbar>
      <ModalPreRegistro open={openModal} onClose={() => setOpenModal(false)} />
    </AppBar>
  );
};

export default Headerweb;

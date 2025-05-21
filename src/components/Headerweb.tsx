import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
  Paper,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectItem,
  ListItemIcon
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import HelpOutline from '@mui/icons-material/HelpOutline';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import ModalPreRegistro from '../components/ModalPreRegistro';


import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Headerweb: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openModal, setOpenModal] = React.useState(false);

  const user = {
    name: 'Franz Vasquez',
    email: 'mvmfranzmvm@gmail.com',
    avatar: 'https://i.pravatar.cc/300',
    position: 1,
    points: 2100,
    rankingUrl: '/ranking',
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#191c1f' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Izquierda: Logo y botón menú móvil */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onToggleSidebar}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <img
            src="https://www.mindef.gob.bo/sites/default/files/minlogo.png"
            alt="Ministerio de Defensa"
            style={{ height: 50 }}
          />
        </Box>

        {/* Derecha: Botón y avatar */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: '#F4511E',
              borderRadius: 9999,
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3,
              '&:hover': { backgroundColor: '#e64a19' }
            }}
            startIcon={<TouchAppIcon />}
          >
            Regístrate
          </Button>

          {/* <Avatar
            src={user.avatar}
            sx={{ cursor: 'pointer' }}
            onClick={handleMenuOpen}
          /> */}
        </Box>

        {/* Menú del usuario */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: 320,
              backgroundColor: '#1e1e1e',
              color: '#fafafa',
              p: 2,
            }
          }}
        >
          <Box textAlign="center" mb={2}>
            <Avatar src={user.avatar} sx={{ width: 60, height: 60, mx: 'auto' }} />
            <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
            <Typography variant="body2" color="gray">{user.email}</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => {
                navigate('/dashboard/perfil');
                handleMenuClose();
              }}
            >
              Acceder al perfil
            </Button>
          </Box>

          <Paper sx={{ p: 2, backgroundColor: '#2b2b2b' }} variant="outlined">
            <Typography fontSize={14}>Estás en la posición nro.</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmojiEvents fontSize="small" />
                <Typography variant="h6">1</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <MonetizationOn fontSize="small" />
                <Typography variant="subtitle2">{user.points}</Typography>
              </Box>
            </Box>
            <Typography variant="caption" display="block" mt={1}>
              El ranking se actualiza diariamente
            </Typography>
            <Button
              size="small"
              sx={{ mt: 1, color: '#90caf9' }}
              onClick={() => {
                navigate(user.rankingUrl);
                handleMenuClose();
              }}
            >
              Mostrar ranking
            </Button>
          </Paper>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body2">Tema Oscuro</Typography>
            <Switch defaultChecked />
          </Box>

          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel sx={{ color: '#bbb' }}>Idioma</InputLabel>
            <Select defaultValue="es" label="Idioma" sx={{ color: '#fff' }}>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2, backgroundColor: '#444' }} />

          <MenuItem
            onClick={() => {
              navigate('/dashboard/perfil');
              handleMenuClose();
            }}
          >
            <ListItemIcon><AccountCircle sx={{ color: '#fafafa' }} /></ListItemIcon>
            Mi cuenta
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/dashboard/mis-compras');
              handleMenuClose();
            }}
          >
            <ListItemIcon><ShoppingCart sx={{ color: '#fafafa' }} /></ListItemIcon>
            Mis compras
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/dashboard/faq');
              handleMenuClose();
            }}
          >
            <ListItemIcon><HelpOutline sx={{ color: '#fafafa' }} /></ListItemIcon>
            Central de Ayuda
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon><Logout sx={{ color: '#fafafa' }} /></ListItemIcon>
            Salir
          </MenuItem>
        </Menu>
      </Toolbar>
      <ModalPreRegistro open={openModal} onClose={() => setOpenModal(false)} />
    </AppBar>
  );
};

export default Headerweb;

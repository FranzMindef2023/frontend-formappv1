import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Toolbar
} from '@mui/material';
import {
  Home,
  Inventory2,
  EmojiEvents,
  HelpOutline
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Inicio', icon: <Home />, path: '/dashboard' },
    { text: 'Productos', icon: <Inventory2 />, path: '/dashboard/productos' },
    { text: 'Puntos y Ranking', icon: <EmojiEvents />, path: '/dashboard/ranking' },
    { text: 'Preguntas frecuentes', icon: <HelpOutline />, path: '/dashboard/faq' }
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#191c1f',
        color: '#FAFBFC',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <img src="/favicon.ico" alt="logo" width={24} />
        <Box ml={1} fontWeight="bold" fontSize={18}>
          TESIS
        </Box>
      </Toolbar>

      <Divider sx={{ backgroundColor: '#333' }} />

      <Box flex={1}>
        <List>
          {menuItems.map(({ text, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItemButton
                key={text}
                onClick={() => navigate(path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  color: '#FAFBFC',
                  backgroundColor: isActive ? '#4b0f05' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#4b0f05',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#4b0f05',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#4b0f05',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#FAFBFC' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ backgroundColor: '#333' }} />

      <Box textAlign="center" py={2} fontSize={12} color="#777">
        Powered by <span style={{ color: 'gray' }}>hotmart</span>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#0f0f0f'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#0f0f0f'
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

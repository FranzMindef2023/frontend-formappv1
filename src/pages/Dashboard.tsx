import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    <Box>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box sx={{ fontSize: 40 }}>{icon}</Box>
  </Paper>
);

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Panel de Control
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} sx={{ mb: { xs: 2, sm: 0 } }}>
          <StatCard
            title="Usuarios Activos"
            value="1.245"
            icon={<PeopleIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ mb: { xs: 2, sm: 0 } }}>
          <StatCard
            title="Reportes Generados"
            value="342"
            icon={<BarChartIcon color="success" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Configuraciones"
            value="15"
            icon={<SettingsIcon color="warning" fontSize="large" />}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Resumen general
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Este panel te permite monitorear los módulos clave del sistema. Utilice el menú lateral para navegar por usuarios, informes y configuraciones.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;

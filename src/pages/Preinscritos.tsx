import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Tooltip,
  InputAdornment
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const centros = ['Centro A', 'Centro B'];
const unidades = ['Unidad 1', 'Unidad 2'];

const datosPreinscritos = [
  { nombre: 'Juan Pérez', ci: '12345678', centro: 'Centro A', unidad: 'Unidad 1' },
  { nombre: 'Ana López', ci: '87654321', centro: 'Centro B', unidad: 'Unidad 2' },
  { nombre: 'Luis Gómez', ci: '11223344', centro: 'Centro A', unidad: 'Unidad 2' },
];

const Preinscritos: React.FC = () => {
  const [centro, setCentro] = useState('');
  const [unidad, setUnidad] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultadoBase, setResultadoBase] = useState<any[]>([]); // Resultado de filtros
  const [filtrados, setFiltrados] = useState<any[]>([]); // Resultado final tras búsqueda

  // FILTRO por centro y unidad al presionar el botón
  const aplicarFiltros = () => {
    const resultado = datosPreinscritos.filter((p) => {
      const coincideCentro = !centro || p.centro === centro;
      const coincideUnidad = !unidad || p.unidad === unidad;
      return coincideCentro && coincideUnidad;
    });
    setResultadoBase(resultado);
  };

  // BUSQUEDA sobre los resultados filtrados
  useEffect(() => {
    const resultadoFiltrado = resultadoBase.filter((p) => {
      return (
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.ci.includes(busqueda)
      );
    });
    setFiltrados(resultadoFiltrado);
  }, [busqueda, resultadoBase]);

  const exportarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('Reporte de Preinscritos', 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [['Nombre', 'CI', 'Centro', 'Unidad']],
    body: filtrados.map(p => [p.nombre, p.ci, p.centro, p.unidad]),
  });

  doc.save('reporte-preinscritos.pdf');
};

  const exportarExcel = () => {
    alert('Aquí se exportaría a Excel');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Preinscritos
      </Typography>

      {/* FILTROS */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Fuerza</InputLabel>
            <Select value={centro} onChange={(e) => setCentro(e.target.value)} label="Fuerza">
              <MenuItem value="">Todos</MenuItem>
              {centros.map((c, i) => (
                <MenuItem key={i} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Centro de Reclutamiento</InputLabel>
            <Select value={centro} onChange={(e) => setCentro(e.target.value)} label="Centro de Reclutamiento">
              <MenuItem value="">Todos</MenuItem>
              {centros.map((c, i) => (
                <MenuItem key={i} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Unidad Militar Destinada</InputLabel>
            <Select value={unidad} onChange={(e) => setUnidad(e.target.value)} label="Unidad Militar Destinada">
              <MenuItem value="">Todas</MenuItem>
              {unidades.map((u, i) => (
                <MenuItem key={i} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FilterAltIcon />}
            onClick={aplicarFiltros}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>

      {/* BUSQUEDA + EXPORTACIONES */}
      <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre o CI"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item>
          <Tooltip title="Exportar a PDF">
            <Button variant="contained" color="error" onClick={exportarPDF} startIcon={<PictureAsPdfIcon />}>
              PDF
            </Button>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="Descargar Excel">
            <Button variant="outlined" color="success" onClick={exportarExcel} startIcon={<FileDownloadIcon />}>
              Excel
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {/* TABLA */}
      <Paper elevation={2}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>CI</strong></TableCell>
              <TableCell><strong>Centro</strong></TableCell>
              <TableCell><strong>Unidad</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.length > 0 ? (
              filtrados.map((p, index) => (
                <TableRow key={index} hover sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.ci}</TableCell>
                  <TableCell>{p.centro}</TableCell>
                  <TableCell>{p.unidad}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay resultados. Aplica filtros o realiza una búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {filtrados.length > 0 && (
        <Box mt={2} textAlign="right" fontSize={13} color="text.secondary">
          Total encontrados: {filtrados.length}
        </Box>
      )}
    </Box>
  );
};

export default Preinscritos;

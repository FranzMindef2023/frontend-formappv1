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
  InputAdornment,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  getFuerzas
} from '../services/fuerzas';

import {
  getCentrosdeReclutamientos,
  getUnidadesMilitares,
  getPersonasFiltradas
} from '../services/filtros';

const Preinscritos: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultadoBase, setResultadoBase] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);

  const [fuerzas, setFuerzas] = useState<{ id: number; nombre: string }[]>([]);
  const [fuerzaSeleccionada, setFuerzaSeleccionada] = useState('');
  const [centros, setCentros] = useState<{ id: number; descripcion: string }[]>([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState('');
  const [unidades, setUnidades] = useState<{ id: number; descripcion: string }[]>([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('');

  const calcularEdad = (fecha: string) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const aplicarFiltros = async () => {
    try {
      const unidad = unidades.find(u => u.descripcion === unidadSeleccionada);
      const centro = centros.find(c => c.descripcion === centroSeleccionado);

      const params: any = {};
      if (fuerzaSeleccionada) params.id_fuerza = parseInt(fuerzaSeleccionada);
      if (centro) params.id_centro_reclutamiento = centro.id;
      if (unidad) params.id_unidad_militar = unidad.id;

      const res = await getPersonasFiltradas(params);
      if (res.data.status) {
        setResultadoBase(res.data.data);
      } else {
        setResultadoBase([]);
      }
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      setResultadoBase([]);
    }
  };

  useEffect(() => {
    getFuerzas()
      .then(res => {
        if (res.data.status) {
          setFuerzas(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (fuerzaSeleccionada) {
      getCentrosdeReclutamientos({ id_fuerza: parseInt(fuerzaSeleccionada) })
        .then(res => {
          if (res.data.status) {
            setCentros(res.data.data);
          }
        })
        .catch(console.error);
    } else {
      setCentros([]);
      setCentroSeleccionado('');
    }
  }, [fuerzaSeleccionada]);

  useEffect(() => {
    const centro = centros.find(c => c.descripcion === centroSeleccionado);
    if (centro) {
      getUnidadesMilitares({ id_centro_reclutamiento: centro.id })
        .then(res => {
          if (res.data.status) {
            setUnidades(res.data.data);
          }
        })
        .catch(console.error);
    } else {
      setUnidades([]);
      setUnidadSeleccionada('');
    }
  }, [centroSeleccionado]);

  useEffect(() => {
    const resultadoFiltrado = resultadoBase.filter((p) => {
      return (
        !busqueda ||
        `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
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
      head: [['Nombre Completo', 'CI', 'Complemento CI', 'Expedido', 'Fecha Nacimiento', 'Edad', 'Celular', 'Nacionalidad']],
      body: filtrados.map(p => [
        `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido || ''}`,
        p.ci,
        p.complemento_ci || '',
        p.expedido,
        new Date(p.fecha_nacimiento).toLocaleDateString(),
        calcularEdad(p.fecha_nacimiento),
        p.celular,
        p.nacionalidad,
      ]),
    });

    doc.save('preinscritos.pdf');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Preinscritos
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Fuerza</InputLabel>
            <Select
              value={fuerzaSeleccionada}
              onChange={(e) => setFuerzaSeleccionada(e.target.value)}
              label="Fuerza"
            >
              <MenuItem value="">TODOS</MenuItem>
              {fuerzas.map((fuerza) => (
                <MenuItem key={fuerza.id} value={fuerza.id}>
                  {fuerza.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Centro de Reclutamiento</InputLabel>
            <Select
              value={centroSeleccionado}
              onChange={(e) => setCentroSeleccionado(e.target.value)}
              label="Centro de Reclutamiento"
            >
              <MenuItem value="">TODOS</MenuItem>
              {centros.map((c) => (
                <MenuItem key={c.id} value={c.descripcion}>
                  {c.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Unidad Militar Destinada</InputLabel>
            <Select
              value={unidadSeleccionada}
              onChange={(e) => setUnidadSeleccionada(e.target.value)}
              label="Unidad Militar Destinada"
            >
              <MenuItem value="">TODOS</MenuItem>
              {unidades.map((u) => (
                <MenuItem key={u.id} value={u.descripcion}>
                  {u.descripcion}
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
            <Button variant="outlined" color="success" onClick={() => alert('Exportar a Excel')} startIcon={<FileDownloadIcon />}>
              Excel
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Paper elevation={2}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Nombre Completo</strong></TableCell>
              <TableCell><strong>CI</strong></TableCell>
              <TableCell><strong>Complemento CI</strong></TableCell>
              <TableCell><strong>Expedido</strong></TableCell>
              <TableCell><strong>Fecha de Nacimiento</strong></TableCell>
              <TableCell><strong>Edad</strong></TableCell>
              <TableCell><strong>Celular</strong></TableCell>
              <TableCell><strong>Nacionalidad</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.length > 0 ? (
              filtrados.map((p, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${p.nombres} ${p.primer_apellido} ${p.segundo_apellido || ''}`}</TableCell>
                  <TableCell>{p.ci}</TableCell>
                  <TableCell>{p.complemento_ci || ''}</TableCell>
                  <TableCell>{p.expedido}</TableCell>
                  <TableCell>{new Date(p.fecha_nacimiento).toLocaleDateString()}</TableCell>
                  <TableCell>{calcularEdad(p.fecha_nacimiento)}</TableCell>
                  <TableCell>{p.celular}</TableCell>
                  <TableCell>{p.nacionalidad}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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

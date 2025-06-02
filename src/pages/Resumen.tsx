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
  TableFooter,
  TextField,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getFuerzas } from '../services/fuerzas';
import {
  getResumenRegistroPorUnidad,
  getListasUnidadesMilitares,
  getRelacionNominal
} from '../services/filtros';

const Resumen: React.FC = () => {
  const [fuerzas, setFuerzas] = useState<{ id: number; nombre: string }[]>([]);
  const [fuerzaSeleccionada, setFuerzaSeleccionada] = useState('');
  const [centros, setCentros] = useState<{ id: number; descripcion: string }[]>([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState('');

  const [resultadoBase, setResultadoBase] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    getFuerzas()
      .then((res) => {
        if (res.data.status) {
          setFuerzas(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (fuerzaSeleccionada) {
      getListasUnidadesMilitares({ id_fuerza: parseInt(fuerzaSeleccionada) })
        .then((res) => {
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
    const resultadoFiltrado = resultadoBase.filter((p) =>
      !busqueda ||
      p.unidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.centro.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFiltrados(resultadoFiltrado);
  }, [busqueda, resultadoBase]);

  const aplicarFiltros = async () => {
    const params: any = {};
    if (fuerzaSeleccionada) params.id_fuerza = parseInt(fuerzaSeleccionada);
    if (centroSeleccionado) {
      const centro = centros.find((c) => c.descripcion === centroSeleccionado);
      if (centro) params.id_centro = centro.id;
    }

    try {
      const res = await getResumenRegistroPorUnidad(params);
      if (res.data.status) {
        const resultado = res.data.data.map((item: any) => ({
          centro: centroSeleccionado || '',
          unidad: item.unidad_militar,
          cantidad: item.cantidad_registrados,
          id_unidad_militar: item.id_unidad_militar,
        }));
        setResultadoBase(resultado);
      } else {
        setResultadoBase([]);
      }
    } catch (err) {
      console.error('Error al aplicar filtros:', err);
      setResultadoBase([]);
    }
  };

  const generarRelacionNominalPDF = async (registro: any) => {
    try {
      const res = await getRelacionNominal({ id_centro_reclutamiento: registro.id_unidad_militar });

      if (!res.data.status) {
        alert('No se pudo obtener la relación nominal.');
        return;
      }

      const unidad = res.data.data.unidad_militar;
      const personas = res.data.data.relacion_nominal;

      const doc = new jsPDF();

      // Información alineada a la izquierda
      doc.setFontSize(12);
      doc.text(`Unidad Militar: ${unidad.unidad_militar}`, 14, 20);
      doc.text(`Gestión: ${unidad.gestion}`, 14, 27);
      doc.text(`Cantidad Registrados: ${unidad.cantidad_registrados}`, 14, 34);

      // Tabla
      const filas = personas.map((p: any) => [
        `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido}`,
        `${p.ci}${p.complemento_ci ? '-' + p.complemento_ci : ''}`,
        p.expedido,
        p.fecha_nacimiento
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Nombre Completo', 'CI', 'Expedido', 'Fecha de Nacimiento']],
        body: filas,
      });

      doc.save(`RelacionNominal_${unidad.unidad_militar.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resumen de Preinscritos por Unidad
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
              {fuerzas.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nombre}
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

      {/* Tabla */}
      <Paper elevation={2}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Centro</strong></TableCell>
              <TableCell><strong>Unidad</strong></TableCell>
              <TableCell><strong>Cantidad Registrados</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.length > 0 ? (
              filtrados.map((p, index) => (
                <TableRow key={index} hover sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                  <TableCell>{p.id_unidad_militar}</TableCell>
                  <TableCell>{p.unidad}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>
                    <Tooltip title="Descargar Relación Nominal">
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => generarRelacionNominalPDF(p)}
                      >
                        PDF
                      </Button>
                    </Tooltip>
                  </TableCell>
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} align="right"><strong>Total:</strong></TableCell>
              <TableCell><strong>{filtrados.reduce((sum, p) => sum + p.cantidad, 0)}</strong></TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </Box>
  );
};

export default Resumen;

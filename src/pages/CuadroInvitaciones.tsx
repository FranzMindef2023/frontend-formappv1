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
import Cookies from 'js-cookie';

import { getFuerzas } from '../services/fuerzas';
import {
  getResumenRegistroPorUnidadMilitares,
  getListasCentrosdeReclutamiento,
  getListaInvitados
} from '../services/filtros';


const CuadroInvitaciones: React.FC = () => {
  const [fuerzas, setFuerzas] = useState<{ id: number; nombre: string }[]>([]);
  const [fuerzaSeleccionada, setFuerzaSeleccionada] = useState('');
  const [centros, setCentros] = useState<{ id: number; descripcion: string }[]>([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState('');

  const [resultadoBase, setResultadoBase] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };
  const getImageBase64FromUrl = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

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
      getListasCentrosdeReclutamiento({ id_fuerza: parseInt(fuerzaSeleccionada) })
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
      const res = await getResumenRegistroPorUnidadMilitares(params);
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

  // const generarRelacionNominalPDF = async (registro: any) => {
  //   try {
  //     const res = await getListaInvitados({ id_centro_reclutamiento: registro.id_unidad_militar });

  //     if (!res.data.status) {
  //       alert('No se pudo obtener la relación nominal.');
  //       return;
  //     }

  //     const unidad = res.data.data.unidad_militar;
  //     const personas = res.data.data.relacion_nominal;

  //     const doc = new jsPDF();
  //     const logoBase64 = await getImageBase64FromUrl('/siremil/minlogo.png');
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const pageHeight = doc.internal.pageSize.getHeight();

  //     // Obtener nombre del usuario desde la cookie
  //     const cookieUser = Cookies.get('user');
  //     let usuarioNombre = '';
  //     if (cookieUser) {
  //       try {
  //         const usuario = JSON.parse(cookieUser);
  //         usuarioNombre = `${usuario.nombres || ''} ${usuario.appaterno || ''} ${usuario.apmaterno || ''}`;
  //       } catch (e) {
  //         console.error("Error al parsear la cookie de usuario:", e);
  //       }
  //     }

  //     const fechaActual = new Date().toLocaleString();

  //     autoTable(doc, {
  //       startY: 42,
  //       head: [['N°', 'Nombres', 'P. Apellido', 'S. Apellido', 'CI', 'Compl.', 'Expedido', 'Fecha Nac.', 'Edad']],
  //       body: personas.map((p: any, i: number) => [
  //         i + 1,
  //         p.nombres,
  //         p.primer_apellido,
  //         p.segundo_apellido || '',
  //         p.ci,
  //         p.complemento_ci || '',
  //         p.expedido,
  //         new Date(p.fecha_nacimiento).toLocaleDateString(),
  //         calcularEdad(p.fecha_nacimiento),
  //       ]),
  //       didDrawPage: function () {
  //         // Título
  //       doc.setFontSize(14);
  //       doc.text('Relacion Nominal de los Pre-Inscritos', 50, 35);
  //         // Logo
  //         doc.addImage(logoBase64, 'PNG', 10, 8, 70, 0);

  //         // Datos alineados a la derecha
  //         doc.setFontSize(12);
  //         const textoUM = `Unidad Militar: ${unidad.unidad_militar}`;
  //         const textoGestion = `Gestión: ${unidad.gestion}`;
  //         const textoCantidad = `Cantidad Registrados: ${unidad.cantidad_registrados}`;

  //         doc.text(textoUM, pageWidth - doc.getTextWidth(textoUM) - 14, 20);
  //         doc.text(textoGestion, pageWidth - doc.getTextWidth(textoGestion) - 14, 27);
  //         doc.text(textoCantidad, pageWidth - doc.getTextWidth(textoCantidad) - 14, 34);

  //         // Pie de página: fecha, usuario y número de página
  //         doc.setFontSize(10);
  //         const textoFecha = `Fecha: ${fechaActual}`;
  //         const textoUsuario = `Usuario: ${usuarioNombre}`;
  //         const paginaActual = (doc as any).internal.getCurrentPageInfo().pageNumber;
  //         const totalPaginas = (doc as any).internal.getNumberOfPages();
  //         const textoPagina = `Página ${paginaActual} de ${totalPaginas}`;

  //         doc.text(textoFecha, 14, pageHeight - 12);
  //         doc.text(textoUsuario, 14, pageHeight - 6);
  //         doc.text(textoPagina, pageWidth - doc.getTextWidth(textoPagina) - 14, pageHeight - 6);
  //       }
  //     });

  //     const nombrePDF = `RelacionNominal_${unidad.unidad_militar.replace(/\s+/g, '_')}.pdf`;
  //     doc.save(nombrePDF);
  //   } catch (error) {
  //     console.error('Error al generar PDF:', error);
  //     alert('Error al generar el PDF.');
  //   }
  // };
  const generarOficiosPDFUnificado = async (registro: any) => {
    try {
      const res = await getListaInvitados({ id_centro_reclutamiento: registro.id_unidad_militar });

      if (!res.data.status) {
        alert('No se pudo obtener la relación nominal.');
        return;
      }

      const unidad = res.data.data.unidad_militar;
      const personas = res.data.data.relacion_nominal;

      const doc = new jsPDF();
      const logoBase64 = await getImageBase64FromUrl('/siremil/minlogo.png');
      const logoBase64Firma = await getImageBase64FromUrl('/siremil/FirmaMAE20.png');

      // Para cada estudiante, añadir una página con su oficio
      for (let i = 0; i < personas.length; i++) {
        const estudiante = {
          ...personas[i],
          unidad_militar: unidad.unidad_militar,
        };

        // En la primera iteración, no agregues página (ya está creada)
        if (i > 0) doc.setPage(i + 1);

        await agregarOficioInvitacionAlPDF(doc, estudiante, logoBase64,logoBase64Firma);
      }

      const nombrePDF = `OficiosInvitacion_${unidad.unidad_militar.replace(/\s+/g, '_')}.pdf`;
      doc.save(nombrePDF);
    } catch (error) {
      console.error('Error al generar el PDF de oficios:', error);
      alert('No se pudo generar el PDF.');
    }
  };

  const agregarOficioInvitacionAlPDF = async (doc: jsPDF, estudiante: any, logoBase64: string,logoBase64Firma:string) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const fechaActual = new Date();
  const fechaStr = `La Paz, ${fechaActual.toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })}`;

  doc.addImage(logoBase64, 'PNG', 10, 10, 80, 0);
  doc.addImage(logoBase64Firma, 'PNG', 15, 190, 190, 70);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);


  // Alineación derecha para fecha y número de oficio
  doc.text(fechaStr, pageWidth - 20, 30, { align: 'right' });

 doc.setFont('times', 'bold');
doc.setFontSize(12);

const text = `MD-SD-VIDECODI-DGTM-UOT. PREMIL Nº ${estudiante.correlativo}/25`;
const textX = pageWidth - 20;
const textY = 35;

// Texto alineado a la derecha
doc.text(text, textX, textY, { align: 'right' });

// Subrayado manual
const textWidth = doc.getTextWidth(text);
doc.line(textX - textWidth, textY + 1, textX, textY + 1); // línea debajo del texto



  doc.setFontSize(12);
   doc.setFont('times', 'normal');
  doc.text(`Estudiante:`, 20, 55);
  doc.setFont('times', 'bold');
  doc.text(`${estudiante.nombres} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`, 20, 60);
  doc.text(`Unidad Educativa "${estudiante.unidad_educativa}"`, 20, 65);
  doc.setFont('times', 'normal');
  doc.text(`Presente.-`, 20, 70);

  doc.setFont('times', 'normal');
  autoTable(doc, {
  startY: 75,
  margin: { left: 18, right: 20 }, // Reduce márgenes para más espacio
  body: [
    [
      {
        content:
          `A nombre del Ministerio de Defensa del Estado Plurinacional de Bolivia, en concordancia con la Ley Nº 954, de 9 de Junio de 2017 y considerando su excelente desempeño académico en la gestión escolar del ${fechaActual.getFullYear() - 1}, tengo el agrado de invitarle al proceso de selección del SERVICIO PREMILITAR VOLUNTARIO de la Categoría 2025–2026, y a ser parte integrante de las Fuerzas Armadas del Estado. En este sentido, a fin de cumplir con los requisitos establecidos en el Artículo 108º (numeral 12) y el Art. 249º de la Constitución Política del Estado, le comunico la información para su presentación voluntaria, correspondiente al periodo de Conscripción:`
      }
    ]
  ],
  styles: {
    font: 'times',
    fontSize: 12,
    halign: 'justify',
    cellPadding: 2,
  },
  columnStyles: {
    0: { cellWidth: 174 }, // Ajuste horizontal máximo
  },
  theme: 'plain',
});



  autoTable(doc, {
  startY: 120,
  margin: { left: 20, right: 20 },
  head: [],
  body: [
    [
      {
        content: 'INFORMACIÓN DE PRESENTACIÓN',
        colSpan: 2,
        styles: {
          halign: 'center',
          fillColor: [230, 230, 230],
          fontStyle: 'bold'
        }
      }
    ],
    ['Unidad Militar', estudiante.unidad_militar],
    ['Fecha', new Date(estudiante.fecha_presentacion).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Hora', estudiante.hora_presentacion],
    ['Acreditación', 'Cédula de Identidad'],
  ],
  styles: {
    font: 'times',
    fontSize: 11,
    cellPadding: 3,
  },
  columnStyles: {
    0: { cellWidth: 60, fontStyle: 'bold' },
    1: { cellWidth: 110 },
  },
  theme: 'grid',
});




  doc.text(
    `Con este especial motivo y a tiempo de agradecer la recepción de la presente invitación, ` +
    `me despido de Usted con toda atención.`,
    20, 180, { maxWidth: 170 }
  );

  doc.setFontSize(10);
  doc.text(
    `NOTA: Estudiantes invitados(as) al proceso de selección del Servicio Premilitar, NO están exentos del depósito por matrículas.`,
    20, 260, { maxWidth: 170 }
  );

  doc.addPage(); // ✅ Agrega una nueva página para el siguiente estudiante
};


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resumen de Invitaciones por Unidades Militares
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
                <TableRow key={index} hover sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }} >
                  <TableCell>{p.id_unidad_militar}</TableCell>
                  <TableCell>{p.unidad}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="Invitaciones">
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => generarOficiosPDFUnificado(p)}
                        >
                          PDF
                        </Button>
                      </Tooltip>

                      <Tooltip title="Unidades Educativas">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<PictureAsPdfIcon />}
                        >
                          PDF
                        </Button>
                      </Tooltip>
                      <Tooltip title="Relación Nominal">
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          startIcon={<PictureAsPdfIcon />}
                        >
                          PDF
                        </Button>
                      </Tooltip>
                    </Box>
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

export default CuadroInvitaciones;

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Box, Snackbar, Alert, Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ReCAPTCHA from 'react-google-recaptcha';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Tesseract from 'tesseract.js';
import { enviarPreinscripcion , consultarDatosPersona} from '../services/preinscripcion';
import {
  getDepartamentos,
  getMunicipiosByDepartamento,
  getZonasGeograficas,
  getZonaByDepartamento
} from '../services/ubicacion';
import { getProvinciasByDepartamento } from '../services/ubicacionesum';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
const getImageBase64FromUrl = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
export const generarFormularioPDF = async(values: any) => {
 const logoBase64 = await getImageBase64FromUrl('/siremil/minlogo.png');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // Agregar logo en la parte superior izquierda
 doc.addImage(logoBase64, 'PNG', 10, 8, 70, 0); // 30 mm de ancho


  const fechaActual = new Date().toLocaleDateString();
  const horaActual = new Date().toLocaleTimeString();

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  // doc.text('MINISTERIO DE DEFENSA DE LAS FF.AA.', 45, 12);
  doc.setFontSize(13);
  doc.text('FORMULARIO DE PRE-REGISTRO', 45, 28);
  doc.text('DEL SERVICIO MILITAR', 45, 34);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fechaActual} ${horaActual}`, 145, 12);
  doc.text(`Gestión: 2025`, 145, 17);
  doc.text(`Usuario: USUARIOINTERNET`, 145, 22);
  doc.text(`Ambiente: PRODUCCION`, 145, 27);
  doc.text(`Reporte: RBenRegBeneficiario`, 145, 32);

  doc.setFont('helvetica', 'bold');
  // doc.text('Categoría', 14, 38);
  // doc.text('Sub Categoría:', 60, 38);
  doc.text('N° de Registro:', 140, 38);
  doc.setFont('helvetica', 'normal');
  // doc.text('PRIVADO', 34, 38);
  // doc.text('NATURAL', 94, 38);
  doc.text('1189762', 177, 38);

  const sectionTitle = (title: string, offsetY = 3) => {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable?.finalY + offsetY || 44,
      head: [[title]],
      body: [],
      theme: 'plain',
      styles: { fontSize: 10 },
      headStyles: {
        fontStyle: 'bold',
        fillColor: [230, 230, 230],
        halign: 'left',
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
    });
  };

  const nextTable = (rows: any[][], headers: string[], extraY = 1) =>
    autoTable(doc, {
      startY: (doc as any).lastAutoTable?.finalY + extraY || 44,
      head: [headers],
      body: rows,
      styles: {
        fontSize: 9,
        valign: 'middle',
        minCellHeight: 6
      },
      headStyles: {
        fontSize: 8,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5
    });

  sectionTitle('DATOS PERSONALES', 6);
  nextTable([[ 'Cédula de Identidad', values.ci, values.lugar_expedicion, 'BOLIVIA' ]],
    ['Tipo de Identificación', 'Número Documento', 'Lugar Expedición', 'País']);
  nextTable([[values.primer_apellido, values.segundo_apellido, values.nombres]], ['Primer Apellido', 'Segundo Apellido', 'Nombres']);
  // nextTable([[`${values.primer_apellido} ${values.segundo_apellido} ${values.nombres}`, '', '']], ['Razón Social', 'Nombre Comercial', 'Registro Empresarial']);
  nextTable([[values.correo || 'N/D']], ['Correo Electrónico']);

  sectionTitle('LUGAR DE RESIDENCIA ACTUAL');
  nextTable([[values.departamento_residencia, values.provincia_residencia, 'BOLIVIA', '']], ['Departamento', 'Provincia', 'País', 'Casilla Postal']);
  nextTable([[values.direccion, values.celular, '0']], ['Dirección', 'Teléfono', 'Fax']);

  sectionTitle('LUGAR DONDE TE HARÁN EL EXAMEN MÉDICO Y PRESENTACIÓN DE DOCUMENTOS');
  nextTable([[
    values.departamento_presentacion,
    values.provincia_presentacion,
    `${values.unidad_presentacion}`,
    'BO',
    `${values.fecha_presentacion}`, `${values.hora_presentacion}`, 
  ]], ['Depto', 'Provincia', 'Unidad Militara', 'País', 'Fecha de Presentación', 'Hora']);

  sectionTitle('UNIDAD MILITAR DE DESTINO DONDE HARÁS TU SERVICIO MILITAR');
  nextTable(
    values.cuentas_bancarias?.map((c: any) => [
      c.banco,
      c.cuenta,
      c.distrito,
      c.moneda,
      c.tipo,
      c.fecha,
      c.verificacion,
      c.estado
    ]) || [[values.departamento_servicio, values.provincia_servicio, values.unidad_militar_servicio, 'BOLIVIA', values.fecha_presentacion,values.hora_presentacion]],
    ['Depto', 'Provincia', 'Unidad Militar', 'País', 'Fecha de Presentación', 'Hora']
  );

  const finalY = (doc as any).lastAutoTable?.finalY || 250;
  doc.setFontSize(10);
  doc.text('(Firma del Beneficiario)', 14, finalY + 10);
  doc.text('(Aclaración de Firma)', 14, finalY + 18);
  doc.text(`Fecha y usuario creación: ${fechaActual}`, 14, finalY + 26);
  doc.text(`Fecha y usuario activación: ${fechaActual}`, 14, finalY + 32);

  doc.setFontSize(9);
  doc.text('Nota: Este formulario tiene validez oficial para efectos de preinscripción y selección militar.', 14, finalY + 42);
  doc.text('En cumplimiento de la Ley del Servicio Militar Obligatorio N° 954 de 1987.', 14, finalY + 48);

  doc.setFontSize(10);
  doc.text('Página 1 de 1', 105, 290, { align: 'center' });

  doc.save(`Formulario-${values.ci}.pdf`);
};

interface ModalPreRegistroProps {
  open: boolean;
  onClose: () => void;
}

const ModalPreRegistro: React.FC<ModalPreRegistroProps> = ({ open, onClose }) => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertAlets, setAlertAlets] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [zonasdepartamento, setZonasDepartamento] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [zonasGeograficas, setZonasGeograficas] = useState([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [registroMensaje, setRegistroMensaje] = useState<string | null>(null);
  const [mostrarBotonPDF, setMostrarBotonPDF] = useState(false);
  const [datosPersona, setDatosPersona] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombres: '',
      primer_apellido: '',
      segundo_apellido: '',
      ci: '',
      celular: '',
      lugar_expedicion: '',
      fecha_nacimiento: '',
      lugarNacimiento: '',
      departamento: '',
      localidad: '',
      departamento_nacimiento: '',
      zona_geografica: '',
      direccion: '', // <-- nuevo campo
    },
    validationSchema: Yup.object({
      nombres: Yup.string().required('Requerido'),
      primer_apellido: Yup.string().nullable(),
      segundo_apellido: Yup.string().nullable(),
      ci: Yup.string().required('Requerido'),
      celular: Yup.string()
      .required('El número de celular es obligatorio.')
      .matches(/^[6-7]\d{7}$/, 'El número de celular debe comenzar con 6 o 7 y tener 8 dígitos.'),
      lugar_expedicion: Yup.string().required('Requerido'),
      fecha_nacimiento: Yup.date()
              .required('Requerido')
              .max(new Date(), 'Fecha inválida')
              .test(
                'edad-actual',
                'Debes tener entre 17 y 22 años de edad actual',
                function (value) {
                  if (!value) return false;
                  const hoy = new Date();
                  const nacimiento = new Date(value);
                  let edad = hoy.getFullYear() - nacimiento.getFullYear();
                  const aunNoCumpleAnios =
                    hoy.getMonth() < nacimiento.getMonth() ||
                    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
                  if (aunNoCumpleAnios) edad--;
                  return edad >= 17 && edad <= 22;
                }
              ),
      lugarNacimiento: Yup.string().required('Requerido'),
      departamento: Yup.string().required('Requerido'),
      departamento_nacimiento: Yup.string().required('Requerido'),
      localidad: Yup.string().required('Requerido'),
      zona_geografica: Yup.string().required('Requerido'),
      direccion: Yup.string()
      .required('Dirección requerida')
      .min(5, 'Mínimo 5 caracteres')
      .max(250, 'Máximo 250 caracteres')
      .matches(/^[A-Za-z0-9\s\-#.,ºáéíóúÁÉÍÓÚñÑ]+$/, 'Solo se permiten letras, números y caracteres básicos'),
        }),
    onSubmit: async (values) => {
      
      if (!recaptchaToken) return setAlertOpen(true);
      setIsSubmitting(true); // ✅ bloquea
      const response = await consultarDatosPersona({
        nombres: values.nombres,
        ci: values.ci,
        fecha_nacimiento: values.fecha_nacimiento,
        primer_apellido: values.primer_apellido,
        segundo_apellido:values.segundo_apellido,
      });
      if(response.data.status==true){
        setAlertAlets(true);
        setIsSubmitting(false); // ✅ desbloquea
        // ✅ Extraer los datos para generar el PDF
        const data = response.data.data;
        const persona = data.persona;
        const residencia = data.residencia_actual;
        const destino = data.destino_presentacion;
        const asignacion = data.asignacion_presentacion;
        const valuesPDF={
          ci: persona.ci,
          lugar_expedicion: persona.sigla_expedido,
          primer_apellido: persona.primer_apellido,
          segundo_apellido: persona.segundo_apellido,
          nombres: persona.nombres,
          correo: persona.correo || 'N/D',
          celular: persona.celular,
          direccion: residencia?.direccion || '',
          departamento_residencia: residencia?.departamento?.descubigeo || '',
          provincia_residencia: residencia?.lugar_residencia?.descubigeo || '',

          unidad_presentacion: asignacion?.centro_reclutamiento?.descripcion || '',
          departamento_presentacion: asignacion?.centro_reclutamiento?.ubicacion?.descubigeo || '',
          provincia_presentacion: asignacion?.centro_reclutamiento?.provincia?.descubigeo || '',

          unidad_militar_servicio: asignacion?.descripcion || '',
          departamento_servicio: asignacion?.ubicacion?.descubigeo || '',
          provincia_servicio: asignacion?.provincia?.descubigeo || '',

          fecha_presentacion: asignacion?.fecha_presentacion || '',
          hora_presentacion: asignacion?.hora_presentacion || '',
        }
        setDatosPersona(valuesPDF);
        setRegistroMensaje(response.data.message); // <-- Este viene del backend
        setMostrarBotonPDF(true); // ya estaba registrado
        return;
      }

      
      try {
        const register= await enviarPreinscripcion({
          ...values,
          id_departamento_presenta: values.departamento,
          id_departamento: values.departamento_nacimiento,
          id_lugar_recidencia: values.lugarNacimiento,
          id_centro_reclutamiento: values.localidad,
          status: true,
          token: recaptchaToken
        });
        setAlertAlets(true);
        setIsSubmitting(false); // desbloquea siempre
        // Extraer datos para PDF del nuevo registro
        const data = register.data.data;
        const persona = data.persona;
        const residencia = data.residencia_actual;
        const destino = data.destino_presentacion;
        const asignacion = data.asignacion_presentacion;

        const valuesPDF = {
          ci: persona.ci,
          lugar_expedicion: persona.sigla_expedido,
          primer_apellido: persona.primer_apellido,
          segundo_apellido: persona.segundo_apellido,
          nombres: persona.nombres,
          correo: persona.correo || 'N/D',
          celular: persona.celular,
          direccion: residencia?.direccion || '',
          departamento_residencia: residencia?.departamento?.descubigeo || '',
          provincia_residencia: residencia?.lugar_residencia?.descubigeo || '',

          unidad_presentacion: asignacion?.centro_reclutamiento?.descripcion || '',
          departamento_presentacion: asignacion?.centro_reclutamiento?.ubicacion?.descubigeo || '',
          provincia_presentacion: asignacion?.centro_reclutamiento?.provincia?.descubigeo || '',

          unidad_militar_servicio: asignacion?.descripcion || '',
          departamento_servicio: asignacion?.ubicacion?.descubigeo || '',
          provincia_servicio: asignacion?.provincia?.descubigeo || '',

          fecha_presentacion: asignacion?.fecha_presentacion || '',
          hora_presentacion: asignacion?.hora_presentacion || '',
        };

        setDatosPersona(valuesPDF); // para generar PDF
        // Mostrar mensaje del backend
        setRegistroMensaje(register.data.message); // <-- Este viene del backend
        // Mostrar botón de PDF
        setRegistroExitoso(true);
        setMostrarBotonPDF(true); // registro nuevo exitoso
        //onClose();
        formik.resetForm();
       setRecaptchaToken(null);
      } catch (error: unknown) {
        setIsSubmitting(false); // desbloquea siempre
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const errores = error.response.data.errors;
          const mensaje = Object.values(errores)
            .map((msgs) => (msgs as string[])[0])
            .join('. ');
          setBackendError(mensaje);
        } else {
          setBackendError("Error del servidor.");
        }
      } else {
        setBackendError("Error inesperado.");
      }
    }
      // formik.resetForm();
      // setRecaptchaToken(null);
      // onClose();
    }
  });

  const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const imageDataUrl = reader.result as string;

      try {
        const result = await Tesseract.recognize(imageDataUrl, 'spa', {
          logger: m => console.log(m)
        });

        const text = result.data.text.toUpperCase();
        console.log("Texto detectado:", text);

        // CI
        const ciMatch = text.match(/\b\d{6,9}\b/);
        if (ciMatch) {
          formik.setFieldValue('ci', ciMatch[0]);
        }

        // Nombre completo: busca por línea que tenga nombre (ej: FRANZ VASQUEZ MENCIA)
        const nombreCompletoMatch = text.match(/FRANZ\s+[A-ZÁÉÍÓÚÑ]+(?:\s+[A-ZÁÉÍÓÚÑ]+)?/);
        if (nombreCompletoMatch) {
          const partes = nombreCompletoMatch[0].trim().split(/\s+/);
          formik.setFieldValue('nombres', partes[0] || '');
          formik.setFieldValue('primer_apellido', partes[1] || '');
          formik.setFieldValue('segundo_apellido', partes[2] || '');
        }

        // Fecha de nacimiento
        const fechaMatch = text.match(/(\d{1,2})\s+DE\s+([A-ZÁÉÍÓÚÑ]+)\s+DE\s+(\d{4})/);
        if (fechaMatch) {
          const [_, dia, mesTexto, anio] = fechaMatch;
          const meses: { [key: string]: string } = {
            ENERO: '01', FEBRERO: '02', MARZO: '03', ABRIL: '04',
            MAYO: '05', JUNIO: '06', JULIO: '07', AGOSTO: '08',
            SEPTIEMBRE: '09', OCTUBRE: '10', NOVIEMBRE: '11', DICIEMBRE: '12'
          };
          const mesNum = meses[mesTexto] || '01';
          const diaNum = dia.padStart(2, '0');
          const fechaFormateada = `${anio}-${mesNum}-${diaNum}`;
          formik.setFieldValue('fecha_nacimiento', fechaFormateada);
        }

      } catch (error) {
        console.error('Error OCR:', error);
      }

      setOcrLoading(false);
    };

    reader.readAsDataURL(file);
  };
 const handleInputUppercase = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, e.target.value.toUpperCase());
  };
  useEffect(() => {
    getDepartamentos().then(res => setDepartamentos(res.data));
    getZonasGeograficas().then(res => setZonasGeograficas(res.data));
  }, []);

  useEffect(() => {
    if (formik.values.departamento)
      getProvinciasByDepartamento(Number(formik.values.departamento)).then(res => setMunicipios(res.data));
    else setMunicipios([]);
  }, [formik.values.departamento]);

  useEffect(() => {
    if (formik.values.departamento_nacimiento)
      getMunicipiosByDepartamento(Number(formik.values.departamento_nacimiento)).then(res => setProvincias(res.data));
    else setProvincias([]);
  }, [formik.values.departamento_nacimiento]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ backgroundColor: '#fff', color: '#333' }}>
        <DialogTitle textAlign="center" sx={{ fontWeight: 'bold', color: '#F4511E' }}>
          Empieza a Registrarte gratis
        </DialogTitle>
        <DialogContent>
          <Snackbar 
          open={alertOpen} 
          autoHideDuration={4000} 
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="warning">Por favor completa el reCAPTCHA</Alert>
          </Snackbar>

          {/* <Button component="label" variant="outlined" fullWidth sx={{ mb: 2 }}>
            Subir CI para reconocimiento OCR
            <input type="file" hidden accept="image/*" onChange={handleOCR} />
          </Button> */}

          {ocrLoading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Procesando imagen, por favor espera...
            </Alert>
          )}
          {registroMensaje && (
            <Snackbar
            open={alertAlets}
            autoHideDuration={4000}
            onClose={() => setAlertAlets(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // centrado arriba
          >
            <Alert onClose={() => setAlertAlets(false)} severity="success" sx={{ width: '100%' }}>
              {registroMensaje}
            </Alert>
          </Snackbar>
          )}
          <Snackbar
            open={Boolean(backendError)}
            autoHideDuration={6000}
            onClose={() => setBackendError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // centrado arriba
          >
            <Alert onClose={() => setBackendError(null)} severity="error" sx={{ width: '100%' }}>
              {backendError}
            </Alert>
          </Snackbar>
          {/* Aquí continúa tu formulario completo con formik */}
          {/* <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
            <Alert severity="warning">Por favor completa el reCAPTCHA</Alert>
          </Snackbar> */}

          <form onSubmit={formik.handleSubmit}>


            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Datos personales
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'nombres', label: 'Nombres' },
                { name: 'primer_apellido', label: 'Primer Apellido' },
                { name: 'segundo_apellido', label: 'Segundo Apellido' },
                { name: 'ci', label: 'Cédula de Identidad' }
              ].map(({ name, label }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    name={name}
                    label={label}
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={formik.values[name as keyof typeof formik.values]}
                    onChange={handleInputUppercase}
                    onBlur={formik.handleBlur}
                    error={formik.touched[name as keyof typeof formik.touched] && Boolean(formik.errors[name as keyof typeof formik.errors])}
                    helperText={formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={formik.values.fecha_nacimiento}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.fecha_nacimiento && Boolean(formik.errors.fecha_nacimiento)}
                  helperText={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="lugar_expedicion"
                  label="Lugar de Expedición"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.lugar_expedicion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lugar_expedicion && Boolean(formik.errors.lugar_expedicion)}
                  helperText={formik.touched.lugar_expedicion && formik.errors.lugar_expedicion}
                >
                  {departamentos.map((dpto: any) => (
                    <MenuItem key={dpto.id} value={dpto.id}>
                      {dpto.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="celular"
                  label="Celular"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.celular}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.celular && Boolean(formik.errors.celular)}
                  helperText={formik.touched.celular && formik.errors.celular}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Lugar de residencia actual
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="departamento_nacimiento"
                  label="Departamento de Residencia"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.departamento_nacimiento}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value, 10);
                    formik.setFieldValue('departamento_nacimiento', selectedId);
                    getMunicipiosByDepartamento(selectedId).then((res) => {
                      setProvincias(res.data);
                      formik.setFieldValue('localidad', '');
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departamento_nacimiento && Boolean(formik.errors.departamento_nacimiento)}
                  helperText={formik.touched.departamento_nacimiento && formik.errors.departamento_nacimiento}
                >
                  {departamentos.map((dpto: any) => (
                    <MenuItem key={dpto.id} value={dpto.id}>{dpto.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="lugarNacimiento"
                  label="Provincia"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.lugarNacimiento}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lugarNacimiento && Boolean(formik.errors.lugarNacimiento)}
                  helperText={formik.touched.lugarNacimiento && formik.errors.lugarNacimiento}
                >
                  {provincias.map((muni: any) => (
                    <MenuItem key={muni.id} value={muni.id}>{muni.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="direccion"
                  label="Dirección"
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={2}
                  variant="outlined"
                  size="small"
                  value={formik.values.direccion}
                  onChange={handleInputUppercase}
                  onBlur={formik.handleBlur}
                  error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                  helperText={formik.touched.direccion && formik.errors.direccion}
                />
              </Grid>
            </Grid>

            <Box my={3} />

            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Datos del lugar de presentación
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="zona_geografica"
                  label="Zona Geográfica"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.zona_geografica}
                 onChange={(e) => {
                  const selectedZonaId = parseInt(e.target.value, 10);
                  formik.setFieldValue('zona_geografica', selectedZonaId);

                  getZonaByDepartamento(selectedZonaId).then((res) => {
                    setZonasDepartamento(res.data);              // solo departamentos de esa zona
                    formik.setFieldValue('departamento', '');
                    setMunicipios([]);
                  });
                }}
                                  onBlur={formik.handleBlur}
                  error={formik.touched.zona_geografica && Boolean(formik.errors.zona_geografica)}
                  helperText={formik.touched.zona_geografica && formik.errors.zona_geografica}
                >
                  {zonasGeograficas.map((zona: any) => (
                    <MenuItem key={zona.id} value={zona.id}>
                      {zona.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="departamento"
                  label="Departamento"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.departamento}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value, 10);
                    formik.setFieldValue('departamento', selectedId);
                    getProvinciasByDepartamento(selectedId).then((res) => {
                      setMunicipios(res.data);
                      formik.setFieldValue('localidad', '');
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departamento && Boolean(formik.errors.departamento)}
                  helperText={formik.touched.departamento && formik.errors.departamento}
                >
                  {zonasdepartamento.map((dpto: any) => (
                    <MenuItem key={dpto.id} value={dpto.id}>{dpto.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="localidad"
                  label="Ubicacion Unidad Militar"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={formik.values.localidad}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.localidad && Boolean(formik.errors.localidad)}
                  helperText={formik.touched.localidad && formik.errors.localidad}
                >
                  {municipios.map((muni: any) => (
                    <MenuItem key={muni.id} value={muni.id}>{muni.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box mt={3} textAlign="center">
              <ReCAPTCHA
                // sitekey="6Lc8o04rAAAAAN1ifZFnQTh01JSfy3eH3kiC96Be"
                sitekey="6LdVxkUrAAAAABycqyZfCgTKOFdJ8gkaE0gqYX9w"
                onChange={(value) => setRecaptchaToken(value)}
              />
            </Box>

            <DialogActions sx={{ mt: 3, justifyContent: 'center', flexDirection: 'column' }}>
              <Box display="flex" gap={2}>
                <Button
                  onClick={() => {
                    formik.resetForm();
                    setRecaptchaToken(null);
                    setDatosPersona(null); 
                    setRegistroExitoso(false);
                    setMostrarBotonPDF(false);
                    onClose();
                  }}
                  sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
                >
                  Cerrar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#388E3C' },
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSubmitting ? <span className="loader" /> : 'REGÍSTRATE GRATIS →'}
                </Button>
              </Box>

              {mostrarBotonPDF && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                     onClick={() => {
                        generarFormularioPDF(datosPersona);
                        setMostrarBotonPDF(false);   // ✅ ocultar botón después de descarga
                        setDatosPersona(null);       // ✅ limpiar datos
                      }}
                    startIcon={<DownloadIcon />}
                    sx={{ mt: 2, fontWeight: 'bold', letterSpacing: 1 }}
                    fullWidth
                  >
                    DESCARGAR FORMULARIO PDF
                  </Button>
                </Box>
              )}
            </DialogActions>
          </form>

        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ModalPreRegistro;

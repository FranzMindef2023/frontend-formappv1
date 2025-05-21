import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Box, Snackbar, Alert, Typography
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { enviarPreinscripcion } from '../services/preinscripcion';
import { getDepartamentos, getMunicipiosByDepartamento } from '../services/ubicacion';

interface ModalPreRegistroProps {
  open: boolean;
  onClose: () => void;
}

const ModalPreRegistro: React.FC<ModalPreRegistroProps> = ({ open, onClose }) => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const formik = useFormik({
    initialValues: {
      nombres: '',
      apellido1: '',
      apellido2: '',
      ci: '',
      celular: '',
      lugar_expedicion: '',
      fecha_nacimiento: '',
      lugarNacimiento: '',
      departamento: '',
      localidad: '',
      departamento_nacimiento: ''
    },
    validationSchema: Yup.object({
      nombres: Yup.string().required().matches(/^[A-ZÁÉÍÓÚÑ ]+$/, 'Solo mayúsculas'),
      apellido1: Yup.string().nullable().matches(/^[A-ZÁÉÍÓÚÑ ]*$/, 'Solo mayúsculas'),
      apellido2: Yup.string().nullable().matches(/^[A-ZÁÉÍÓÚÑ ]*$/, 'Solo mayúsculas'),
      ci: Yup.string()
          .required('Requerido')
          .matches(/^\d{5,8}$/, 'Debe tener entre 5 y 8 dígitos numéricos'),
      celular: Yup.string().required('Requerido').matches(/^\d{7,8}$/, 'Debe tener 7 u 8 dígitos'),
      lugar_expedicion: Yup.string().required('Requerido'),
      fecha_nacimiento: Yup.date()
        .required('Requerido')
        .max(new Date(), 'Fecha inválida')
        .test(
          'edad-actual',
          'Debes tener entre 16 y 18 años de edad actual',
          function (value) {
            if (!value) return false;
            const hoy = new Date();
            const nacimiento = new Date(value);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const aunNoCumpleAnios =
              hoy.getMonth() < nacimiento.getMonth() ||
              (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
            if (aunNoCumpleAnios) edad--;
            return edad >= 16 && edad <= 18;
          }
        ),
      lugarNacimiento: Yup.string().required('Requerido'),
      departamento: Yup.string().required('Requerido'),
      departamento_nacimiento: Yup.string().required('Requerido'),
      localidad: Yup.string().required('Requerido')
    }),
    onSubmit: async (values) => {
      if (!recaptchaToken) return setAlertOpen(true);
      try {
        await enviarPreinscripcion({
          ...values,
          id_departamento: values.departamento,
          id_lugar_nacimiento: values.lugarNacimiento,
          status: true,
          token: recaptchaToken
        });
        onClose();
      } catch (error) {
        console.error('Error al registrar:', error);
      }
      formik.resetForm();
      setRecaptchaToken(null);
      onClose();
    }
  });

  const handleInputUppercase = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(e.target.name, e.target.value.toUpperCase());
  };

  useEffect(() => {
    getDepartamentos().then(res => setDepartamentos(res.data));
  }, []);

  useEffect(() => {
    if (formik.values.departamento) {
      getMunicipiosByDepartamento(Number(formik.values.departamento)).then(res => setMunicipios(res.data));
    } else {
      setMunicipios([]);
    }
  }, [formik.values.departamento]);

  useEffect(() => {
    if (formik.values.departamento_nacimiento) {
      getMunicipiosByDepartamento(Number(formik.values.departamento_nacimiento)).then(res => setProvincias(res.data));
    } else {
      setProvincias([]);
    }
  }, [formik.values.departamento_nacimiento]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ backgroundColor: '#fff', color: '#333' }}>
        <DialogTitle textAlign="center" sx={{ fontWeight: 'bold', color: '#F4511E' }}>
          Empieza a Registrarte gratis
        </DialogTitle>

        <DialogContent>
          <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
            <Alert severity="warning">Por favor completa el reCAPTCHA</Alert>
          </Snackbar>

          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Datos personales
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'nombres', label: 'Nombres' },
                { name: 'apellido1', label: 'Primer Apellido' },
                { name: 'apellido2', label: 'Segundo Apellido' },
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
                      {dpto.sigla}
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
            </Grid>

            <Box my={3} />

            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Datos del lugar de presentación
            </Typography>
            <Grid container spacing={2}>
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
                    getMunicipiosByDepartamento(selectedId).then((res) => {
                      setMunicipios(res.data);
                      formik.setFieldValue('localidad', '');
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departamento && Boolean(formik.errors.departamento)}
                  helperText={formik.touched.departamento && formik.errors.departamento}
                >
                  {departamentos.map((dpto: any) => (
                    <MenuItem key={dpto.id} value={dpto.id}>{dpto.nombre}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="localidad"
                  label="Unidad Militar"
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
                sitekey="6LeSXDcrAAAAAJjOS5EBBSKGmPE6mgyZOrQuf1H-"
                onChange={(value) => setRecaptchaToken(value)}
              />
            </Box>

            <DialogActions sx={{ mt: 3, justifyContent: 'center' }}>
              <Button
                onClick={() => {
                  formik.resetForm();
                  setRecaptchaToken(null);
                  onClose();
                }}
                sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                sx={{ backgroundColor: '#4CAF50', color: '#fff', '&:hover': { backgroundColor: '#388E3C' } }}
              >
                Regístrate gratis →
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ModalPreRegistro;

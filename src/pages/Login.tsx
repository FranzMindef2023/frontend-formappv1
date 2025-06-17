import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, TextField, Typography, IconButton,
  InputAdornment, Divider, Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { useAuth } from '../auth/AuthContext';

// Fondo completo
const Background = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100vw',
  backgroundImage: "url('/siremil/DSC_3023.JPG')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: '#FAFBFC',
  position: 'relative'
});

// LoginBox centrado
const LoginBox = styled(Box)({
  backgroundColor: 'rgba(25,28,31, 0.95)',
  padding: '3rem',
  borderRadius: '16px',
  marginTop: '2rem',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  width: '100%',
  maxWidth: '440px'
});

// Header institucional superior izquierdo
const HeaderInstitutional = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100%',
  backgroundColor: '#fff',
  padding: '8px 12px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 10,

  [theme.breakpoints.up('md')]: {
    width: 'auto',
    left: '20px',
    top: '20px',
    borderRadius: '8px',
    padding: '8px 12px',
  }
}));

const SocialButton = styled(Button)({
  flex: 1,
  border: '1px solid #555',
  color: '#FAFBFC',
  borderRadius: 8,
  padding: '10px 0',
  textTransform: 'none'
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Correo electrónico no válido'
    )
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
    )
    .required('La contraseña es obligatoria')
    }),
    onSubmit: async (values) => {
      try {
        const response = await loginService(values.email, values.password);
        const token = response.data.access_token;
        const user = response.data.user || response.data.post;
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user', JSON.stringify(user));
        login(token);
        navigate('/dashboard');
      } catch (err) {
        alert('Credenciales inválidas o error del servidor');
      }
    }
  });

  useEffect(() => {
    if (Cookies.get('token')) navigate('/dashboard');
  }, [navigate]);

  return (
    <Background>
      {/* LOGO INSTITUCIONAL SUPERIOR IZQUIERDO */}
      <HeaderInstitutional>
        <img src="/siremil/minlogo.png" alt="Ministerio de Defensa" style={{ height: '60px' }} />
      </HeaderInstitutional>

      <LoginBox>
        <Container maxWidth="xs">
          {/* SOLO EL LOGO DEL SISTEMA DENTRO DEL FORMULARIO */}
          <Box mb={3} textAlign="center">
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'inline-block'
              }}
            >
              <img src="/siremil/logSiremil.png" alt="SIREMIL" style={{ height: '100px' }} />
            </Box>
          </Box>

          <Typography variant="body2" mb={1} textAlign="center">
            Inicia sesión con tu usuario y contraseña institucional para acceder al sistema de registro militar.
          </Typography>
          <Typography variant="subtitle2" color="gray" textAlign="center" mb={3}>
            Sistema de Registro Militar — Ministerio de Defensa
          </Typography>

          <Box display="flex" gap={2} mb={3} flexWrap="wrap" justifyContent="center">
            <SocialButton startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="18" />}>Facebook</SocialButton>
            <SocialButton startIcon={<img src="https://www.svgrepo.com/show/13671/youtube.svg" width="18" />}>YouTube</SocialButton>
            <SocialButton startIcon={<img src="https://www.svgrepo.com/show/431991/tiktok.svg" width="18" />}>TikTok</SocialButton>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="filled"
                  margin="normal"
                  size="small"
                  InputProps={{ style: { backgroundColor: '#000', color: '#FAFBFC', borderRadius: 8 } }}
                  InputLabelProps={{ style: { color: '#FAFBFC' } }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  variant="filled"
                  margin="normal"
                  size="small"
                  InputProps={{
                    style: { backgroundColor: '#000', color: '#FAFBFC', borderRadius: 8 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff sx={{ color: '#FAFBFC' }} /> : <Visibility sx={{ color: '#FAFBFC' }} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{ style: { color: '#FAFBFC' } }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#F4511E',
                color: '#fff',
                borderRadius: 9999,
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { backgroundColor: '#e64a19' }
              }}
            >
              Ingresar
            </Button>
          </form>

          <Box mt={6} textAlign="center" fontSize="12px" color="#777">
            <Divider sx={{ backgroundColor: '#333', my: 2 }} />
            <Typography variant="caption" display="block">
              Soporte — Términos de Uso — Política de Privacidad
            </Typography>
            <Typography variant="caption" display="block">
              Desarrollado por <strong>Unidad de Sistemas e Informática Ministerio de Defensa</strong>
            </Typography>
          </Box>
        </Container>
      </LoginBox>
    </Background>
  );
};

export default Login;

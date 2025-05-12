import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Snackbar, Alert, Typography, Grid,
  Paper, Divider 
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

interface ModalConsultaProps {
  open: boolean;
  onClose: () => void;
}

const ModalConsultaPremilitar: React.FC<ModalConsultaProps> = ({ open, onClose }) => {
  const [tipoBusqueda, setTipoBusqueda] = useState<'ci' | 'rude'>('ci');
  const [dato, setDato] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [resultado, setResultado] = useState<any | null>(null);
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!recaptchaToken) {
      setAlertOpen(true);
      return;
    }
    try {
      const res = await axios.post('/api/consulta-premilitar', {
        tipo: tipoBusqueda,
        valor: dato,
        token: recaptchaToken
      });
      setResultado(res.data);
      setErrorConsulta(null);
    } catch (err) {
      setResultado(null);
      setErrorConsulta('No se encontró información con los datos ingresados.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ backgroundColor: '#fff', color: '#333' }}>
        <DialogTitle textAlign="center" sx={{ fontWeight: 'bold', color: '#F4511E' }}>
          Consulta Premilitar
        </DialogTitle>
        <DialogContent>
          <Snackbar open={alertOpen} autoHideDuration={4000} onClose={() => setAlertOpen(false)}>
            <Alert severity="warning">Por favor completa el reCAPTCHA</Alert>
          </Snackbar>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                          Datos personales
                        </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipo de búsqueda"
                size="small"
                value={tipoBusqueda}
                onChange={(e) => setTipoBusqueda(e.target.value as 'ci' | 'rude')}
                SelectProps={{ native: true }}
              >
                <option value="ci">Cédula de Identidad</option>
                <option value="rude">RUDE</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label={tipoBusqueda === 'ci' ? 'Número de CI' : 'Código RUDE'}
                value={dato}
                onChange={(e) => setDato(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <ReCAPTCHA
                sitekey="6LcCiC8rAAAAAEz-52pmoQgeuoJDdKnIK9QikqcV"
                onChange={(value) => setRecaptchaToken(value)}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={onClose}
              sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              sx={{ backgroundColor: '#4CAF50', color: '#fff', '&:hover': { backgroundColor: '#388E3C' } }}
            >
              Consultar
            </Button>
          </DialogActions>
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Resultado de la Consulta
            </Typography>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography><strong>Nombre:</strong> fsdfsd sdfdsd</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography><strong>Colegio:</strong> sdfsdf</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography><strong>Unidad Militar:</strong> sdfsd</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography><strong>Fecha de Presentación:</strong> sdfsdf</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography><strong>Hora de Presentación:</strong> sdfsdfs</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography>
                    <strong>¿Invitado?:</strong>{' '}
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Sí</span>
                    </Typography>
                </Grid>
                </Grid>
            </Paper>
            </Box>
          {resultado && (
            <Box mt={3}>
              <Typography variant="h6" fontWeight="bold">Resultado:</Typography>
              <Typography><strong>Nombre:</strong> {resultado.nombres} {resultado.apellido1} {resultado.apellido2}</Typography>
              <Typography><strong>Colegio:</strong> {resultado.colegio}</Typography>
              <Typography><strong>Unidad Militar:</strong> {resultado.unidad_militar}</Typography>
              <Typography><strong>Fecha de Presentación:</strong> {resultado.fecha_presentacion}</Typography>
              <Typography><strong>Hora de Presentación:</strong> {resultado.hora_presentacion}</Typography>
              <Typography><strong>¿Invitado?:</strong> {resultado.invitado ? 'Sí' : 'No'}</Typography>
            </Box>
          )}

          {errorConsulta && (
            <Alert severity="error" sx={{ mt: 2 }}>{errorConsulta}</Alert>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ModalConsultaPremilitar;

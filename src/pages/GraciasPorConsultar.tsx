import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Carousel from 'react-material-ui-carousel';
import ModalConsultaPremilitar from '../components/ModalConsultaPremilitar';

const slides = [
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/3.jpg',
    title: 'Consulta Informativa',
    subtitle: 'Recibe orientación precisa sobre el proceso pre-militar',
    button: { text: 'Más información', link: 'https://www.mindef.gob.bo' }
  },
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/4.jpg',
    title: 'Convocatoria Premilitar 2025',
    subtitle: 'Consulta requisitos y documentación necesaria',
    button: { text: 'Consultar', link: '/formulario' }
  },
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/5.jpg',
    title: 'Sistema de Consulta Oficial',
    subtitle: 'Transparencia y respuesta institucional garantizada',
    button: { text: 'Ir al sistema', link: '/dashboard' }
  }
];

const GraciasPorConsultar: React.FC = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <Box sx={{ backgroundColor: '#191c1f', color: '#FAFBFC', minHeight: '100vh', pt: 4 }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <img
            src="https://www.mindef.gob.bo/sites/default/files/minlogo.png"
            alt="Ministerio de Defensa"
            style={{ maxWidth: 220, marginBottom: 20 }}
          />
          <Typography variant="h4" fontWeight="bold" color="#F4511E" gutterBottom>
            ¡Gracias por tu consulta, pre-militar!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Tu solicitud fue enviada correctamente. Revisa tu correo o vuelve a consultar más adelante.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#F4511E',
              borderRadius: 9999,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e64a19' }
            }}
          >
            Volver al inicio
          </Button>
        </Box>

        <Carousel
          autoPlay
          animation="fade"
          indicators={false}
          navButtonsAlwaysInvisible
          interval={4000}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                height: { xs: 240, sm: 340 },
                position: 'relative',
                borderRadius: 3,
                mb: 4,
                overflow: 'hidden',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.85))',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {slide.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#F4511E',
                    fontWeight: 'bold',
                    borderRadius: 9999,
                    px: 3,
                    '&:hover': { backgroundColor: '#e64a19' }
                  }}
                  onClick={() => {
                    slide.button.link.startsWith('http')
                      ? window.open(slide.button.link, '_blank')
                      : navigate(slide.button.link);
                  }}
                >
                  {slide.button.text}
                </Button>
              </Box>
            </Box>
          ))}
        </Carousel>
      </Container>

      <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />

      <Box
        sx={{
          backgroundColor: '#F4511E',
          color: '#fff',
          py: { xs: 4, sm: 5 },
          px: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Realiza una nueva consulta
        </Typography>
        <Typography variant="h6" gutterBottom>
          Estamos aquí para orientarte en tu proceso premilitar
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{
            mt: 3,
            backgroundColor: '#fff',
            color: '#F4511E',
            borderRadius: 9999,
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': { backgroundColor: '#eee' }
          }}
        >
          Nueva consulta →
        </Button>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Video Institucional
          </Typography>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%',
              borderRadius: 3,
              overflow: 'hidden',
              mb: 5
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/XdTT8zH-Wdg"
              title="Video institucional"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        </Box>
      </Container>

      <Box
        sx={{
          position: 'fixed',
          top: '35%',
          right: 10,
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          gap: 1,
          zIndex: 1000
        }}
      >
        <IconButton
          href="https://www.facebook.com/mindefbolivia"
          target="_blank"
          sx={{ backgroundColor: '#1877f2', color: '#fff', '&:hover': { backgroundColor: '#145dbf' } }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          href="https://www.youtube.com/@MindefBolivia"
          target="_blank"
          sx={{ backgroundColor: '#ff0000', color: '#fff', '&:hover': { backgroundColor: '#cc0000' } }}
        >
          <YouTubeIcon />
        </IconButton>
        <IconButton
          href="https://www.tiktok.com/@mindefbolivia"
          target="_blank"
          sx={{ backgroundColor: '#00f2ea', color: '#000', '&:hover': { backgroundColor: '#00c9c2' } }}
        >
          <SportsEsportsIcon />
        </IconButton>
      </Box>

      <Box sx={{ py: 3, textAlign: 'center', backgroundColor: '#0f0f0f' }}>
        <img
          src="https://www.mindef.gob.bo/sites/default/files/minlogo.png"
          alt="Logo institucional"
          style={{ maxWidth: 160, opacity: 0.6 }}
        />
        <Typography variant="caption" color="gray" display="block" mt={1}>
          © 2025 Ministerio de Defensa - Todos los derechos reservados
        </Typography>
      </Box>

      <ModalConsultaPremilitar open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default GraciasPorConsultar;

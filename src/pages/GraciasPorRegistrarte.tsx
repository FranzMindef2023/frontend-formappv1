import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Carousel from 'react-material-ui-carousel';
import ModalPreRegistro from '../components/ModalPreRegistro';
import TikTokIcon from '../components/icons/TikTokIcon';
import Headerweb from '../components/Headerweb';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getImageBase64FromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const generarPDF = async (): Promise<void> => {
  const logoBase64 = await getImageBase64FromUrl('/siremil/minlogo.png');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Logo
  doc.addImage(logoBase64, 'PNG', 10, 8, 70, 0);

  // Título principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REQUISITOS Y BENEFICIOS DEL SERVICIO MILITAR', 14, 40);

  // Línea divisoria
  doc.setDrawColor(150);
  doc.line(14, 42, 196, 42);

  // Requisitos
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('REQUISITOS:', 14, 50);
  doc.setFont('helvetica', 'normal');
  autoTable(doc, {
    startY: 55,
    body: [
      ['• Tener entre 18 y 22 años'],
      ['• Presentar cédula de identidad vigente'],
      ['• Certificado de nacimiento original'],
      ['• No tener antecedentes penales'],
      ['• Aprobar revisión médica'],
      ['• Número de cuenta bancaria en el Banco Unión'],
      ['• Certificado de grupo sanguíneo'],
    ],
    styles: { fontSize: 12, textColor: [30, 30, 30], cellPadding: 2 },
    theme: 'plain',
    margin: { left: 20 },
  });

  // Beneficios
  const yAfterRequisitos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('BENEFICIOS:', 14, yAfterRequisitos);
  doc.setFont('helvetica', 'normal');
  autoTable(doc, {
    startY: yAfterRequisitos + 5,
    body: [
      ['• Permiso especial de 10 días'],
      ['• Acceso a capacitación e instrucción de materias técnicas (Carpintería, Mecánica, Gastronomía, Inglés, Taekwondo, Jiu Jitsu y otros)'],
      ['• Acceso a becas a institutos militares'],
    ],
    styles: { fontSize: 12, textColor: [30, 30, 30], cellPadding: 2 },
    theme: 'plain',
    margin: { left: 20 },
  });

  // PIE DE PÁGINA CENTRADO
const pageHeight = doc.internal.pageSize.getHeight();
doc.setFontSize(10);
doc.setTextColor(100);
doc.text(
  'Ministerio de Defensa del Estado Plurinacional de Bolivia · www.mindef.gob.bo',
  doc.internal.pageSize.getWidth() / 2,
  pageHeight - 10,
  { align: 'center' }
);

  doc.save('Requisitos_Beneficios_Servicio_Militar.pdf');
};

const slides = [
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/3.jpg',
    title: 'Curso Virtual Pre-Militar',
    subtitle: 'Prepárate con los mejores contenidos oficiales',
    button: { text: 'Ver más', link: 'https://www.mindef.gob.bo' }
  },
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/4.jpg',
    title: 'Convocatoria Abierta 2025',
    subtitle: 'Participa del proceso de preinscripción nacional',
    button: { text: 'Inscribirse ahora', link: '/formulario' }
  },
  {
    image: 'https://www.mindef.gob.bo/sites/default/files/styles/flexslider_full/public/5.jpg',
    title: 'Sistema de Registro Oficial',
    subtitle: 'Seguridad, transparencia y control del proceso',
    button: { text: 'Ir al sistema', link: '/dashboard' }
  }
];

const GraciasPorRegistrarte: React.FC = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  return (
    <Box sx={{ backgroundColor: '#191c1f', color: '#FAFBFC', minHeight: '100vh', pt: 4 }}>
      <Headerweb onToggleSidebar={handleToggleSidebar} />

      <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />
       <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />
       <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />

      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="#F4511E" gutterBottom>
            ¡Inscríbete al Servicio Militar y forma parte del cambio!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Demuestra tu compromiso, tu fuerza y tu amor por Bolivia. El Servicio Militar no es solo una obligación, es una oportunidad de crecer, servir y dejar huella en la historia.
            <br /><br />
            ⚔️ <strong>Desarrolla disciplina, liderazgo y orgullo patriótico</strong><br />
            🇧🇴  <strong>Forma parte de la nueva generación que defiende la nación</strong><br />
            🌟 <strong>Vive una experiencia única, transformadora y honorable</strong>
          </Typography>
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              onClick={generarPDF}
              startIcon={<PictureAsPdfIcon />}
              color="success"
            >
              Descargar Requisitos y Beneficios (PDF)
            </Button>
          </Box>
        </Box>

        <Carousel autoPlay animation="fade" indicators={false} navButtonsAlwaysInvisible interval={4000}>
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{ height: { xs: 240, sm: 340 }, position: 'relative', borderRadius: 3, mb: 4, overflow: 'hidden', backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <Box
                sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3 }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>{slide.title}</Typography>
                <Typography variant="body1" gutterBottom>{slide.subtitle}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  sx={{ alignSelf: 'flex-start', fontWeight: 'bold', borderRadius: 9999, px: 3, '&:hover': {
                backgroundColor: '#2e7d32',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.3)'
              } }}
                  onClick={() => slide.button.link.startsWith('http') ? window.open(slide.button.link, '_blank') : navigate(slide.button.link)}
                >
                  {slide.button.text}
                </Button>
              </Box>
            </Box>
          ))}
        </Carousel>
      </Container>

      <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />

      {/* Cinta promocional */}
      <Box sx={{ backgroundColor: '#2E4A2C', color: '#fff', py: { xs: 5, sm: 6 }, px: 2, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ¡Forma parte del honor de servir a Bolivia!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Participa del proceso de pre registro del Servicio Militar Obligatorio. Prepárate en disciplina, liderazgo y compromiso con la patria.
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{ mt: 3, backgroundColor: '#f5f5f5', color: '#1b2d1c', borderRadius: 9999, fontWeight: 'bold', px: 4, py: 1.5, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', '&:hover': { backgroundColor: '#eeeeee' } }}
          startIcon={<TouchAppIcon />}
        >
          Preinscribirme al Servicio Militar →
        </Button>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Video Institucional
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
            Descubre cómo el Servicio Militar transforma vidas. ¡Mira nuestro video institucional!
          </Typography>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 3, overflow: 'hidden', mb: 5 }}>
            <iframe
              src="https://www.youtube.com/embed/JBxKJDUnkHQ"
              title="Video institucional"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </Box>
        </Box>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenModal(true)}
            sx={{ borderRadius: 9999, fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            ¡Estoy listo para preinscribirme!
          </Button>
        </Box>
        <Box sx={{ height: { xs: 24, sm: 32, md: 48 } }} />
      </Container>

      {/* Redes sociales */}
      <Box sx={{ position: 'fixed', top: '35%', right: 10, display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 1, zIndex: 1000 }}>
        <Tooltip title="Facebook"><IconButton href="https://www.facebook.com/mindefbolivia" target="_blank" sx={{ backgroundColor: '#1877f2', color: '#fff', '&:hover': { backgroundColor: '#145dbf' } }}><FacebookIcon /></IconButton></Tooltip>
        <Tooltip title="YouTube"><IconButton href="https://www.youtube.com/@MindefBolivia" target="_blank" sx={{ backgroundColor: '#ff0000', color: '#fff', '&:hover': { backgroundColor: '#cc0000' } }}><YouTubeIcon /></IconButton></Tooltip>
        <Tooltip title="TikTok"><IconButton href="https://www.tiktok.com/@mindefbolivia" target="_blank" sx={{ backgroundColor: '#00f2ea', color: '#000', '&:hover': { backgroundColor: '#00c9c2' } }}><TikTokIcon /></IconButton></Tooltip>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', backgroundColor: '#0f0f0f' }}>
        <img src="/siremil/minlogo.png" alt="Logo institucional" style={{ maxWidth: 160, opacity: 0.6 }} />
        <Typography variant="caption" color="gray" display="block" mt={1}>
          © 2025 Ministerio de Defensa - Todos los derechos reservados
        </Typography>
      </Box>

      <ModalPreRegistro open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default GraciasPorRegistrarte;
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import waterfilter from '../assets/images/filter.jpg';

const products = [
  {
    id: 1,
    title: 'Smart Watch',
    description: 'NoiseFit Ultra Smartwatch',
    price: '₹3,499',
    originalPrice: '₹5,999',
    discount: '42% OFF',
    image: waterfilter,
  },
  {
    id: 2,
    title: 'Wireless Headphones',
    description: 'boAt Rockerz 450 Pro',
    price: '₹2,199',
    originalPrice: '₹3,999',
    discount: '45% OFF',
    image: waterfilter,
  },
  {
    id: 3,
    title: 'Smartphone',
    description: 'Redmi Note 13 5G',
    price: '₹25,999',
    originalPrice: '₹29,999',
    discount: '13% OFF',
    image: waterfilter,
  },
  {
    id: 4,
    title: 'Gaming Console',
    description: 'Sony PlayStation 5',
    price: '₹44,999',
    originalPrice: '₹49,999',
    discount: '10% OFF',
    image: waterfilter,
  },
  {
    id: 5,
    title: 'Laptop',
    description: 'HP Pavilion x360',
    price: '₹58,750',
    originalPrice: '₹69,999',
    discount: '16% OFF',
    image: waterfilter,
  },
  {
    id: 6,
    title: 'Camera',
    description: 'Canon EOS 200D II',
    price: '₹19,800',
    originalPrice: '₹26,999',
    discount: '27% OFF',
    image: waterfilter,
  },
];

export default function Products() {
  return (
    <Box sx={{ px: 2, py: 4, width: '100%', maxWidth: '100vw' }}>
      <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold">
        Explore Our Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  transform: 'translateY(-5px)',
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  overflow: 'hidden',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={`${product.title} - ${product.description}`}
                  sx={{
                    height: 250,
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Box>
              <CardContent sx={{ p: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  noWrap
                  title={product.title}
                >
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.8rem', mb: 0.5 }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: 'line-through',
                      fontSize: '0.75rem',
                    }}
                  >
                    {product.originalPrice}
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="bold">
                    {product.discount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

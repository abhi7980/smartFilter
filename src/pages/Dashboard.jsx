import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import BarChartComponent from '../components/grapsh/Graph';
import { getProducts, getUsers } from '../networkHandler/services';

// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: '12px',
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

export default function Dashboard() {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [activeFilters, setActiveFilters] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async () => {
    try {
      const response1 = await getProducts();
      const response2 = await getUsers();
      
      console.log(response1.data.filter((item)=>(item.status === true)), "response");
      setTotalProduct(response1.totalCount || 0);
      setTotalCustomer(response2.data.filter((item,id)=>
       ( item.role === "CUSTOMER")
      ).length || 0); // Adjust as per your API
      setActiveFilters(response1.data.filter((item)=>(item.status === true)).length || 0);   // Adjust as per your API
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant='h4'>Master Dashboard</Typography>
      <Grid container fullWidth spacing={8} py={4}>
        {/* Left Column - Vertical Cards */}
        <Grid item xs={12} md={4} width={"20%"} height={"65vh"}>
          <Grid container direction="column" spacing={3} py={4}>
            <Grid item>
              <StatCard>
                <CardContent>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ opacity: 0.9, fontWeight: 500 }}
                  >
                    Total Products
                  </Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {totalProduct}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item>
              <StatCard>
                <CardContent>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ opacity: 0.9, fontWeight: 500 }}
                  >
                    Total Customers
                  </Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {totalCustomer}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item>
              <StatCard>
                <CardContent>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ opacity: 0.9, fontWeight: 500 }}
                  >
                    Active Filters
                  </Typography>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {activeFilters}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Chart */}
        <Grid item xs={12} md={8} width={"70%"} height={"65vh"}>
          <Box py={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              Monthly Sales Performance
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 10 }}
            >
              Last 12 months revenue data
            </Typography>
            <Box
              width="100%"
              height={isMobile ? 250 : 350}
              sx={{ borderRadius: 2, overflow: 'hidden' }}
            >
              <BarChartComponent />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const SystemMetrics = () => {
  // Mock data for system metrics
  const systemStats = {
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 57,
    networkUsage: 35,
    uptime: '15 days, 7 hours',
    apiRequests: '1.2M/day'
  };

  const serviceStatus = [
    { id: 1, name: 'Face Detection API', status: 'Healthy', uptime: '99.98%', lastIncident: 'None' },
    { id: 2, name: 'User Authentication', status: 'Healthy', uptime: '99.99%', lastIncident: 'None' },
    { id: 3, name: 'Database Service', status: 'Healthy', uptime: '99.95%', lastIncident: '2023-03-10' },
    { id: 4, name: 'ML Model Service', status: 'Degraded', uptime: '98.76%', lastIncident: '2023-03-17' },
    { id: 5, name: 'Analytics Pipeline', status: 'Healthy', uptime: '99.92%', lastIncident: '2023-03-05' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Metrics
      </Typography>

      <Grid container spacing={3}>
        {/* System Resources */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              System Resources
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      CPU Usage
                    </Typography>
                    <LinearProgress variant="determinate" value={systemStats.cpuUsage} sx={{ my: 1 }} />
                    <Typography variant="h5">{systemStats.cpuUsage}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Memory Usage
                    </Typography>
                    <LinearProgress variant="determinate" value={systemStats.memoryUsage} sx={{ my: 1 }} />
                    <Typography variant="h5">{systemStats.memoryUsage}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Disk Usage
                    </Typography>
                    <LinearProgress variant="determinate" value={systemStats.diskUsage} sx={{ my: 1 }} />
                    <Typography variant="h5">{systemStats.diskUsage}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Network Usage
                    </Typography>
                    <LinearProgress variant="determinate" value={systemStats.networkUsage} sx={{ my: 1 }} />
                    <Typography variant="h5">{systemStats.networkUsage}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* General Stats */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              General Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>System Uptime:</strong> {systemStats.uptime}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>API Requests:</strong> {systemStats.apiRequests}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Average Response Time:</strong> 235ms
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Error Rate:</strong> 0.12%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Data Processing */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              AI Processing Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Daily Processed Images:</strong> 8,542
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Avg. Processing Time:</strong> 1.2s
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Model Accuracy:</strong> 98.7%
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Failed Analyses:</strong> 17 (0.2%)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Service Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Service Status
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Uptime</TableCell>
                    <TableCell>Last Incident</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceStatus.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.status}</TableCell>
                      <TableCell>{service.uptime}</TableCell>
                      <TableCell>{service.lastIncident}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SystemMetrics; 
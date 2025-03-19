import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const UserMetrics = () => {
  // Mock data for user metrics
  const userStats = {
    totalUsers: 1243,
    newUsers: 87,
    activeUsers: 632,
    churnRate: '2.3%'
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', registered: '2023-03-15', lastActive: '2023-03-18' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', registered: '2023-03-14', lastActive: '2023-03-18' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', registered: '2023-03-10', lastActive: '2023-03-17' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', registered: '2023-03-08', lastActive: '2023-03-18' },
    { id: 5, name: 'David Brown', email: 'david@example.com', registered: '2023-03-05', lastActive: '2023-03-16' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Metrics
      </Typography>

      <Grid container spacing={3}>
        {/* User Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h5">{userStats.totalUsers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      New Users (Last 7 days)
                    </Typography>
                    <Typography variant="h5">{userStats.newUsers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Users
                    </Typography>
                    <Typography variant="h5">{userStats.activeUsers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Churn Rate
                    </Typography>
                    <Typography variant="h5">{userStats.churnRate}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Last Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.registered}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
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

export default UserMetrics; 
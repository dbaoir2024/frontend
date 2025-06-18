// Enhanced React component for Union Trend Analytics Dashboard
// src/components/analytics/UnionTrendDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { fetchOrganizationTrends } from '../../features/analytics/trendsSlice';
import { RootState } from '../../app/store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const UnionTrendDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { organizationsByYear, employmentTrends, loading } = useSelector((state: RootState) => state.trends);
  
  const [startYear, setStartYear] = useState<number>(1963);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [timeRange, setTimeRange] = useState<string>('all');
  
  useEffect(() => {
    dispatch(fetchOrganizationTrends({ startYear, endYear }));
  }, [dispatch, startYear, endYear]);

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const range = event.target.value as string;
    setTimeRange(range);
    
    const currentYear = new Date().getFullYear();
    
    switch (range) {
      case 'all':
        setStartYear(1963);
        setEndYear(currentYear);
        break;
      case 'last10':
        setStartYear(currentYear - 10);
        setEndYear(currentYear);
        break;
      case 'last20':
        setStartYear(currentYear - 20);
        setEndYear(currentYear);
        break;
      case 'last30':
        setStartYear(currentYear - 30);
        setEndYear(currentYear);
        break;
      case 'custom':
        // Keep current values for custom range
        break;
    }
  };

  const handleStartYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStartYear(event.target.value as number);
    setTimeRange('custom');
  };

  const handleEndYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEndYear(event.target.value as number);
    setTimeRange('custom');
  };

  // Generate year options from 1963 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 1963; year <= currentYear; year++) {
    yearOptions.push(year);
  }

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    if (!organizationsByYear || organizationsByYear.length === 0) {
      return {
        totalRegistered: 0,
        currentlyActive: 0,
        totalDeregistered: 0,
        growthRate: 0
      };
    }

    const totalRegistered = organizationsByYear.reduce((sum, item) => sum + item.newRegistrations, 0);
    const currentlyActive = organizationsByYear[organizationsByYear.length - 1]?.activeOrganizations || 0;
    const totalDeregistered = organizationsByYear.reduce((sum, item) => sum + item.deregisteredOrganizations, 0);
    
    // Calculate growth rate over the selected period
    const firstYearActive = organizationsByYear[0]?.activeOrganizations || 0;
    const lastYearActive = currentlyActive;
    const growthRate = firstYearActive > 0 
      ? ((lastYearActive - firstYearActive) / firstYearActive) * 100 
      : 0;
    
    return {
      totalRegistered,
      currentlyActive,
      totalDeregistered,
      growthRate
    };
  };

  const summaryStats = calculateSummaryStats();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Union Growth Trends (1963-{currentYear})
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Historical analysis of union registration, growth, and deregistration trends.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Time Range"
            >
              <MenuItem value="all">All Time (1963-Present)</MenuItem>
              <MenuItem value="last10">Last 10 Years</MenuItem>
              <MenuItem value="last20">Last 20 Years</MenuItem>
              <MenuItem value="last30">Last 30 Years</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled={timeRange !== 'custom'}>
            <InputLabel>Start Year</InputLabel>
            <Select
              value={startYear}
              onChange={handleStartYearChange}
              label="Start Year"
            >
              {yearOptions.map(year => (
                <MenuItem key={`start-${year}`} value={year} disabled={year > endYear}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth disabled={timeRange !== 'custom'}>
            <InputLabel>End Year</InputLabel>
            <Select
              value={endYear}
              onChange={handleEndYearChange}
              label="End Year"
            >
              {yearOptions.map(year => (
                <MenuItem key={`end-${year}`} value={year} disabled={year < startYear}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Registered Unions
                  </Typography>
                  <Typography variant="h4">
                    {summaryStats.totalRegistered}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Since 1963
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Currently Active Unions
                  </Typography>
                  <Typography variant="h4">
                    {summaryStats.currentlyActive}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    As of {currentYear}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Deregistered
                  </Typography>
                  <Typography variant="h4">
                    {summaryStats.totalDeregistered}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Since 1963
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Growth Rate
                  </Typography>
                  <Typography variant="h4" color={summaryStats.growthRate >= 0 ? 'success.main' : 'error.main'}>
                    {summaryStats.growthRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Over selected period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Union Growth Trend Line Chart */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Union Growth Trend ({startYear}-{endYear})
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={organizationsByYear}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="activeOrganizations" 
                  name="Active Unions" 
                  stroke="#0088FE" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="newRegistrations" 
                  name="New Registrations" 
                  stroke="#00C49F" 
                />
                <Line 
                  type="monotone" 
                  dataKey="deregisteredOrganizations" 
                  name="Deregistered" 
                  stroke="#FF8042" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
          
          {/* Registration vs. Deregistration Bar Chart */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  New Registrations vs. Deregistrations
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={organizationsByYear.slice(-10)} // Show last 10 years
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newRegistrations" name="New Registrations" fill="#00C49F" />
                    <Bar dataKey="deregisteredOrganizations" name="Deregistered" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Employment Trends */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Union Membership Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={employmentTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recordDate" tickFormatter={(date) => new Date(date).getFullYear().toString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="totalUnionMembers" 
                      name="Total Union Members" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Active vs. Inactive Distribution */}
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Union Status Distribution
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="80%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Active', value: summaryStats.currentlyActive },
                          { name: 'Deregistered', value: summaryStats.totalDeregistered }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Active', value: summaryStats.currentlyActive },
                          { name: 'Deregistered', value: summaryStats.totalDeregistered }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} unions`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Historical Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  The data shows that union registration in Papua New Guinea has experienced significant changes since 1963.
                </Typography>
                <Typography variant="body2" paragraph>
                  {summaryStats.growthRate >= 0 ? (
                    `There has been a ${summaryStats.growthRate.toFixed(1)}% growth in active unions over the selected period, indicating a strengthening labor movement.`
                  ) : (
                    `There has been a ${Math.abs(summaryStats.growthRate).toFixed(1)}% decline in active unions over the selected period, indicating challenges in the labor movement.`
                  )}
                </Typography>
                <Typography variant="body2">
                  The Office of the Industrial Registrar has processed a total of {summaryStats.totalRegistered} union registrations since records began, with {summaryStats.currentlyActive} currently active organizations.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default UnionTrendDashboard;

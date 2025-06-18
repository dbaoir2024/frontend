// Enhanced React component for Reports and Analytics
// src/components/reports/ReportsDashboard.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers';
import { Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ReportsDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState<string>('summary');
  const [yearFilter, setYearFilter] = useState<string>('2025');
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  
  // Mock data for demonstration
  const unionStatusData = [
    { name: 'Active', value: 65 },
    { name: 'Inactive', value: 20 },
    { name: 'Deregistered', value: 15 }
  ];
  
  const unionGrowthData = [
    { year: '1970', unions: 5 },
    { year: '1975', unions: 12 },
    { year: '1980', unions: 18 },
    { year: '1985', unions: 25 },
    { year: '1990', unions: 32 },
    { year: '1995', unions: 40 },
    { year: '2000', unions: 52 },
    { year: '2005', unions: 68 },
    { year: '2010', unions: 82 },
    { year: '2015', unions: 90 },
    { year: '2020', unions: 95 },
    { year: '2025', unions: 100 }
  ];
  
  const sectorDistributionData = [
    { name: 'Education', value: 25 },
    { name: 'Mining', value: 20 },
    { name: 'Public Service', value: 18 },
    { name: 'Maritime', value: 12 },
    { name: 'Healthcare', value: 10 },
    { name: 'Manufacturing', value: 8 },
    { name: 'Agriculture', value: 7 }
  ];
  
  const complianceData = [
    { name: 'Compliant', value: 72 },
    { name: 'Non-Compliant', value: 28 }
  ];
  
  const inspectionStatusData = [
    { name: 'Completed', value: 45 },
    { name: 'Pending', value: 30 },
    { name: 'Due', value: 15 },
    { name: 'Overdue', value: 10 }
  ];
  
  const noticeToShowCauseData = [
    { name: 'Resolved', value: 65 },
    { name: 'Pending Response', value: 25 },
    { name: 'Escalated', value: 10 }
  ];
  
  const awardStatusData = [
    { name: 'Active', value: 70 },
    { name: 'Expiring Soon', value: 15 },
    { name: 'Expired', value: 15 }
  ];
  
  const awardCategoryData = [
    { name: 'Consented Awards', value: 45 },
    { name: 'Arbitrated Awards', value: 35 },
    { name: 'Consolidated Awards', value: 20 }
  ];
  
  const determinationCategoryData = [
    { name: 'Public Service', value: 50 },
    { name: 'Teaching Service', value: 30 },
    { name: 'Minimum Wages Board', value: 20 }
  ];
  
  const monthlyElectionData = [
    { month: 'Jan', completed: 3, pending: 2, cancelled: 0 },
    { month: 'Feb', completed: 4, pending: 1, cancelled: 1 },
    { month: 'Mar', completed: 5, pending: 3, cancelled: 0 },
    { month: 'Apr', completed: 2, pending: 4, cancelled: 1 },
    { month: 'May', completed: 6, pending: 2, cancelled: 0 },
    { month: 'Jun', completed: 4, pending: 3, cancelled: 1 },
    { month: 'Jul', completed: 5, pending: 2, cancelled: 0 },
    { month: 'Aug', completed: 3, pending: 4, cancelled: 2 },
    { month: 'Sep', completed: 7, pending: 1, cancelled: 0 },
    { month: 'Oct', completed: 4, pending: 3, cancelled: 1 },
    { month: 'Nov', completed: 5, pending: 2, cancelled: 0 },
    { month: 'Dec', completed: 2, pending: 5, cancelled: 0 }
  ];
  
  const unionLifeExpectancyData = [
    { range: '0-5 years', count: 15 },
    { range: '6-10 years', count: 20 },
    { range: '11-15 years', count: 25 },
    { range: '16-20 years', count: 18 },
    { range: '21-30 years', count: 12 },
    { range: '31+ years', count: 10 }
  ];
  
  const membershipSizeData = [
    { name: 'PNG Teachers Association', members: 25000 },
    { name: 'Public Employees Association', members: 18000 },
    { name: 'Maritime Workers Union', members: 12000 },
    { name: 'Mining & Petroleum Workers', members: 10000 },
    { name: 'Healthcare Workers Union', members: 8500 },
    { name: 'Banking Employees Union', members: 5000 },
    { name: 'University Staff Association', members: 3500 },
    { name: 'Airline Workers Union', members: 3000 },
    { name: 'Retail Workers Union', members: 2800 },
    { name: 'Construction Workers Union', members: 2500 }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleReportTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setReportType(event.target.value as string);
  };
  
  const handleYearFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYearFilter(event.target.value as string);
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Reports & Analytics</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
          >
            Print Report
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Export Data
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reports tabs">
          <Tab label="Union Statistics" />
          <Tab label="Compliance & Inspections" />
          <Tab label="Awards & Determinations" />
          <Tab label="Elections" />
          <Tab label="Custom Reports" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={handleReportTypeChange}
                label="Report Type"
              >
                <MenuItem value="summary">Summary Dashboard</MenuItem>
                <MenuItem value="detailed">Detailed Analysis</MenuItem>
                <MenuItem value="trends">Trend Analysis</MenuItem>
                <MenuItem value="comparative">Comparative Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                onChange={handleYearFilterChange}
                label="Year"
              >
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="all">All Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="From Date"
              value={dateRangeStart}
              onChange={(date) => setDateRangeStart(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="To Date"
              value={dateRangeEnd}
              onChange={(date) => setDateRangeEnd(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small'
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Status Distribution</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={unionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {unionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Growth (1970-2025)</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={unionGrowthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="unions" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Distribution by Economic Sector</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sectorDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Membership Size</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={membershipSizeData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="members" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Life Expectancy</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={unionLifeExpectancyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Union Compliance Status</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complianceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Inspection Status</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inspectionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inspectionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Notice To Show Cause Status</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={noticeToShowCauseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Top Non-Compliance Issues</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Issue</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Failure to submit annual returns</TableCell>
                        <TableCell align="right">42</TableCell>
                        <TableCell align="right">35%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Outdated constitution</TableCell>
                        <TableCell align="right">28</TableCell>
                        <TableCell align="right">23%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Improper financial records</TableCell>
                        <TableCell align="right">22</TableCell>
                        <TableCell align="right">18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Failure to hold elections</TableCell>
                        <TableCell align="right">15</TableCell>
                        <TableCell align="right">12%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Membership list discrepancies</TableCell>
                        <TableCell align="right">10</TableCell>
                        <TableCell align="right">8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other issues</TableCell>
                        <TableCell align="right">5</TableCell>
                        <TableCell align="right">4%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Award Status</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={awardStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Award Categories</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={awardCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Determination Categories</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={determinationCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Upcoming Award Expirations</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Award Number</TableCell>
                        <TableCell>Award Title</TableCell>
                        <TableCell>Expiration Date</TableCell>
                        <TableCell>Days Remaining</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>A-15</TableCell>
                        <TableCell>Banking Industry Award</TableCell>
                        <TableCell>2025-07-15</TableCell>
                        <TableCell>45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A-22</TableCell>
                        <TableCell>Retail Industry Award</TableCell>
                        <TableCell>2025-08-10</TableCell>
                        <TableCell>71</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A-08</TableCell>
                        <TableCell>Healthcare Workers Award</TableCell>
                        <TableCell>2025-08-22</TableCell>
                        <TableCell>83</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A-31</TableCell>
                        <TableCell>Construction Industry Award</TableCell>
                        <TableCell>2025-09-05</TableCell>
                        <TableCell>97</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>A-17</TableCell>
                        <TableCell>Hospitality Industry Award</TableCell>
                        <TableCell>2025-09-30</TableCell>
                        <TableCell>122</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Election Activity (2025)</Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyElectionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#00C49F" name="Completed" />
                      <Bar dataKey="pending" stackId="a" fill="#FFBB28" name="Pending" />
                      <Bar dataKey="cancelled" stackId="a" fill="#FF8042" name="Cancelled" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Election Supervision Statistics</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Statistic</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total elections supervised (2025)</TableCell>
                        <TableCell align="right">50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elections completed successfully</TableCell>
                        <TableCell align="right">38</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elections currently pending</TableCell>
                        <TableCell align="right">8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elections cancelled</TableCell>
                        <TableCell align="right">4</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average voter turnout</TableCell>
                        <TableCell align="right">68%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elections with quorum issues</TableCell>
                        <TableCell align="right">7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Elections with nomination challenges</TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Upcoming Elections</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Union</TableCell>
                        <TableCell>Election Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assigned Inspector</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>PNG Banking Employees Union</TableCell>
                        <TableCell>2025-06-15</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>John Smith</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>National Academic Staff Association</TableCell>
                        <TableCell>2025-06-22</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>Mary Johnson</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PNG Nurses Association</TableCell>
                        <TableCell>2025-07-05</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>Peter Williams</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Correctional Services Union</TableCell>
                        <TableCell>2025-07-18</TableCell>
                        <TableCell>Pending</TableCell>
                        <TableCell>Sarah Brown</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PNG Energy Workers Union</TableCell>
                        <TableCell>2025-08-02</TableCell>
                        <TableCell>Scheduled</TableCell>
                        <TableCell>Not assigned</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Custom Report Builder</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Use the options below to build a custom report with the specific data you need.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Report Category</InputLabel>
                      <Select
                        label="Report Category"
                        defaultValue="unions"
                      >
                        <MenuItem value="unions">Unions</MenuItem>
                        <MenuItem value="awards">Awards</MenuItem>
                        <MenuItem value="determinations">Determinations</MenuItem>
                        <MenuItem value="elections">Elections</MenuItem>
                        <MenuItem value="inspections">Inspections</MenuItem>
                        <MenuItem value="compliance">Compliance</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Report Format</InputLabel>
                      <Select
                        label="Report Format"
                        defaultValue="table"
                      >
                        <MenuItem value="table">Table</MenuItem>
                        <MenuItem value="chart">Chart</MenuItem>
                        <MenuItem value="summary">Summary</MenuItem>
                        <MenuItem value="detailed">Detailed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Export Format</InputLabel>
                      <Select
                        label="Export Format"
                        defaultValue="pdf"
                      >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="excel">Excel</MenuItem>
                        <MenuItem value="csv">CSV</MenuItem>
                        <MenuItem value="word">Word</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Select Fields to Include</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <FormControl component="fieldset">
                          <Typography variant="subtitle2">Basic Information</Typography>
                          <div>
                            <input type="checkbox" id="field-name" defaultChecked />
                            <label htmlFor="field-name"> Name</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-number" defaultChecked />
                            <label htmlFor="field-number"> Registration Number</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-date" defaultChecked />
                            <label htmlFor="field-date"> Registration Date</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-status" defaultChecked />
                            <label htmlFor="field-status"> Status</label>
                          </div>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <FormControl component="fieldset">
                          <Typography variant="subtitle2">Contact Information</Typography>
                          <div>
                            <input type="checkbox" id="field-address" />
                            <label htmlFor="field-address"> Address</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-phone" />
                            <label htmlFor="field-phone"> Phone</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-email" />
                            <label htmlFor="field-email"> Email</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-contact" />
                            <label htmlFor="field-contact"> Contact Person</label>
                          </div>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <FormControl component="fieldset">
                          <Typography variant="subtitle2">Membership</Typography>
                          <div>
                            <input type="checkbox" id="field-members" />
                            <label htmlFor="field-members"> Member Count</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-sector" />
                            <label htmlFor="field-sector"> Economic Sector</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-growth" />
                            <label htmlFor="field-growth"> Growth Rate</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-demographics" />
                            <label htmlFor="field-demographics"> Demographics</label>
                          </div>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <FormControl component="fieldset">
                          <Typography variant="subtitle2">Compliance</Typography>
                          <div>
                            <input type="checkbox" id="field-compliance" />
                            <label htmlFor="field-compliance"> Compliance Status</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-inspections" />
                            <label htmlFor="field-inspections"> Inspection History</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-notices" />
                            <label htmlFor="field-notices"> Notices Issued</label>
                          </div>
                          <div>
                            <input type="checkbox" id="field-violations" />
                            <label htmlFor="field-violations"> Violations</label>
                          </div>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button variant="outlined" sx={{ mr: 1 }}>
                        Reset
                      </Button>
                      <Button variant="contained" color="primary">
                        Generate Report
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default ReportsDashboard;

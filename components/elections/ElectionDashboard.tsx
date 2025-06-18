// Enhanced React component for Union Election Management
// src/components/elections/ElectionDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  TextField,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { fetchElectionData } from '../../features/elections/electionsSlice';
import { RootState } from '../../app/store';

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

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
      id={`election-tabpanel-${index}`}
      aria-labelledby={`election-tab-${index}`}
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

const ElectionDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { electionData, loading } = useSelector((state: RootState) => state.elections);
  
  const [tabValue, setTabValue] = useState(0);
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Voter eligibility calculator state
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [presentVoters, setPresentVoters] = useState<number>(0);
  const [requiredPercentage, setRequiredPercentage] = useState<number>(50);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  
  useEffect(() => {
    dispatch(fetchElectionData({ year: yearFilter, status: statusFilter }));
  }, [dispatch, yearFilter, statusFilter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleYearFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYearFilter(event.target.value as number);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  const calculateVoterEligibility = () => {
    setCalculationPerformed(true);
  };

  // Generate year options from 5 years ago to 5 years ahead
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    yearOptions.push(year);
  }

  // Calculate election statistics
  const calculateElectionStats = () => {
    if (!electionData || !electionData.elections) {
      return {
        completed: 0,
        pending: 0,
        cancelled: 0,
        total: 0
      };
    }

    const completed = electionData.elections.filter(e => e.status === 'completed').length;
    const pending = electionData.elections.filter(e => e.status === 'pending').length;
    const cancelled = electionData.elections.filter(e => e.status === 'cancelled').length;
    
    return {
      completed,
      pending,
      cancelled,
      total: completed + pending + cancelled
    };
  };

  const electionStats = calculateElectionStats();

  // Prepare data for pie chart
  const electionStatusData = [
    { name: 'Completed', value: electionStats.completed, color: '#00C49F' },
    { name: 'Pending', value: electionStats.pending, color: '#0088FE' },
    { name: 'Cancelled', value: electionStats.cancelled, color: '#FF8042' }
  ];

  // Calculate voter turnout percentage
  const voterTurnoutPercentage = totalMembers > 0 
    ? (presentVoters / totalMembers) * 100 
    : 0;
  
  // Determine if quorum is met
  const isQuorumMet = voterTurnoutPercentage >= requiredPercentage;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Union Election Management
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Monitor and manage union elections, nominations, and voter eligibility.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="election management tabs">
          <Tab label="Election Dashboard" />
          <Tab label="Nomination Vetting" />
          <Tab label="Voter Eligibility Calculator" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                onChange={handleYearFilterChange}
                label="Year"
              >
                {yearOptions.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
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
                      Total Elections
                    </Typography>
                    <Typography variant="h4">
                      {electionStats.total}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {statusFilter === 'all' ? `In ${yearFilter}` : `${statusFilter} in ${yearFilter}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'success.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h4">
                      {electionStats.completed}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        {electionStats.total > 0 
                          ? `${Math.round((electionStats.completed / electionStats.total) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'info.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Pending
                    </Typography>
                    <Typography variant="h4">
                      {electionStats.pending}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PendingIcon color="info" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        {electionStats.total > 0 
                          ? `${Math.round((electionStats.pending / electionStats.total) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'error.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Cancelled
                    </Typography>
                    <Typography variant="h4">
                      {electionStats.cancelled}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        {electionStats.total > 0 
                          ? `${Math.round((electionStats.cancelled / electionStats.total) * 100)}%` 
                          : '0%'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Election Status Pie Chart */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Election Status Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="80%" height={300}>
                      <PieChart>
                        <Pie
                          data={electionStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {electionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} elections`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Election Timeline
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={electionData?.monthlyData || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#00C49F" stackId="a" />
                      <Bar dataKey="pending" name="Pending" fill="#0088FE" stackId="a" />
                      <Bar dataKey="cancelled" name="Cancelled" fill="#FF8042" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Elections Table */}
            <Paper sx={{ mt: 4, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Election Schedule
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Union</TableCell>
                      <TableCell>Election Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Voter Turnout</TableCell>
                      <TableCell>Positions</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {electionData?.elections?.map((election) => (
                      <TableRow key={election.id}>
                        <TableCell>
                          {election.unionName}
                          <Typography variant="caption" display="block" color="textSecondary">
                            {election.registrationNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(election.electionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={election.status} 
                            color={
                              election.status === 'completed' ? 'success' : 
                              election.status === 'pending' ? 'info' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {election.voterTurnout ? `${election.voterTurnout}%` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {election.positionsCount} positions
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Nomination Vetting Process
          </Typography>
          <Typography variant="body2" paragraph>
            Verify and approve nominated candidates for union executive positions.
          </Typography>
          
          <Stepper activeStep={1} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Nomination Submission</StepLabel>
            </Step>
            <Step>
              <StepLabel>OIR Verification</StepLabel>
            </Step>
            <Step>
              <StepLabel>EC ARO Review</StepLabel>
            </Step>
            <Step>
              <StepLabel>Labour Officer Approval</StepLabel>
            </Step>
            <Step>
              <StepLabel>Final Confirmation</StepLabel>
            </Step>
          </Stepper>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Union</TableCell>
                  <TableCell>Membership Status</TableCell>
                  <TableCell>Verification Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>President</TableCell>
                  <TableCell>Teachers Association (IO-05)</TableCell>
                  <TableCell>
                    <Chip label="Valid Member" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="OIR Verified" color="info" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary">
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Vice President</TableCell>
                  <TableCell>Teachers Association (IO-05)</TableCell>
                  <TableCell>
                    <Chip label="Valid Member" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="OIR Verified" color="info" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary">
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Robert Johnson</TableCell>
                  <TableCell>Treasurer</TableCell>
                  <TableCell>Teachers Association (IO-05)</TableCell>
                  <TableCell>
                    <Chip label="Membership Expired" color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="Verification Failed" color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary" disabled>
                      Approve
                    </Button>
                    <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mary Williams</TableCell>
                  <TableCell>Secretary</TableCell>
                  <TableCell>Teachers Association (IO-05)</TableCell>
                  <TableCell>
                    <Chip label="Valid Member" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="Pending Verification" color="warning" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary">
                      Verify
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary">
              Submit Verification Results
            </Button>
          </Box>
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Voter Eligibility Calculator
          </Typography>
          <Typography variant="body2" paragraph>
            Calculate if the voter turnout meets the required percentage for a valid election.
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Union Members"
                type="number"
                value={totalMembers}
                onChange={(e) => setTotalMembers(parseInt(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Members Present for Voting"
                type="number"
                value={presentVoters}
                onChange={(e) => setPresentVoters(parseInt(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0, max: totalMembers } }}
                error={presentVoters > totalMembers}
                helperText={presentVoters > totalMembers ? "Cannot exceed total members" : ""}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Required Percentage (%)"
                type="number"
                value={requiredPercentage}
                onChange={(e) => setRequiredPercentage(parseInt(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CalculateIcon />}
              onClick={calculateVoterEligibility}
              disabled={totalMembers <= 0 || presentVoters > totalMembers}
            >
              Calculate Eligibility
            </Button>
          </Box>
          
          {calculationPerformed && (
            <Box sx={{ mb: 4 }}>
              <Alert 
                severity={isQuorumMet ? "success" : "error"}
                sx={{ mb: 2 }}
              >
                {isQuorumMet 
                  ? "Quorum requirements met. The election can proceed." 
                  : "Quorum requirements not met. The election cannot proceed."}
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Total Members</Typography>
                    <Typography variant="h6">{totalMembers}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Members Present</Typography>
                    <Typography variant="h6">{presentVoters}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary">Turnout Percentage</Typography>
                    <Typography 
                      variant="h6" 
                      color={isQuorumMet ? "success.main" : "error.main"}
                    >
                      {voterTurnoutPercentage.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Required Percentage</Typography>
                    <Typography variant="body1">{requiredPercentage}%</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
          
          <Typography variant="subtitle2" gutterBottom>
            Eligibility Requirements
          </Typography>
          <Typography variant="body2" paragraph>
            According to the Industrial Organizations Act, for an election to be valid:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                The voter turnout must be at least 50% of the total membership.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                All voters must be valid members with up-to-date membership status.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                The election must be supervised by an authorized representative from the Office of the Industrial Registrar.
              </Typography>
            </li>
          </ul>
        </Paper>
      </TabPanel>
    </Paper>
  );
};

export default ElectionDashboard;

// Enhanced Dashboard Component with Notifications, Critical Tasks, and User Monitoring
// src/components/dashboard/MainDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  Link,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  FileCopy as FileCopyIcon,
  HowToReg as HowToRegIcon,
  RateReview as RateReviewIcon,
  Assessment as AssessmentIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Mock data for demonstration
const mockStats = {
  totalUnions: 28,
  totalUnionsChange: 12.5,
  industrialAwards: 89,
  industrialAwardsChange: 8.2,
  pendingReviews: 18,
  pendingReviewsChange: -4.5,
  criticalWorkflows: 5,
  criticalWorkflowsChange: 21.3
};

const mockOnlineUsers = [
  { id: 1, name: 'Natasha Utubasi', role: 'Industrial', avatar: '/assets/avatars/avatar1.jpg' },
  { id: 2, name: 'Paul Wartovo', role: 'Deputy', avatar: '/assets/avatars/avatar2.jpg' },
  { id: 3, name: 'Marcella Apana', role: 'Executive', avatar: '/assets/avatars/avatar3.jpg' },
  { id: 4, name: 'Gilbert Papole', role: 'Senior', avatar: '/assets/avatars/avatar4.jpg' },
  { id: 5, name: 'Alice Ngih', role: 'Budget', avatar: '/assets/avatars/avatar5.jpg' },
  { id: 6, name: 'OIC Registry', role: 'OIC', avatar: '/assets/avatars/avatar6.jpg' },
  { id: 7, name: 'Bernard Toqiba', role: 'Database', avatar: '/assets/avatars/avatar7.jpg' }
];

const mockRecentActivity = [
  { 
    id: 1, 
    type: 'document', 
    title: 'Financial Membership List - AMWU', 
    status: 'success', 
    user: 'Sarah Johnson', 
    time: '2 hours ago' 
  },
  { 
    id: 2, 
    type: 'registration', 
    title: 'Australian Teachers Union', 
    status: 'success', 
    user: 'Michael Chen', 
    time: '3 hours ago' 
  },
  { 
    id: 3, 
    type: 'workflow', 
    title: 'Healthcare Workers Award 2025', 
    status: 'warning', 
    user: 'James Wilson', 
    time: '5 hours ago' 
  },
  { 
    id: 4, 
    type: 'workflow', 
    title: 'Financial Returns - Transport Union', 
    status: 'error', 
    user: 'Emma Davis', 
    time: '1 day ago' 
  },
  { 
    id: 5, 
    type: 'election', 
    title: 'PNG Energy Workers Association', 
    status: 'success', 
    user: 'David Brown', 
    time: '6 hours ago' 
  }
];

const mockRecentWorkflows = [
  { 
    id: 1, 
    title: 'Ramu Nickel Project Operation Industrial Agreement', 
    status: 'success', 
    statusText: 'Processed & Cleared', 
    time: '2 days ago' 
  },
  { 
    id: 2, 
    title: 'PNG Maritime & Transport Workers Union Agreement', 
    status: 'warning', 
    statusText: 'Returned for Correction', 
    time: '1 day ago' 
  },
  { 
    id: 3, 
    title: 'Police Association of PNG Election', 
    status: 'info', 
    statusText: 'In Progress', 
    time: '5 hours ago' 
  },
  { 
    id: 4, 
    title: 'Maria Merava vs Express Freight Management', 
    status: 'success', 
    statusText: 'Referred to NEC', 
    time: '1 hour ago' 
  },
  { 
    id: 5, 
    title: 'Teachers Award Variation Application', 
    status: 'success', 
    statusText: 'Approved', 
    time: '3 hours ago' 
  }
];

const mockCriticalWorkflows = [
  { 
    id: 1, 
    title: 'Plus Yafaet v. Air Niugini Ltd', 
    type: 'Tribunal Determination', 
    dueDate: '5/30/2025', 
    assignedTo: 'Natasha Utubasi', 
    progress: 80 
  },
  { 
    id: 2, 
    title: 'OIR Labour Market Database Implementation', 
    type: 'IT Project', 
    dueDate: '12/31/2025', 
    assignedTo: 'IT Team', 
    progress: 30 
  }
];

const mockRecentDocuments = [
  { id: 1, title: 'Annual Report 2023', type: 'PDF', size: '2.4 MB', date: '2023-12-15' },
  { id: 2, title: 'Union Registration Form', type: 'DOCX', size: '1.2 MB', date: '2023-12-10' },
  { id: 3, title: 'Meeting Minutes', type: 'PDF', size: '0.8 MB', date: '2023-12-05' },
  { id: 4, title: 'Financial Statement', type: 'XLSX', size: '3.1 MB', date: '2023-11-28' }
];

const mockPendingApprovals = [
  { 
    id: 1, 
    title: 'Union Registration', 
    requestedBy: 'John Doe', 
    date: '2023-12-14', 
    status: 'pending' 
  },
  { 
    id: 2, 
    title: 'Document Upload', 
    requestedBy: 'Jane Smith', 
    date: '2023-12-12', 
    status: 'pending' 
  },
  { 
    id: 3, 
    title: 'Account Access', 
    requestedBy: 'Robert Johnson', 
    date: '2023-12-10', 
    status: 'pending' 
  }
];

const mockUnionMembershipData = [
  { name: 'Public Employees Association', members: 15000 },
  { name: 'PNG Teachers Association', members: 12000 },
  { name: 'Maritime Workers Union', members: 8000 },
  { name: 'Energy Workers Association', members: 6500 },
  { name: 'Public Health Workers Union', members: 5800 },
  { name: 'Transport Workers Union', members: 5200 },
  { name: 'Mining Workers Union', members: 4800 },
  { name: 'Construction Workers Union', members: 4500 },
  { name: 'Banking & Finance Union', members: 4200 },
  { name: 'Telecom Workers Union', members: 3800 },
  { name: 'Retail Workers Union', members: 3500 },
  { name: 'Hospitality Workers Union', members: 3200 },
  { name: 'Agricultural Workers Union', members: 2800 },
  { name: 'Fishing Industry Union', members: 2500 },
  { name: 'National Airline Employees Association', members: 2200 },
  { name: 'Forestry Workers Union', members: 1800 },
  { name: 'Petroleum Workers Union', members: 1500 },
  { name: 'Association of UPNG Staff', members: 1200 }
];

const mockUnionTimelineData = [
  { year: '1963', activeUnions: 4, inactiveUnions: 0 },
  { year: '1965', activeUnions: 6, inactiveUnions: 1 },
  { year: '1969', activeUnions: 1, inactiveUnions: 0 },
  { year: '1989', activeUnions: 1, inactiveUnions: 0 },
  { year: '2001', activeUnions: 1, inactiveUnions: 0 },
  { year: '2021', activeUnions: 1, inactiveUnions: 0 }
];

const mockUnionsByIndustryData = [
  { name: 'Mining', value: 3 },
  { name: 'Agriculture', value: 3 },
  { name: 'Construction', value: 3 },
  { name: 'Transport', value: 3 },
  { name: 'Education', value: 3 },
  { name: 'Tourism', value: 1 },
  { name: 'Finance', value: 1 },
  { name: 'Services', value: 2 }
];

const mockElectionStatusData = [
  { name: 'Declared', value: 65 },
  { name: 'Pending', value: 25 },
  { name: 'Disputed', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const MainDashboard: React.FC = () => {
  const theme = useTheme();
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [unionMembershipFilter, setUnionMembershipFilter] = useState<string>('all');
  
  useEffect(() => {
    // Set initial last updated time
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString());
    
    // Set up auto-refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      const refreshTime = new Date();
      setLastUpdated(refreshTime.toLocaleTimeString());
      // In a real app, this would fetch fresh data from the API
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const handleRefresh = () => {
    const refreshTime = new Date();
    setLastUpdated(refreshTime.toLocaleTimeString());
    // In a real app, this would fetch fresh data from the API
  };
  
  const handleUnionMembershipFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setUnionMembershipFilter(newValue);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'info':
      default:
        return <AccessTimeIcon color="info" />;
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DescriptionIcon />;
      case 'registration':
        return <HowToRegIcon />;
      case 'workflow':
        return <AssignmentIcon />;
      case 'election':
        return <HowToRegIcon />;
      default:
        return <AssignmentIcon />;
    }
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileCopyIcon style={{ color: '#e74c3c' }} />;
      case 'DOCX':
        return <FileCopyIcon style={{ color: '#3498db' }} />;
      case 'XLSX':
        return <FileCopyIcon style={{ color: '#2ecc71' }} />;
      default:
        return <FileCopyIcon />;
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Last updated: {lastUpdated}
          </Typography>
          <IconButton size="small" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Key Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Total Unions</Typography>
              <Typography variant="h4">{mockStats.totalUnions}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={mockStats.totalUnionsChange >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {mockStats.totalUnionsChange >= 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {mockStats.totalUnionsChange >= 0 ? '+' : ''}{mockStats.totalUnionsChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>from last month</Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <PersonIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Industrial Awards</Typography>
              <Typography variant="h4">{mockStats.industrialAwards}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={mockStats.industrialAwardsChange >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {mockStats.industrialAwardsChange >= 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {mockStats.industrialAwardsChange >= 0 ? '+' : ''}{mockStats.industrialAwardsChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>from last month</Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <DescriptionIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Pending Reviews</Typography>
              <Typography variant="h4">{mockStats.pendingReviews}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={mockStats.pendingReviewsChange >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {mockStats.pendingReviewsChange >= 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {mockStats.pendingReviewsChange >= 0 ? '+' : ''}{mockStats.pendingReviewsChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>from last month</Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <RateReviewIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">Critical Workflows</Typography>
              <Typography variant="h4">{mockStats.criticalWorkflows}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color={mockStats.criticalWorkflowsChange >= 0 ? 'error.main' : 'success.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {mockStats.criticalWorkflowsChange >= 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {mockStats.criticalWorkflowsChange >= 0 ? '+' : ''}{mockStats.criticalWorkflowsChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>from last month</Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
              <WarningIcon />
            </Avatar>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Union Membership Size */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Union Membership Size</Typography>
              </Box>
              <Tabs
                value={unionMembershipFilter}
                onChange={handleUnionMembershipFilterChange}
                aria-label="union membership filter"
                sx={{ minHeight: 'auto' }}
              >
                <Tab label="All" value="all" sx={{ minHeight: 'auto', py: 1 }} />
                <Tab label="Growing" value="growing" sx={{ minHeight: 'auto', py: 1 }} />
                <Tab label="Declining" value="declining" sx={{ minHeight: 'auto', py: 1 }} />
                <Tab label="Stable" value="stable" sx={{ minHeight: 'auto', py: 1 }} />
              </Tabs>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={mockUnionMembershipData.slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={150}
                  />
                  <RechartsTooltip />
                  <Bar dataKey="members" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Showing top 10 unions by membership size. Hover over bars for details.
            </Typography>
          </Paper>
          
          {/* Union Registration Timeline */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Union Registration Timeline (1963-2025)</Typography>
            </Box>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockUnionTimelineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="activeUnions" name="Active Unions" fill="#2196f3" />
                  <Bar dataKey="inactiveUnions" name="Inactive Unions" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Unions by Industry Type */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Unions by Industry Type</Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockUnionsByIndustryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ 
                            backgroundColor: '#fff', 
                            padding: '10px', 
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}>
                            <p>{`${payload[0].name}`}</p>
                            <p>{`Number of Unions: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8">
                    {mockUnionsByIndustryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Union Election Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HowToRegIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Union Election Status</Typography>
            </Box>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={mockElectionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockElectionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.name === 'Declared' ? '#4caf50' : 
                        entry.name === 'Pending' ? '#ff9800' : 
                        '#f44336'
                      } />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%', mr: 1 }} />
                <Typography variant="body2">Declared</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: '50%', mr: 1 }} />
                <Typography variant="body2">Pending</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: '50%', mr: 1 }} />
                <Typography variant="body2">Disputed</Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Union Inspection Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Union Inspection Status</Typography>
            </Box>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Jan', completed: 5, due: 2, overdue: 1 },
                    { month: 'Feb', completed: 7, due: 3, overdue: 0 },
                    { month: 'Mar', completed: 4, due: 4, overdue: 2 },
                    { month: 'Apr', completed: 6, due: 2, overdue: 1 },
                    { month: 'May', completed: 8, due: 1, overdue: 0 },
                    { month: 'Jun', completed: 5, due: 3, overdue: 2 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#4caf50" />
                  <Line type="monotone" dataKey="due" name="Due" stroke="#ff9800" />
                  <Line type="monotone" dataKey="overdue" name="Overdue" stroke="#f44336" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Staff Online */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Staff Online ({mockOnlineUsers.length})</Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {mockOnlineUsers.map(user => (
                <Grid item xs={6} key={user.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name}
                      sx={{ width: 48, height: 48, mb: 1 }}
                    />
                    <Typography variant="body2" align="center">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" align="center">{user.role}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          {/* Recent Activity */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Activity</Typography>
              </Box>
            </Box>
            <List dense>
              {mockRecentActivity.map(activity => (
                <ListItem key={activity.id} sx={{ px: 1, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getStatusIcon(activity.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={`${activity.time} by ${activity.user}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small"
              >
                View all activity
              </Button>
            </Box>
          </Paper>
          
          {/* Recent Workflows */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Workflows</Typography>
              </Box>
            </Box>
            <List dense>
              {mockRecentWorkflows.map(workflow => (
                <ListItem key={workflow.id} sx={{ px: 1, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getStatusIcon(workflow.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={workflow.title}
                    secondary={`${workflow.statusText} • ${workflow.time}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small"
              >
                View all workflows
              </Button>
            </Box>
          </Paper>
          
          {/* Quick Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Quick Actions</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<DescriptionIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  New Document
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<PersonIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Register Union
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<RateReviewIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Process Reviews
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<AssessmentIcon />}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Recent Documents */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Documents</Typography>
              </Box>
            </Box>
            <List dense>
              {mockRecentDocuments.map(doc => (
                <ListItem key={doc.id} sx={{ px: 1, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getFileIcon(doc.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.title}
                    secondary={`${doc.type} • ${doc.size}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(doc.date).toLocaleDateString()}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small"
              >
                View all documents
              </Button>
            </Box>
          </Paper>
          
          {/* Pending Approvals */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Approvals</Typography>
              </Box>
            </Box>
            <List dense>
              {mockPendingApprovals.map(approval => (
                <ListItem key={approval.id} sx={{ px: 1, py: 0.5 }}>
                  <ListItemText
                    primary={approval.title}
                    secondary={`Requested by ${approval.requestedBy}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {new Date(approval.date).toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label={approval.status.charAt(0).toUpperCase() + approval.status.slice(1)} 
                        size="small" 
                        color="warning"
                      />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small"
              >
                View all approvals
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Critical Workflows - Full Width */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Critical Workflows</Typography>
              </Box>
            </Box>
            <List>
              {mockCriticalWorkflows.map(workflow => (
                <ListItem key={workflow.id} sx={{ px: 2, py: 1, bgcolor: 'rgba(244, 67, 54, 0.05)', mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">{workflow.title}</Typography>
                        <Chip label="Critical" color="error" size="small" />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Type:</strong> {workflow.type}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Due:</strong> {workflow.dueDate}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Assigned to:</strong> {workflow.assignedTo}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                <strong>{workflow.progress}% complete</strong>
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <LinearProgress 
                          variant="determinate" 
                          value={workflow.progress} 
                          color="error"
                          sx={{ mt: 1, height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                size="small"
              >
                View all workflows
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;

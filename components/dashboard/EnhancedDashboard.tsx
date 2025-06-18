// Enhanced Dashboard Component for OIR Dashboard
// src/components/dashboard/EnhancedDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Tooltip,
  LinearProgress,
  Stack,
  Link,
  AvatarGroup
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assignment as AssignmentIcon,
  AssignmentLate as AssignmentLateIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Gavel as GavelIcon,
  HowToVote as HowToVoteIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilePresent as FilePresentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockStats = {
  totalUnions: {
    value: 28,
    change: 12.5,
    trend: 'up'
  },
  industrialAwards: {
    value: 89,
    change: 8.2,
    trend: 'up'
  },
  pendingReviews: {
    value: 18,
    change: -4.5,
    trend: 'down'
  },
  criticalWorkflows: {
    value: 5,
    change: 21.3,
    trend: 'up'
  }
};

const mockStaffOnline = [
  { id: 1, name: 'Natasha Utubasi', role: 'Industrial Registrar', avatar: '/avatars/natasha.jpg', status: 'online' },
  { id: 2, name: 'Paul Wartovo', role: 'Deputy', avatar: '/avatars/paul.jpg', status: 'online' },
  { id: 3, name: 'Marcella Apana', role: 'Executive', avatar: '/avatars/marcella.jpg', status: 'online' },
  { id: 4, name: 'Gilbert Papole', role: 'Senior', avatar: '/avatars/gilbert.jpg', status: 'online' },
  { id: 5, name: 'Alice Ngih', role: 'Budget', avatar: '/avatars/alice.jpg', status: 'online' },
  { id: 6, name: 'OIC Registry', role: 'OIC', avatar: '/avatars/oic.jpg', status: 'online' },
  { id: 7, name: 'Bernard Togiba', role: 'Database', avatar: '/avatars/bernard.jpg', status: 'online' }
];

const mockRecentActivity = [
  {
    id: 1,
    type: 'document_upload',
    title: 'Document Upload',
    description: 'Financial Membership List - AMWU',
    user: 'Sarah Johnson',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'registration_approval',
    title: 'Registration Approval',
    description: 'Australian Teachers Union',
    user: 'Michael Chen',
    time: '3 hours ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'workflow_update',
    title: 'Workflow Update',
    description: 'Healthcare Workers Award 2025',
    user: 'James Wilson',
    time: '5 hours ago',
    status: 'warning'
  },
  {
    id: 4,
    type: 'workflow_rejection',
    title: 'Workflow Rejection',
    description: 'Financial Returns - Transport Union',
    user: 'Emma Davis',
    time: '1 day ago',
    status: 'error'
  },
  {
    id: 5,
    type: 'election_notification',
    title: 'Election Notification',
    description: 'PNG Energy Workers Association',
    user: 'David Brown',
    time: '6 hours ago',
    status: 'success'
  }
];

const mockRecentWorkflows = [
  {
    id: 1,
    title: 'Ramu Nickel Project Operation',
    subtitle: 'Industrial Agreement',
    status: 'Processed & Cleared',
    time: '2 days ago',
    statusType: 'success'
  },
  {
    id: 2,
    title: 'PNG Maritime & Transport Workers Union Agreement',
    subtitle: 'Agreement',
    status: 'Returned for Correction',
    time: '1 day ago',
    statusType: 'warning'
  },
  {
    id: 3,
    title: 'Police Association of PNG Election',
    subtitle: 'Election',
    status: 'In Progress',
    time: '5 hours ago',
    statusType: 'info'
  },
  {
    id: 4,
    title: 'Maria Merava vs Express Freight Management',
    subtitle: 'Dispute',
    status: 'Referred to NEC',
    time: '1 hour ago',
    statusType: 'success'
  },
  {
    id: 5,
    title: 'Teachers Award Variation Application',
    subtitle: 'Award',
    status: 'Approved',
    time: '3 hours ago',
    statusType: 'success'
  }
];

const mockCriticalWorkflows = [
  {
    id: 1,
    title: 'Plus Yafaet v. Air Niugini Ltd',
    subtitle: 'Tribunal Determination',
    dueDate: '5/30/2025',
    assignedTo: 'Natasha Utubasi',
    progress: 80
  },
  {
    id: 2,
    title: 'OIR Labour Market Database Implementation',
    subtitle: 'IT Project',
    dueDate: '12/31/2025',
    assignedTo: 'IT Team',
    progress: 30
  }
];

const mockRecentDocuments = [
  {
    id: 1,
    title: 'Annual Report 2023',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    date: '2023-12-15'
  },
  {
    id: 2,
    title: 'Union Registration Form',
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    date: '2023-12-10'
  },
  {
    id: 3,
    title: 'Meeting Minutes',
    fileType: 'PDF',
    fileSize: '0.8 MB',
    date: '2023-12-05'
  },
  {
    id: 4,
    title: 'Financial Statement',
    fileType: 'XLSX',
    fileSize: '3.1 MB',
    date: '2023-11-28'
  }
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

const mockNotifications = [
  {
    id: 1,
    title: 'Membership List Submission',
    message: 'PNG Teachers Association has submitted a new membership list',
    time: '10 minutes ago',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Election Nomination Deadline',
    message: 'Maritime Workers Union election nominations close tomorrow',
    time: '1 hour ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Fee Payment Received',
    message: 'Energy Workers Association has paid registration renewal fee',
    time: '3 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    title: 'Compliance Warning',
    message: 'Public Employees Association is 30 days overdue for annual return',
    time: '1 day ago',
    read: false,
    priority: 'high'
  },
  {
    id: 5,
    title: 'System Maintenance',
    message: 'System will be down for maintenance on Sunday, 2am-4am',
    time: '2 days ago',
    read: true,
    priority: 'medium'
  }
];

const mockUserSessions = [
  {
    id: 1,
    username: 'natasha.utubasi',
    name: 'Natasha Utubasi',
    role: 'Industrial Registrar',
    loginTime: '2025-06-05 08:30:45',
    lastActivity: '2025-06-05 14:25:12',
    status: 'active',
    ipAddress: '192.168.1.101'
  },
  {
    id: 2,
    username: 'paul.wartovo',
    name: 'Paul Wartovo',
    role: 'Deputy Registrar',
    loginTime: '2025-06-05 09:15:22',
    lastActivity: '2025-06-05 14:20:05',
    status: 'active',
    ipAddress: '192.168.1.102'
  },
  {
    id: 3,
    username: 'gilbert.papole',
    name: 'Gilbert Papole',
    role: 'Senior Officer',
    loginTime: '2025-06-05 08:45:10',
    lastActivity: '2025-06-05 14:15:30',
    status: 'active',
    ipAddress: '192.168.1.103'
  }
];

const EnhancedDashboard: React.FC = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Count unread notifications
    const unreadCount = mockNotifications.filter(notification => !notification.read).length;
    setUnreadNotifications(unreadCount);
  }, []);
  
  const handleNavigate = (path: string) => {
    navigate(path);
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
        return <InfoIcon color="info" />;
    }
  };
  
  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUpIcon color={change > 0 ? "success" : "error"} />;
    } else {
      return <TrendingDownIcon color={change < 0 ? "success" : "error"} />;
    }
  };
  
  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change}%`;
  };
  
  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FilePresentIcon color="error" />;
      case 'DOCX':
        return <FilePresentIcon color="primary" />;
      case 'XLSX':
        return <FilePresentIcon color="success" />;
      default:
        return <FilePresentIcon />;
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={`${unreadNotifications} unread notifications`}>
            <IconButton color="primary">
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Chip
            icon={<AccessTimeIcon />}
            label="Last updated: 7:31:46 AM"
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
      
      {/* Key Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Unions
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.totalUnions.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon(mockStats.totalUnions.trend, mockStats.totalUnions.change)}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatChange(mockStats.totalUnions.change)} from last month
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
              <GroupIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Industrial Awards
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.industrialAwards.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon(mockStats.industrialAwards.trend, mockStats.industrialAwards.change)}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatChange(mockStats.industrialAwards.change)} from last month
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
              <GavelIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending Reviews
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.pendingReviews.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon(mockStats.pendingReviews.trend, mockStats.pendingReviews.change)}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatChange(mockStats.pendingReviews.change)} from last month
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
              <AssignmentIcon />
            </Avatar>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Critical Workflows
              </Typography>
              <Typography variant="h4" component="div">
                {mockStats.criticalWorkflows.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon(mockStats.criticalWorkflows.trend, mockStats.criticalWorkflows.change)}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {formatChange(mockStats.criticalWorkflows.change)} from last month
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
              <AssignmentLateIcon />
            </Avatar>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Union Membership Size Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Union Membership Size
                </Typography>
              </Box>
              
              <Box>
                <Button size="small" variant="outlined" sx={{ mr: 1 }}>All</Button>
                <Button size="small">Growing</Button>
                <Button size="small">Declining</Button>
                <Button size="small">Stable</Button>
              </Box>
            </Box>
            
            <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              {/* This would be replaced with an actual chart component */}
              <Typography variant="body2" color="text.secondary" align="center">
                [Union Membership Size Chart]
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Showing top 20 unions by membership size. Hover over bars for details.
            </Typography>
          </Paper>
          
          {/* Union Registration Timeline */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Union Registration Timeline (1963-2025)
              </Typography>
            </Box>
            
            <Box sx={{ height: 250, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              {/* This would be replaced with an actual chart component */}
              <Typography variant="body2" color="text.secondary" align="center">
                [Union Registration Timeline Chart]
              </Typography>
            </Box>
          </Paper>
          
          {/* Unions by Industry Type */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Unions by Industry Type
              </Typography>
            </Box>
            
            <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              {/* This would be replaced with an actual chart component */}
              <Typography variant="body2" color="text.secondary" align="center">
                [Unions by Industry Type Chart]
              </Typography>
            </Box>
          </Paper>
          
          {/* Union Election Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HowToVoteIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Union Election Status
              </Typography>
            </Box>
            
            <Box sx={{ height: 250, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              {/* This would be replaced with an actual chart component */}
              <Typography variant="body2" color="text.secondary" align="center">
                [Union Election Status Chart]
              </Typography>
            </Box>
          </Paper>
          
          {/* Union Inspection Status */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Union Inspection Status
              </Typography>
            </Box>
            
            <Box sx={{ height: 250, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              {/* This would be replaced with an actual chart component */}
              <Typography variant="body2" color="text.secondary" align="center">
                [Union Inspection Status Chart]
              </Typography>
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
                <Typography variant="h6">
                  Staff Online ({mockStaffOnline.length})
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {mockStaffOnline.map((staff) => (
                <Grid item xs={4} key={staff.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            border: '2px solid white'
                          }}
                        />
                      }
                    >
                      <Avatar src={staff.avatar} alt={staff.name}>
                        {staff.name.charAt(0)}
                      </Avatar>
                    </Badge>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      {staff.name.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      {staff.role}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          {/* Recent Activity */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Recent Activity
                </Typography>
              </Box>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {mockRecentActivity.map((activity) => (
                <ListItem
                  key={activity.id}
                  alignItems="flex-start"
                  sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getStatusIcon(activity.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {activity.description}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {activity.time} by {activity.user}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/activities')}
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
                <Typography variant="h6">
                  Recent Workflows
                </Typography>
              </Box>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {mockRecentWorkflows.map((workflow) => (
                <ListItem
                  key={workflow.id}
                  alignItems="flex-start"
                  sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getStatusIcon(workflow.statusType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={workflow.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {workflow.subtitle}
                        </Typography>
                        <br />
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={workflow.status}
                            size="small"
                            color={getStatusColor(workflow.statusType) as any}
                            sx={{ mr: 1 }}
                          />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {workflow.time}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/workflows')}
              >
                View all workflows
              </Button>
            </Box>
          </Paper>
          
          {/* Quick Actions */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Quick Actions
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilePresentIcon />}
                  onClick={() => handleNavigate('/documents/new')}
                  sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.5 }}
                >
                  New Document
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={() => handleNavigate('/organizations/register')}
                  sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.5 }}
                >
                  Register Union
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleNavigate('/reviews')}
                  sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.5 }}
                >
                  Process Reviews
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BarChartIcon />}
                  onClick={() => handleNavigate('/reports')}
                  sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1.5 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Bottom Row */}
        <Grid item xs={12} md={4}>
          {/* Recent Documents */}
          <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Recent Documents
              </Typography>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {mockRecentDocuments.map((document) => (
                <ListItem
                  key={document.id}
                  alignItems="flex-start"
                  sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFileIcon(document.fileType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={document.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {document.fileType} • {document.fileSize}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {document.date}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/documents')}
              >
                View all documents
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Pending Approvals */}
          <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Pending Approvals
              </Typography>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {mockPendingApprovals.map((approval) => (
                <ListItem
                  key={approval.id}
                  alignItems="flex-start"
                  sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemText
                    primary={approval.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Requested by: {approval.requestedBy}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {approval.date}
                          </Typography>
                          <Chip label="Pending" size="small" color="warning" />
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/approvals')}
              >
                View all approvals
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Critical Workflows */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ErrorIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Critical Workflows
              </Typography>
            </Box>
            
            <List sx={{ width: '100%' }}>
              {mockCriticalWorkflows.map((workflow) => (
                <ListItem
                  key={workflow.id}
                  alignItems="flex-start"
                  sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">{workflow.title}</Typography>
                        <Chip label="Critical" size="small" color="error" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {workflow.subtitle}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            Due: {workflow.dueDate}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            Assigned to: {workflow.assignedTo}
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={workflow.progress} 
                            color="error"
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {workflow.progress}% complete
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/workflows/critical')}
              >
                View all workflows
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* User Sessions Modal would be implemented here */}
      
      {/* Notifications Panel would be implemented here */}
    </Box>
  );
};

export default EnhancedDashboard;

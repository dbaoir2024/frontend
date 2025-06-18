// Enhanced React component for Union Profile with General Secretary details
// src/components/organizations/UnionProfile.tsx

import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Link
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Work as WorkIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon,
  AccountBalance as AccountBalanceIcon,
  Edit as EditIcon
} from '@mui/icons-material';

interface UnionProfileProps {
  organization: any; // Replace with actual type
  generalSecretary: any; // Replace with actual type
}

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const UnionProfile: React.FC<UnionProfileProps> = ({ organization, generalSecretary }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!organization) {
    return <Typography>No organization selected.</Typography>;
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar 
            src={organization.logo} 
            alt={organization.organization_name}
            sx={{ width: 80, height: 80 }}
          >
            {organization.organization_name.charAt(0)}
          </Avatar>
        }
        title={
          <Typography variant="h4">
            {organization.organization_name}
          </Typography>
        }
        subheader={
          <Typography variant="h6" color="text.secondary">
            Registration Number: {organization.registration_number}
          </Typography>
        }
        action={
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit Profile
          </Button>
        }
      />
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Overview" />
          <Tab label="General Secretary" />
          <Tab label="Contact & Location" />
          <Tab label="Membership" />
          <Tab label="Compliance" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom><strong>Basic Information</strong></Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">Established: {new Date(organization.established_date).toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={organization.status.charAt(0).toUpperCase() + organization.status.slice(1)} 
                color={organization.status === 'active' ? 'success' : 'error'} 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">Status</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">Sector: {organization.sector}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom><strong>Key Metrics</strong></Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GroupIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">Members: {organization.member_count.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BarChartIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">Compliance Rate: 85%</Typography> {/* Mock data */}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalanceIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">Last Financial Return: 2024</Typography> {/* Mock data */}
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {generalSecretary ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar 
                src={generalSecretary.profile_photo} 
                alt={`${generalSecretary.first_name} ${generalSecretary.last_name}`}
                sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
              >
                {generalSecretary.first_name.charAt(0)}{generalSecretary.last_name.charAt(0)}
              </Avatar>
              <Typography variant="h6">{generalSecretary.first_name} {generalSecretary.last_name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">General Secretary</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" gutterBottom><strong>Term Information</strong></Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">Appointed: {new Date(generalSecretary.appointment_date).toLocaleDateString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">Term Start: {new Date(generalSecretary.term_start_date).toLocaleDateString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">Term End: {generalSecretary.term_end_date ? new Date(generalSecretary.term_end_date).toLocaleDateString() : 'Ongoing'}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom><strong>Contact Details</strong></Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon color="action" sx={{ mr: 1 }} />
                <Link href={`mailto:${generalSecretary.email}`} variant="body2">{generalSecretary.email}</Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{generalSecretary.phone}</Typography>
              </Box>
              {generalSecretary.bio && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom><strong>Bio</strong></Typography>
                  <Typography variant="body2">{generalSecretary.bio}</Typography>
                </>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography>General Secretary information not available.</Typography>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="subtitle1" gutterBottom><strong>Registered Office</strong></Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{organization.address}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom><strong>Primary Contact</strong></Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{organization.contact_person}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EmailIcon color="action" sx={{ mr: 1 }} />
          <Link href={`mailto:${organization.email}`} variant="body2">{organization.email}</Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PhoneIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{organization.phone}</Typography>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Membership Details</Typography>
        <Typography variant="body1">Total Members: {organization.member_count.toLocaleString()}</Typography>
        {/* Add more membership details, charts, or tables here */}
        <Button variant="contained" sx={{ mt: 2 }}>View Membership List</Button>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h6" gutterBottom>Compliance Status</Typography>
        <Typography variant="body1">Compliance Rate: 85%</Typography> {/* Mock data */}
        <Typography variant="body1">Last Inspection Date: 2025-03-15</Typography> {/* Mock data */}
        <Typography variant="body1">Next Inspection Due: 2026-03-15</Typography> {/* Mock data */}
        {/* Add more compliance details, history, or reports here */}
        <Button variant="contained" sx={{ mt: 2 }}>View Compliance History</Button>
      </TabPanel>
    </Card>
  );
};

// Example Usage (replace with actual data fetching)
const mockOrganizationData = {
  id: 3,
  registration_number: 'IO-142',
  organization_name: 'PNG Maritime Workers Industrial Union',
  logo: 'https://example.com/logos/pngmwiu.png',
  established_date: '1986-11-22',
  status: 'active',
  member_count: 12000,
  sector: 'Maritime',
  address: 'P.O. Box 376, Port Moresby, Papua New Guinea',
  contact_person: 'Peter Williams',
  email: 'office@pngmwiu.org.pg',
  phone: '+675 321 1258'
};

const mockGeneralSecretaryData = {
  id: 1,
  organization_id: 3,
  position: 'General Secretary',
  first_name: 'Sarah',
  last_name: 'Brown',
  profile_photo: 'https://example.com/photos/sarah_brown.jpg',
  appointment_date: '2022-08-01',
  term_start_date: '2022-09-01',
  term_end_date: '2026-08-31',
  email: 'sarah.brown@pngmwiu.org.pg',
  phone: '+675 7123 4567',
  bio: 'Experienced leader in the maritime sector, dedicated to improving workers rights and conditions.'
};

const UnionProfileWrapper = () => {
  return (
    <UnionProfile 
      organization={mockOrganizationData} 
      generalSecretary={mockGeneralSecretaryData} 
    />
  );
};

export default UnionProfileWrapper;

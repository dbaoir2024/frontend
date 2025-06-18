// Enhanced React component for Register Management
// src/components/registers/RegisterDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Description as DescriptionIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { RootState } from '../../app/store';
import { formatDate } from '../../utils/dateUtils';
import FileDropzone from '../common/FileDropzone';

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
      id={`register-tabpanel-${index}`}
      aria-labelledby={`register-tab-${index}`}
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

const RegisterDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedRegisterType, setSelectedRegisterType] = useState<string>('');
  
  // Mock data for demonstration
  const registerTypes = [
    { id: 'IO', name: 'Industrial Organizations' },
    { id: 'D', name: 'Determinations' },
    { id: 'A', name: 'Awards' }
  ];
  
  const mockOrganizations = [
    { 
      id: 1, 
      registration_number: 'IO-101', 
      organization_name: 'National Academic Staff Association of the University of PNG',
      registration_date: '1977-07-31',
      organization_type: 'Employees',
      registered_office: 'University of Papua New Guinea, Waigani',
      status: 'active'
    },
    { 
      id: 2, 
      registration_number: 'IO-102', 
      organization_name: 'PNG Teachers Association',
      registration_date: '1970-05-15',
      organization_type: 'Employees',
      registered_office: 'Port Moresby',
      status: 'active'
    },
    { 
      id: 3, 
      registration_number: 'IO-103', 
      organization_name: 'PNG Maritime Workers Industrial Union',
      registration_date: '1975-09-20',
      organization_type: 'Employees',
      registered_office: 'Lae',
      status: 'inactive'
    }
  ];
  
  const mockDeterminations = [
    {
      id: 1,
      determination_number: 'D-1',
      year: '1973',
      title: 'Public Service Determination No.1 of 1973',
      parties: 'Public Service Board and Public Service Association of PNG',
      entry_date: '1972-12-01',
      commencement_date: '1973-04-01',
      registration_date: '1973-01-02',
      status: 'active'
    },
    {
      id: 2,
      determination_number: 'D-2',
      year: '1975',
      title: 'Teaching Service Determination No.2 of 1975',
      parties: 'Teaching Service Commission and PNG Teachers Association',
      entry_date: '1975-01-15',
      commencement_date: '1975-02-01',
      registration_date: '1975-01-20',
      status: 'active'
    }
  ];
  
  const mockAwards = [
    {
      id: 1,
      file_number: 'F-001',
      award_number: 'A-1',
      award_title: 'Banking Industry Award',
      category: 'Consented Awards',
      employer: 'Banking Association of PNG',
      employee: 'Banking Employees Union',
      entry_date: '2020-05-10',
      commencement_date: '2020-06-01',
      registration_date: '2020-05-15',
      gazette_date: '2020-05-20',
      gazette_number: 'G-2020-45',
      expiration_date: '2025-05-31',
      status: 'active'
    },
    {
      id: 2,
      file_number: 'F-002',
      award_number: 'A-2',
      award_title: 'Mining Industry Award',
      category: 'Arbitrated Awards',
      employer: 'Chamber of Mines and Petroleum',
      employee: 'PNG Mining and Petroleum Workers Union',
      entry_date: '2019-10-15',
      commencement_date: '2019-11-01',
      registration_date: '2019-10-20',
      gazette_date: '2019-10-25',
      gazette_number: 'G-2019-98',
      expiration_date: '2024-10-31',
      status: 'active'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenNewDialog = () => {
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
    setSelectedRegisterType('');
  };

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (status.toLowerCase()) {
      case 'active':
        color = 'success';
        break;
      case 'inactive':
        color = 'warning';
        break;
      case 'deregistered':
        color = 'error';
        break;
      case 'expired':
        color = 'error';
        break;
      case 'expiring_soon':
        color = 'warning';
        break;
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Register Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNewDialog}
        >
          New Registration
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="register tabs">
          <Tab label="Industrial Organizations" />
          <Tab label="Determinations" />
          <Tab label="Awards" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, number, parties..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Registration Number</TableCell>
                <TableCell>Organization Name</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Organization Type</TableCell>
                <TableCell>Registered Office</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrganizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>{org.registration_number}</TableCell>
                  <TableCell>{org.organization_name}</TableCell>
                  <TableCell>{org.registration_date}</TableCell>
                  <TableCell>{org.organization_type}</TableCell>
                  <TableCell>{org.registered_office}</TableCell>
                  <TableCell>{getStatusChip(org.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="View Details">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Print Certificate">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Documents">
                      <DescriptionIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Determination Number</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Parties</TableCell>
                <TableCell>Entry Date</TableCell>
                <TableCell>Commencement Date</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockDeterminations.map((det) => (
                <TableRow key={det.id}>
                  <TableCell>{det.determination_number}</TableCell>
                  <TableCell>{det.year}</TableCell>
                  <TableCell>{det.title}</TableCell>
                  <TableCell>{det.parties}</TableCell>
                  <TableCell>{det.entry_date}</TableCell>
                  <TableCell>{det.commencement_date}</TableCell>
                  <TableCell>{det.registration_date}</TableCell>
                  <TableCell>{getStatusChip(det.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="View Details">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Print Certificate">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Documents">
                      <DescriptionIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Number</TableCell>
                <TableCell>Award Number</TableCell>
                <TableCell>Award Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Employer</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAwards.map((award) => (
                <TableRow key={award.id}>
                  <TableCell>{award.file_number}</TableCell>
                  <TableCell>{award.award_number}</TableCell>
                  <TableCell>{award.award_title}</TableCell>
                  <TableCell>{award.category}</TableCell>
                  <TableCell>{award.employer}</TableCell>
                  <TableCell>{award.employee}</TableCell>
                  <TableCell>{award.registration_date}</TableCell>
                  <TableCell>{award.expiration_date}</TableCell>
                  <TableCell>{getStatusChip(award.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="View Details">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Print Certificate">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Documents">
                      <DescriptionIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* New Registration Dialog */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog} maxWidth="md" fullWidth>
        <DialogTitle>New Registration</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Register Type</InputLabel>
              <Select
                value={selectedRegisterType}
                onChange={(e) => setSelectedRegisterType(e.target.value as string)}
                label="Register Type"
              >
                {registerTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedRegisterType === 'IO' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Industrial Organization Registration</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Organization Name"
                      placeholder="Full legal name of the organization"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Organization Type</InputLabel>
                      <Select
                        label="Organization Type"
                      >
                        <MenuItem value="Employees">Employees</MenuItem>
                        <MenuItem value="Employers">Employers</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Registration Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Registered Office"
                      placeholder="Physical address of the registered office"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Postal Address"
                      placeholder="Postal address for correspondence"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Industry"
                      placeholder="Industry in connection with which Organization is Registered"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Constitution of Organization (Conditions of Eligibility)</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Enter the membership eligibility conditions as per the organization's constitution"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Upload Constitution Document</Typography>
                    <FileDropzone
                      accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                      }}
                      maxFiles={1}
                      maxSize={10485760} // 10MB
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {selectedRegisterType === 'D' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Determination Registration</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Determination Type</InputLabel>
                      <Select
                        label="Determination Type"
                      >
                        <MenuItem value="MWB">Minimum Wages Board Determination</MenuItem>
                        <MenuItem value="PS">Public Service Conciliation & Arbitrated Act Determination</MenuItem>
                        <MenuItem value="TS">Teaching Service Conciliation & Arbitrated Act Determination</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Year"
                      placeholder="Year of determination"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Title"
                      placeholder="Full title of the determination"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="First Party"
                      placeholder="First party to the determination"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Second Party"
                      placeholder="Second party to the determination"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Entry Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Commencement Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Registration Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Gazette Date"
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Gazette Number"
                      placeholder="Gazette publication number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Upload Determination Document</Typography>
                    <FileDropzone
                      accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                      }}
                      maxFiles={1}
                      maxSize={10485760} // 10MB
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {selectedRegisterType === 'A' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Award Registration</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="File Number"
                      placeholder="File reference number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Award Category</InputLabel>
                      <Select
                        label="Award Category"
                      >
                        <MenuItem value="ARB">Arbitrated Award</MenuItem>
                        <MenuItem value="CON">Consented Award</MenuItem>
                        <MenuItem value="CONS">Consolidated Award</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Award Title"
                      placeholder="Full title of the award"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Employer"
                      placeholder="Employer party to the award"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Employee"
                      placeholder="Employee party to the award"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Entry Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Commencement Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Registration Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Gazette Date"
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Gazette Number"
                      placeholder="Gazette publication number"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Expiration Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Superseded By"
                      placeholder="Reference to award that supersedes this one (if applicable)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Upload Award Document</Typography>
                    <FileDropzone
                      accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                      }}
                      maxFiles={1}
                      maxSize={10485760} // 10MB
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!selectedRegisterType}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RegisterDashboard;

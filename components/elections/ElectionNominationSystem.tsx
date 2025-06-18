// Enhanced React component for Election Nomination and Tracking
// src/components/elections/ElectionNominationSystem.tsx

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  HowToVote as HowToVoteIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
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

const ElectionNominationSystem: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openVettingDialog, setOpenVettingDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [openQuorumCalculator, setOpenQuorumCalculator] = useState(false);
  const [eligibleVoters, setEligibleVoters] = useState<number>(0);
  const [actualVoters, setActualVoters] = useState<number>(0);
  const [quorumPercentage, setQuorumPercentage] = useState<number>(50);
  
  // Mock data for demonstration
  const mockElections = [
    {
      id: 1,
      organization_id: 3,
      organization_name: 'PNG Maritime Workers Industrial Union',
      registration_number: 'IO-142',
      election_name: '2025 Executive Election',
      election_date: '2025-07-15',
      nomination_open_date: '2025-05-01',
      nomination_close_date: '2025-05-31',
      vetting_deadline: '2025-06-15',
      voting_start_date: '2025-07-15',
      voting_end_date: '2025-07-15',
      status: 'nominations_open',
      description: 'Election for all executive positions for the 2025-2029 term',
      created_at: '2025-04-01T10:00:00Z'
    },
    {
      id: 2,
      organization_id: 2,
      organization_name: 'PNG Teachers Association',
      registration_number: 'IO-102',
      election_name: '2024 National Executive Election',
      election_date: '2024-08-20',
      nomination_open_date: '2024-06-01',
      nomination_close_date: '2024-06-30',
      vetting_deadline: '2024-07-15',
      voting_start_date: '2024-08-20',
      voting_end_date: '2024-08-20',
      status: 'completed',
      description: 'Election for all national executive positions for the 2024-2028 term',
      created_at: '2024-05-01T09:30:00Z'
    }
  ];
  
  const mockPositions = [
    // National Positions
    { id: 1, position_name: 'National President', position_level: 'national' },
    { id: 2, position_name: 'National Vice President', position_level: 'national' },
    { id: 3, position_name: 'National Treasurer', position_level: 'national' },
    { id: 4, position_name: 'National Women\'s Representative', position_level: 'national' },
    
    // Regional Positions - NGI
    { id: 5, position_name: 'Male Representative NGI', position_level: 'regional', region: 'NGI' },
    { id: 6, position_name: 'Women\'s Representative NGI', position_level: 'regional', region: 'NGI' },
    
    // Regional Positions - Momase
    { id: 7, position_name: 'Male Representative Momase', position_level: 'regional', region: 'Momase' },
    { id: 8, position_name: 'Women\'s Representative Momase', position_level: 'regional', region: 'Momase' },
    
    // Regional Positions - Southern
    { id: 9, position_name: 'Male Representative Southern', position_level: 'regional', region: 'Southern' },
    { id: 10, position_name: 'Women\'s Representative Southern', position_level: 'regional', region: 'Southern' },
    
    // Regional Positions - Highlands
    { id: 11, position_name: 'Male Representative Highlands', position_level: 'regional', region: 'Highlands' },
    { id: 12, position_name: 'Women\'s Representative Highlands', position_level: 'regional', region: 'Highlands' },
    
    // Provincial Positions
    { id: 13, position_name: 'Provincial President', position_level: 'provincial', province: 'Central' },
    { id: 14, position_name: 'Provincial Vice President', position_level: 'provincial', province: 'Central' },
    { id: 15, position_name: 'Provincial Secretary/Treasurer', position_level: 'provincial', province: 'Central' }
  ];
  
  const mockCandidates = [
    {
      id: 1,
      election_id: 1,
      position_id: 1,
      position_name: 'National President',
      member_id: 101,
      first_name: 'John',
      last_name: 'Smith',
      gender: 'Male',
      date_of_birth: '1975-06-15',
      membership_number: 'MWU-1234',
      membership_start_date: '2010-03-10',
      branch: 'Port Moresby',
      region: 'Southern',
      province: 'NCD',
      district: 'Moresby North-West',
      email: 'john.smith@example.com',
      phone: '+675 7123 4567',
      photo: 'https://example.com/photos/john_smith.jpg',
      nomination_date: '2025-05-10T14:30:00Z',
      status: 'pending',
      verification_status: {
        registrar: 'pending',
        deputy_registrar: 'pending',
        oir_officer: 'pending',
        electoral_commission: 'pending'
      }
    },
    {
      id: 2,
      election_id: 1,
      position_id: 2,
      position_name: 'National Vice President',
      member_id: 102,
      first_name: 'Mary',
      last_name: 'Johnson',
      gender: 'Female',
      date_of_birth: '1980-09-22',
      membership_number: 'MWU-2345',
      membership_start_date: '2012-05-18',
      branch: 'Lae',
      region: 'Momase',
      province: 'Morobe',
      district: 'Lae',
      email: 'mary.johnson@example.com',
      phone: '+675 7234 5678',
      photo: 'https://example.com/photos/mary_johnson.jpg',
      nomination_date: '2025-05-12T10:15:00Z',
      status: 'verified',
      verification_status: {
        registrar: 'approved',
        deputy_registrar: 'approved',
        oir_officer: 'approved',
        electoral_commission: 'approved'
      }
    },
    {
      id: 3,
      election_id: 1,
      position_id: 3,
      position_name: 'National Treasurer',
      member_id: 103,
      first_name: 'Peter',
      last_name: 'Williams',
      gender: 'Male',
      date_of_birth: '1978-11-05',
      membership_number: 'MWU-3456',
      membership_start_date: '2011-08-22',
      branch: 'Madang',
      region: 'Momase',
      province: 'Madang',
      district: 'Madang',
      email: 'peter.williams@example.com',
      phone: '+675 7345 6789',
      photo: 'https://example.com/photos/peter_williams.jpg',
      nomination_date: '2025-05-15T09:45:00Z',
      status: 'pending',
      verification_status: {
        registrar: 'approved',
        deputy_registrar: 'pending',
        oir_officer: 'pending',
        electoral_commission: 'pending'
      }
    }
  ];
  
  const mockVerificationAuthorities = [
    { id: 1, authority_name: 'Industrial Registrar', authority_type: 'Registrar' },
    { id: 2, authority_name: 'Deputy Industrial Registrar', authority_type: 'Deputy_Registrar' },
    { id: 3, authority_name: 'OIR Officer', authority_type: 'OIR' },
    { id: 4, authority_name: 'Electoral Commission ARO', authority_type: 'Electoral_Commission' }
  ];
  
  const mockPollingStations = [
    {
      id: 1,
      election_id: 1,
      station_name: 'Port Moresby Headquarters',
      location: 'PNGMWIU Main Office, Port Moresby',
      region: 'Southern',
      province: 'NCD',
      district: 'Moresby North-West',
      officer_in_charge: 'Sarah Brown',
      contact_number: '+675 7123 4567',
      expected_voters: 2500,
      status: 'planned'
    },
    {
      id: 2,
      election_id: 1,
      station_name: 'Lae Branch Office',
      location: 'PNGMWIU Lae Branch, Morobe Province',
      region: 'Momase',
      province: 'Morobe',
      district: 'Lae',
      officer_in_charge: 'Michael Wilson',
      contact_number: '+675 7234 5678',
      expected_voters: 1800,
      status: 'planned'
    }
  ];

  useEffect(() => {
    // In a real application, this would fetch elections based on filters
    // For now, we're using mock data
    setSelectedElection(mockElections[0]); // Default to first election
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
  };

  const handleOpenVettingDialog = (candidate: any) => {
    setSelectedCandidate(candidate);
    setOpenVettingDialog(true);
  };

  const handleCloseVettingDialog = () => {
    setOpenVettingDialog(false);
    setSelectedCandidate(null);
  };

  const handleOpenQuorumCalculator = () => {
    setOpenQuorumCalculator(true);
  };

  const handleCloseQuorumCalculator = () => {
    setOpenQuorumCalculator(false);
  };

  const calculateQuorum = () => {
    const percentage = (actualVoters / eligibleVoters) * 100;
    return {
      percentage: percentage.toFixed(2),
      isMet: percentage >= quorumPercentage
    };
  };

  const getVerificationStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      case 'pending':
      default:
        return <Chip icon={<HourglassEmptyIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  const getElectionStatusChip = (status: string) => {
    switch (status) {
      case 'planned':
        return <Chip label="Planned" color="default" size="small" />;
      case 'nominations_open':
        return <Chip label="Nominations Open" color="info" size="small" />;
      case 'nominations_closed':
        return <Chip label="Nominations Closed" color="primary" size="small" />;
      case 'vetting':
        return <Chip label="Vetting" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'voting':
        return <Chip label="Voting" color="secondary" size="small" />;
      case 'counting':
        return <Chip label="Counting" color="info" size="small" />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Election Nomination & Tracking System</Typography>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Election</InputLabel>
          <Select
            value={selectedElection ? selectedElection.id : ''}
            onChange={(e) => {
              const electionId = e.target.value as number;
              const election = mockElections.find(el => el.id === electionId);
              setSelectedElection(election);
            }}
            label="Select Election"
          >
            {mockElections.map(election => (
              <MenuItem key={election.id} value={election.id}>
                {election.election_name} - {election.organization_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedElection && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={selectedElection.election_name}
              subheader={`${selectedElection.organization_name} (${selectedElection.registration_number})`}
              action={getElectionStatusChip(selectedElection.status)}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Election Timeline</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Nominations Open:</Typography>
                    <Typography variant="body2">{new Date(selectedElection.nomination_open_date).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Nominations Close:</Typography>
                    <Typography variant="body2">{new Date(selectedElection.nomination_close_date).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Vetting Deadline:</Typography>
                    <Typography variant="body2">{new Date(selectedElection.vetting_deadline).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Election Date:</Typography>
                    <Typography variant="body2">{new Date(selectedElection.election_date).toLocaleDateString()}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Election Status</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Current Status:</Typography>
                    <Typography variant="body2">{selectedElection.status.replace('_', ' ').charAt(0).toUpperCase() + selectedElection.status.replace('_', ' ').slice(1)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Positions:</Typography>
                    <Typography variant="body2">15 positions to be filled</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Nominations Received:</Typography>
                    <Typography variant="body2">{mockCandidates.length} candidates</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ width: 180 }}>Polling Stations:</Typography>
                    <Typography variant="body2">{mockPollingStations.length} stations</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<HowToVoteIcon />}
                  onClick={handleOpenQuorumCalculator}
                  sx={{ mr: 1 }}
                >
                  Quorum Calculator
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOpenImportDialog}
                >
                  Import Nominations
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="election tabs">
              <Tab label="Nominations" />
              <Tab label="Verification Status" />
              <Tab label="Polling Stations" />
              <Tab label="Results" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Candidate Nominations</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search Candidates"
                    placeholder="Search by name, position, or membership number..."
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Position Level</InputLabel>
                    <Select
                      label="Position Level"
                      defaultValue="all"
                    >
                      <MenuItem value="all">All Levels</MenuItem>
                      <MenuItem value="national">National</MenuItem>
                      <MenuItem value="regional">Regional</MenuItem>
                      <MenuItem value="provincial">Provincial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Verification Status</InputLabel>
                    <Select
                      label="Verification Status"
                      defaultValue="all"
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<AddIcon />}
                  >
                    Add Candidate
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Membership</TableCell>
                    <TableCell>Branch/Region</TableCell>
                    <TableCell>Nomination Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={candidate.photo} 
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            {candidate.first_name.charAt(0)}{candidate.last_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{candidate.first_name} {candidate.last_name}</Typography>
                            <Typography variant="caption" color="text.secondary">{candidate.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{candidate.position_name}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{candidate.membership_number}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Since {new Date(candidate.membership_start_date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{candidate.branch}</Typography>
                        <Typography variant="caption" color="text.secondary">{candidate.region} Region</Typography>
                      </TableCell>
                      <TableCell>{new Date(candidate.nomination_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {candidate.status === 'verified' ? (
                          <Chip icon={<CheckCircleIcon />} label="Verified" color="success" size="small" />
                        ) : candidate.status === 'rejected' ? (
                          <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />
                        ) : (
                          <Chip icon={<HourglassEmptyIcon />} label="Pending" color="warning" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Verify Candidate">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenVettingDialog(candidate)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Verification Status</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Industrial Registrar</TableCell>
                    <TableCell>Deputy Registrar</TableCell>
                    <TableCell>OIR Officer</TableCell>
                    <TableCell>Electoral Commission</TableCell>
                    <TableCell>Overall Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{candidate.first_name} {candidate.last_name}</Typography>
                      </TableCell>
                      <TableCell>{candidate.position_name}</TableCell>
                      <TableCell>
                        {getVerificationStatusChip(candidate.verification_status.registrar)}
                      </TableCell>
                      <TableCell>
                        {getVerificationStatusChip(candidate.verification_status.deputy_registrar)}
                      </TableCell>
                      <TableCell>
                        {getVerificationStatusChip(candidate.verification_status.oir_officer)}
                      </TableCell>
                      <TableCell>
                        {getVerificationStatusChip(candidate.verification_status.electoral_commission)}
                      </TableCell>
                      <TableCell>
                        {candidate.status === 'verified' ? (
                          <Chip icon={<CheckCircleIcon />} label="Fully Verified" color="success" size="small" />
                        ) : candidate.status === 'rejected' ? (
                          <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />
                        ) : (
                          <Chip icon={<HourglassEmptyIcon />} label="Pending Verification" color="warning" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Verification Details">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenVettingDialog(candidate)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Polling Stations</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Add Polling Station
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Station Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Region/Province</TableCell>
                    <TableCell>Officer in Charge</TableCell>
                    <TableCell>Expected Voters</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockPollingStations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell>{station.station_name}</TableCell>
                      <TableCell>{station.location}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{station.region} Region</Typography>
                        <Typography variant="caption" color="text.secondary">{station.province}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{station.officer_in_charge}</Typography>
                        <Typography variant="caption" color="text.secondary">{station.contact_number}</Typography>
                      </TableCell>
                      <TableCell>{station.expected_voters.toLocaleString()}</TableCell>
                      <TableCell>
                        {getElectionStatusChip(station.status)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Election Results</Typography>
            {selectedElection.status === 'completed' ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Election Summary</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2"><strong>Total Eligible Voters:</strong> 4,300</Typography>
                          <Typography variant="body2"><strong>Total Votes Cast:</strong> 3,225</Typography>
                          <Typography variant="body2"><strong>Voter Turnout:</strong> 75%</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2"><strong>Election Date:</strong> {new Date(selectedElection.election_date).toLocaleDateString()}</Typography>
                          <Typography variant="body2"><strong>Positions Filled:</strong> 15/15</Typography>
                          <Typography variant="body2"><strong>Declaration Date:</strong> {new Date(selectedElection.election_date).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ mr: 1 }}>
                              Download Results
                            </Button>
                            <Button variant="outlined" startIcon={<PrintIcon />}>
                              Print Report
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Elected Candidates</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Position</TableCell>
                          <TableCell>Elected Candidate</TableCell>
                          <TableCell>Votes Received</TableCell>
                          <TableCell>Percentage</TableCell>
                          <TableCell>Declaration Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>National President</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>JS</Avatar>
                              <Typography>John Smith</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>1,845</TableCell>
                          <TableCell>57.2%</TableCell>
                          <TableCell>
                            <Chip label="Declared" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>National Vice President</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>MJ</Avatar>
                              <Typography>Mary Johnson</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>1,650</TableCell>
                          <TableCell>51.2%</TableCell>
                          <TableCell>
                            <Chip label="Declared" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>National Treasurer</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>PW</Avatar>
                              <Typography>Peter Williams</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>1,730</TableCell>
                          <TableCell>53.6%</TableCell>
                          <TableCell>
                            <Chip label="Declared" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info">
                Election results will be available after the election is completed.
              </Alert>
            )}
          </TabPanel>
        </>
      )}
      
      {/* Import Nominations Dialog */}
      <Dialog open={openImportDialog} onClose={handleCloseImportDialog} maxWidth="md" fullWidth>
        <DialogTitle>Import Candidate Nominations</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Nominations File
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload a spreadsheet containing candidate nominations. The file must follow the required format.
              You can download the template below.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Download Template
              </Button>
            </Box>
            
            <FileDropzone
              accept={{
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'text/csv': ['.csv']
              }}
              maxFiles={1}
              maxSize={10485760} // 10MB
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Import Options</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Import Mode</InputLabel>
                <Select
                  label="Import Mode"
                  defaultValue="add"
                >
                  <MenuItem value="add">Add New Nominations Only</MenuItem>
                  <MenuItem value="update">Update Existing & Add New</MenuItem>
                  <MenuItem value="replace">Replace All Nominations</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Verification Status</InputLabel>
                <Select
                  label="Verification Status"
                  defaultValue="pending"
                >
                  <MenuItem value="pending">Set All as Pending Verification</MenuItem>
                  <MenuItem value="auto">Auto-Verify Based on Membership Data</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Data Validation</Typography>
              <Typography variant="body2" color="text.secondary">
                The system will validate all nominations against the membership database and check for eligibility.
                Any issues found will be reported after import.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
          >
            Import Nominations
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Candidate Vetting Dialog */}
      <Dialog open={openVettingDialog} onClose={handleCloseVettingDialog} maxWidth="md" fullWidth>
        {selectedCandidate && (
          <>
            <DialogTitle>
              Candidate Verification - {selectedCandidate.first_name} {selectedCandidate.last_name}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={selectedCandidate.photo} 
                    alt={`${selectedCandidate.first_name} ${selectedCandidate.last_name}`}
                    sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                  >
                    {selectedCandidate.first_name.charAt(0)}{selectedCandidate.last_name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedCandidate.first_name} {selectedCandidate.last_name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{selectedCandidate.position_name}</Typography>
                  <Chip 
                    label={selectedCandidate.gender} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom><strong>Candidate Information</strong></Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Membership Number:</strong> {selectedCandidate.membership_number}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Member Since:</strong> {new Date(selectedCandidate.membership_start_date).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Branch:</strong> {selectedCandidate.branch}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Region:</strong> {selectedCandidate.region}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Province:</strong> {selectedCandidate.province}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>District:</strong> {selectedCandidate.district}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Email:</strong> {selectedCandidate.email}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2"><strong>Phone:</strong> {selectedCandidate.phone}</Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom><strong>Verification Status</strong></Typography>
                  <Stepper orientation="vertical" sx={{ mt: 2 }}>
                    <Step active={true} completed={selectedCandidate.verification_status.registrar === 'approved'}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            {selectedCandidate.verification_status.registrar === 'approved' ? 'Approved on 2025-05-20' : 
                             selectedCandidate.verification_status.registrar === 'rejected' ? 'Rejected on 2025-05-20' : 
                             'Pending verification'}
                          </Typography>
                        }
                      >
                        Industrial Registrar Verification
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Verification Decision</InputLabel>
                            <Select
                              label="Verification Decision"
                              defaultValue={selectedCandidate.verification_status.registrar}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label="Comments"
                            multiline
                            rows={2}
                            margin="normal"
                            placeholder="Enter verification comments or reasons for rejection..."
                          />
                          <Box sx={{ mt: 1 }}>
                            <Button variant="contained" sx={{ mr: 1 }}>
                              Save Decision
                            </Button>
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                    <Step active={selectedCandidate.verification_status.registrar === 'approved'} completed={selectedCandidate.verification_status.deputy_registrar === 'approved'}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            {selectedCandidate.verification_status.deputy_registrar === 'approved' ? 'Approved on 2025-05-21' : 
                             selectedCandidate.verification_status.deputy_registrar === 'rejected' ? 'Rejected on 2025-05-21' : 
                             'Pending verification'}
                          </Typography>
                        }
                      >
                        Deputy Registrar Verification
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Verification Decision</InputLabel>
                            <Select
                              label="Verification Decision"
                              defaultValue={selectedCandidate.verification_status.deputy_registrar}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label="Comments"
                            multiline
                            rows={2}
                            margin="normal"
                            placeholder="Enter verification comments or reasons for rejection..."
                          />
                          <Box sx={{ mt: 1 }}>
                            <Button variant="contained" sx={{ mr: 1 }}>
                              Save Decision
                            </Button>
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                    <Step active={selectedCandidate.verification_status.deputy_registrar === 'approved'} completed={selectedCandidate.verification_status.oir_officer === 'approved'}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            {selectedCandidate.verification_status.oir_officer === 'approved' ? 'Approved on 2025-05-22' : 
                             selectedCandidate.verification_status.oir_officer === 'rejected' ? 'Rejected on 2025-05-22' : 
                             'Pending verification'}
                          </Typography>
                        }
                      >
                        OIR Officer Verification
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Verification Decision</InputLabel>
                            <Select
                              label="Verification Decision"
                              defaultValue={selectedCandidate.verification_status.oir_officer}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label="Comments"
                            multiline
                            rows={2}
                            margin="normal"
                            placeholder="Enter verification comments or reasons for rejection..."
                          />
                          <Box sx={{ mt: 1 }}>
                            <Button variant="contained" sx={{ mr: 1 }}>
                              Save Decision
                            </Button>
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                    <Step active={selectedCandidate.verification_status.oir_officer === 'approved'} completed={selectedCandidate.verification_status.electoral_commission === 'approved'}>
                      <StepLabel
                        optional={
                          <Typography variant="caption">
                            {selectedCandidate.verification_status.electoral_commission === 'approved' ? 'Approved on 2025-05-23' : 
                             selectedCandidate.verification_status.electoral_commission === 'rejected' ? 'Rejected on 2025-05-23' : 
                             'Pending verification'}
                          </Typography>
                        }
                      >
                        Electoral Commission ARO Verification
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Verification Decision</InputLabel>
                            <Select
                              label="Verification Decision"
                              defaultValue={selectedCandidate.verification_status.electoral_commission}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label="Comments"
                            multiline
                            rows={2}
                            margin="normal"
                            placeholder="Enter verification comments or reasons for rejection..."
                          />
                          <Box sx={{ mt: 1 }}>
                            <Button variant="contained" sx={{ mr: 1 }}>
                              Save Decision
                            </Button>
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                  </Stepper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVettingDialog}>Close</Button>
              {selectedCandidate.verification_status.registrar === 'approved' &&
               selectedCandidate.verification_status.deputy_registrar === 'approved' &&
               selectedCandidate.verification_status.oir_officer === 'approved' &&
               selectedCandidate.verification_status.electoral_commission === 'approved' && (
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<CheckCircleIcon />}
                >
                  Finalize Approval
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Quorum Calculator Dialog */}
      <Dialog open={openQuorumCalculator} onClose={handleCloseQuorumCalculator} maxWidth="sm" fullWidth>
        <DialogTitle>Election Quorum Calculator</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Use this calculator to determine if the quorum requirements are met for the election.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Eligible Voters"
                type="number"
                value={eligibleVoters}
                onChange={(e) => setEligibleVoters(parseInt(e.target.value) || 0)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Actual Voters Present"
                type="number"
                value={actualVoters}
                onChange={(e) => setActualVoters(parseInt(e.target.value) || 0)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required Percentage for Quorum"
                type="number"
                value={quorumPercentage}
                onChange={(e) => setQuorumPercentage(parseInt(e.target.value) || 0)}
                margin="normal"
                InputProps={{
                  endAdornment: <Typography>%</Typography>
                }}
              />
            </Grid>
          </Grid>
          
          {eligibleVoters > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Results</Typography>
              <Typography variant="body1">
                <strong>Turnout Percentage:</strong> {calculateQuorum().percentage}%
              </Typography>
              <Typography variant="body1">
                <strong>Quorum Status:</strong>{' '}
                {calculateQuorum().isMet ? (
                  <Chip icon={<CheckCircleIcon />} label="Quorum Met" color="success" size="small" />
                ) : (
                  <Chip icon={<CancelIcon />} label="Quorum Not Met" color="error" size="small" />
                )}
              </Typography>
              
              {!calculateQuorum().isMet && eligibleVoters > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  You need at least {Math.ceil(eligibleVoters * quorumPercentage / 100)} voters present to meet the quorum requirement.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuorumCalculator}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={eligibleVoters <= 0}
          >
            Save Results
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ElectionNominationSystem;

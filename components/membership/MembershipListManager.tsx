// Membership List Management Component for OIR Dashboard
// src/components/membership/MembershipListManager.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  InputAdornment,
  Autocomplete,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Tooltip,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  CompareArrows as CompareArrowsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDropzone } from 'react-dropzone';

// Mock data for demonstration
const mockOrganizations = [
  { id: 1, name: 'PNG Teachers Association', registrationNumber: 'IO-001' },
  { id: 2, name: 'Public Employees Association', registrationNumber: 'IO-002' },
  { id: 3, name: 'Maritime Workers Union', registrationNumber: 'IO-003' },
  { id: 4, name: 'Energy Workers Association', registrationNumber: 'IO-004' },
  { id: 5, name: 'National Academic Staff Association', registrationNumber: 'IO-101' }
];

const mockMembershipSubmissions = [
  {
    id: 1,
    submissionReference: 'ML-2025-00001',
    organizationId: 1,
    organizationName: 'PNG Teachers Association',
    submissionDate: '2025-05-01',
    totalMembers: 1250,
    newMembers: 75,
    removedMembers: 30,
    modifiedMembers: 45,
    status: 'approved',
    submittedBy: 'John Smith',
    errorCount: 0,
    warningCount: 0,
    approvalStatus: 'initial_review: approved, registrar_review: approved, deputy_registrar_review: approved, final_approval: approved'
  },
  {
    id: 2,
    submissionReference: 'ML-2025-00002',
    organizationId: 2,
    organizationName: 'Public Employees Association',
    submissionDate: '2025-05-10',
    totalMembers: 3200,
    newMembers: 120,
    removedMembers: 85,
    modifiedMembers: 65,
    status: 'under_review',
    submittedBy: 'Mary Johnson',
    errorCount: 0,
    warningCount: 3,
    approvalStatus: 'initial_review: approved, registrar_review: pending, deputy_registrar_review: pending, final_approval: pending'
  },
  {
    id: 3,
    submissionReference: 'ML-2025-00003',
    organizationId: 3,
    organizationName: 'Maritime Workers Union',
    submissionDate: '2025-05-15',
    totalMembers: 850,
    newMembers: 35,
    removedMembers: 20,
    modifiedMembers: 15,
    status: 'submitted',
    submittedBy: 'Robert Brown',
    errorCount: 5,
    warningCount: 12,
    approvalStatus: 'initial_review: pending, registrar_review: pending, deputy_registrar_review: pending, final_approval: pending'
  },
  {
    id: 4,
    submissionReference: 'ML-2025-00004',
    organizationId: 4,
    organizationName: 'Energy Workers Association',
    submissionDate: '2025-05-20',
    totalMembers: 1100,
    newMembers: 0,
    removedMembers: 0,
    modifiedMembers: 1100,
    status: 'rejected',
    submittedBy: 'Sarah Wilson',
    errorCount: 25,
    warningCount: 40,
    approvalStatus: 'initial_review: rejected, registrar_review: pending, deputy_registrar_review: pending, final_approval: pending'
  }
];

const mockMembershipItems = [
  {
    id: 1,
    submissionId: 3,
    memberId: 'MWU-001',
    firstName: 'James',
    lastName: 'Wilson',
    middleName: 'Robert',
    gender: 'Male',
    dateOfBirth: '1985-06-15',
    nationalId: 'PNG12345678',
    employmentId: 'EMP-001',
    position: 'Ship Engineer',
    department: 'Engineering',
    employmentDate: '2010-03-01',
    membershipStartDate: '2010-04-01',
    contactNumber: '+675 7123 4567',
    email: 'james.wilson@example.com',
    address: '123 Harbor Road',
    province: 'National Capital District',
    district: 'Port Moresby',
    changeType: 'new',
    validationStatus: 'valid',
    validationMessage: ''
  },
  {
    id: 2,
    submissionId: 3,
    memberId: 'MWU-002',
    firstName: 'Michael',
    lastName: 'Brown',
    middleName: '',
    gender: 'Male',
    dateOfBirth: '1978-09-22',
    nationalId: 'PNG23456789',
    employmentId: 'EMP-002',
    position: 'Captain',
    department: 'Operations',
    employmentDate: '2005-07-15',
    membershipStartDate: '2005-08-01',
    contactNumber: '+675 7234 5678',
    email: 'michael.brown@example.com',
    address: '456 Seaside Avenue',
    province: 'National Capital District',
    district: 'Port Moresby',
    changeType: 'existing',
    validationStatus: 'valid',
    validationMessage: ''
  },
  {
    id: 3,
    submissionId: 3,
    memberId: 'MWU-003',
    firstName: 'Sarah',
    lastName: 'Johnson',
    middleName: 'Elizabeth',
    gender: 'Female',
    dateOfBirth: '1990-03-10',
    nationalId: '',
    employmentId: 'EMP-003',
    position: 'Logistics Coordinator',
    department: 'Logistics',
    employmentDate: '2015-11-05',
    membershipStartDate: '2015-12-01',
    contactNumber: '+675 7345 6789',
    email: 'sarah.johnson@example.com',
    address: '789 Port Road',
    province: 'National Capital District',
    district: 'Port Moresby',
    changeType: 'new',
    validationStatus: 'warning',
    validationMessage: 'Missing National ID'
  },
  {
    id: 4,
    submissionId: 3,
    memberId: 'MWU-004',
    firstName: 'David',
    lastName: 'Smith',
    middleName: '',
    gender: 'Male',
    dateOfBirth: '1982-12-05',
    nationalId: 'PNG34567890',
    employmentId: 'EMP-004',
    position: 'Maintenance Technician',
    department: 'Maintenance',
    employmentDate: '2012-06-20',
    membershipStartDate: '2012-07-01',
    contactNumber: '+675 7456 7890',
    email: 'david.smith@example.com',
    address: '101 Dock Street',
    province: 'National Capital District',
    district: 'Port Moresby',
    changeType: 'modified',
    validationStatus: 'valid',
    validationMessage: ''
  },
  {
    id: 5,
    submissionId: 3,
    memberId: 'MWU-005',
    firstName: 'Emily',
    lastName: 'Davis',
    middleName: 'Marie',
    gender: 'Female',
    dateOfBirth: '1988-07-30',
    nationalId: 'PNG45678901',
    employmentId: 'EMP-005',
    position: 'Administrative Assistant',
    department: 'Administration',
    employmentDate: '2018-02-15',
    membershipStartDate: '2018-03-01',
    contactNumber: '+675 7567 8901',
    email: 'emily.davis@example.com',
    address: '202 Harbor View',
    province: 'National Capital District',
    district: 'Port Moresby',
    changeType: 'new',
    validationStatus: 'error',
    validationMessage: 'Duplicate email address'
  }
];

const mockValidationIssues = [
  {
    id: 1,
    submissionId: 3,
    listItemId: 3,
    issueType: 'missing_data',
    fieldName: 'nationalId',
    description: 'National ID is missing',
    severity: 'warning',
    resolved: false
  },
  {
    id: 2,
    submissionId: 3,
    listItemId: 5,
    issueType: 'duplicate',
    fieldName: 'email',
    description: 'Email address already exists in the system',
    severity: 'error',
    resolved: false
  },
  {
    id: 3,
    submissionId: 3,
    listItemId: null,
    issueType: 'inconsistent_data',
    fieldName: null,
    description: 'Total member count does not match the number of records in the file',
    severity: 'warning',
    resolved: false
  }
];

const mockApprovalWorkflow = [
  {
    submissionId: 3,
    approvalStep: 'initial_review',
    status: 'pending',
    assignedTo: 'Gilbert Papole',
    actionBy: null,
    actionDate: null,
    comments: null
  },
  {
    submissionId: 3,
    approvalStep: 'registrar_review',
    status: 'pending',
    assignedTo: 'Natasha Utubasi',
    actionBy: null,
    actionDate: null,
    comments: null
  },
  {
    submissionId: 3,
    approvalStep: 'deputy_registrar_review',
    status: 'pending',
    assignedTo: 'Paul Wartovo',
    actionBy: null,
    actionDate: null,
    comments: null
  },
  {
    submissionId: 3,
    approvalStep: 'final_approval',
    status: 'pending',
    assignedTo: 'Natasha Utubasi',
    actionBy: null,
    actionDate: null,
    comments: null
  }
];

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
      id={`membership-tabpanel-${index}`}
      aria-labelledby={`membership-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MembershipListManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [filteredSubmissions, setFilteredSubmissions] = useState(mockMembershipSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [openSubmissionDetail, setOpenSubmissionDetail] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [openMemberDetail, setOpenMemberDetail] = useState(false);
  const [validationFilter, setValidationFilter] = useState('all');
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedOrganization(null);
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleUpload = () => {
    if (!selectedOrganization) {
      setSnackbarMessage('Please select an organization');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (!uploadedFile) {
      setSnackbarMessage('Please upload a file');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    // Simulate file upload and processing
    setIsUploading(true);
    const timer = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          
          // Simulate successful upload
          setSnackbarMessage('Membership list uploaded and processed successfully');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          handleCloseUploadDialog();
          
          return 0;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Filter submissions based on search term and date range
    let filtered = [...mockMembershipSubmissions];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(submission => 
        submission.submissionReference.toLowerCase().includes(term) ||
        submission.organizationName.toLowerCase().includes(term) ||
        submission.submittedBy.toLowerCase().includes(term)
      );
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(submission => 
        new Date(submission.submissionDate) >= dateRange.start!
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(submission => 
        new Date(submission.submissionDate) <= dateRange.end!
      );
    }
    
    setFilteredSubmissions(filtered);
  }, [searchTerm, dateRange]);

  const handleViewSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setOpenSubmissionDetail(true);
  };

  const handleCloseSubmissionDetail = () => {
    setOpenSubmissionDetail(false);
    setSelectedSubmission(null);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewComments('');
    setReviewAction('');
  };

  const handleSubmitReview = () => {
    if (!reviewAction) {
      setSnackbarMessage('Please select an action');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    // In a real app, this would send the review to the API
    setSnackbarMessage(`Review ${reviewAction} successfully`);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    handleCloseReviewDialog();
    
    // Move to next step if approved
    if (reviewAction === 'approved') {
      handleNext();
    } else {
      handleCloseSubmissionDetail();
    }
  };

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setOpenMemberDetail(true);
  };

  const handleCloseMemberDetail = () => {
    setOpenMemberDetail(false);
    setSelectedMember(null);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Chip label="Submitted" color="primary" size="small" />;
      case 'under_review':
        return <Chip label="Under Review" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getValidationStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'pending':
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getChangeTypeChip = (type: string) => {
    switch (type) {
      case 'new':
        return <Chip label="New" color="success" size="small" />;
      case 'existing':
        return <Chip label="Existing" color="primary" size="small" />;
      case 'modified':
        return <Chip label="Modified" color="warning" size="small" />;
      case 'removed':
        return <Chip label="Removed" color="error" size="small" />;
      default:
        return <Chip label={type} size="small" />;
    }
  };

  const getFilteredMembers = () => {
    let filtered = [...mockMembershipItems];
    
    if (validationFilter !== 'all') {
      filtered = filtered.filter(member => member.validationStatus === validationFilter);
    }
    
    if (changeTypeFilter !== 'all') {
      filtered = filtered.filter(member => member.changeType === changeTypeFilter);
    }
    
    return filtered;
  };

  const getApprovalSteps = () => {
    return [
      {
        label: 'Initial Review',
        description: 'Initial validation and review by OIR staff',
        status: mockApprovalWorkflow[0].status,
        assignedTo: mockApprovalWorkflow[0].assignedTo
      },
      {
        label: 'Registrar Review',
        description: 'Review by the Industrial Registrar',
        status: mockApprovalWorkflow[1].status,
        assignedTo: mockApprovalWorkflow[1].assignedTo
      },
      {
        label: 'Deputy Registrar Review',
        description: 'Review by the Deputy Industrial Registrar',
        status: mockApprovalWorkflow[2].status,
        assignedTo: mockApprovalWorkflow[2].assignedTo
      },
      {
        label: 'Final Approval',
        description: 'Final approval by the Industrial Registrar',
        status: mockApprovalWorkflow[3].status,
        assignedTo: mockApprovalWorkflow[3].assignedTo
      }
    ];
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Membership List Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="membership management tabs">
            <Tab label="Submissions" id="membership-tab-0" aria-controls="membership-tabpanel-0" />
            <Tab label="Statistics" id="membership-tab-1" aria-controls="membership-tabpanel-1" />
            <Tab label="Reports" id="membership-tab-2" aria-controls="membership-tabpanel-2" />
          </Tabs>
        </Box>
        
        {/* Submissions Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleOpenUploadDialog}
            >
              Upload Membership List
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <DatePicker
                label="From Date"
                value={dateRange.start}
                onChange={(date) => setDateRange({...dateRange, start: date})}
                slotProps={{ textField: { size: 'small' } }}
              />
              
              <DatePicker
                label="To Date"
                value={dateRange.end}
                onChange={(date) => setDateRange({...dateRange, end: date})}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Total Members</TableCell>
                  <TableCell>Changes</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Issues</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.submissionReference}</TableCell>
                    <TableCell>{submission.organizationName}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>{submission.totalMembers}</TableCell>
                    <TableCell>
                      <Tooltip title={`New: ${submission.newMembers}, Modified: ${submission.modifiedMembers}, Removed: ${submission.removedMembers}`}>
                        <Box>
                          +{submission.newMembers} / ~{submission.modifiedMembers} / -{submission.removedMembers}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getStatusChip(submission.status)}</TableCell>
                    <TableCell>
                      {submission.errorCount > 0 && (
                        <Tooltip title={`${submission.errorCount} errors`}>
                          <Badge badgeContent={submission.errorCount} color="error" sx={{ mr: 1 }}>
                            <ErrorIcon color="error" fontSize="small" />
                          </Badge>
                        </Tooltip>
                      )}
                      {submission.warningCount > 0 && (
                        <Tooltip title={`${submission.warningCount} warnings`}>
                          <Badge badgeContent={submission.warningCount} color="warning">
                            <WarningIcon color="warning" fontSize="small" />
                          </Badge>
                        </Tooltip>
                      )}
                      {submission.errorCount === 0 && submission.warningCount === 0 && (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewSubmission(submission)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                      {submission.status === 'approved' && (
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Statistics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Membership Growth
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Monthly membership changes across all organizations
                  </Typography>
                  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      [Membership Growth Chart]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Membership by Organization
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Distribution of members across organizations
                  </Typography>
                  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      [Membership Distribution Chart]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submission Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status of membership list submissions
                  </Typography>
                  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      [Submission Status Chart]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Validation Issues
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Common validation issues in membership lists
                  </Typography>
                  <Box sx={{ height: 300, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      [Validation Issues Chart]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Membership Summary Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a summary report of all union memberships.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<DownloadIcon />}>
                    Generate Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Membership Changes Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of membership changes over time.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<DownloadIcon />}>
                    Generate Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submission Compliance Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of membership list submission compliance.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<DownloadIcon />}>
                    Generate Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Validation Issues Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of validation issues in membership lists.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button startIcon={<DownloadIcon />}>
                    Generate Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Upload Dialog */}
        <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
          <DialogTitle>Upload Membership List</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={mockOrganizations}
                  getOptionLabel={(option) => `${option.name} (${option.registrationNumber})`}
                  value={selectedOrganization}
                  onChange={(event, newValue) => {
                    setSelectedOrganization(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Organization" required />}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.400',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper',
                    cursor: 'pointer'
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  {isDragActive ? (
                    <Typography>Drop the file here...</Typography>
                  ) : (
                    <>
                      <Typography variant="body1" gutterBottom>
                        Drag and drop a file here, or click to select a file
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Supported formats: CSV, Excel (XLS, XLSX), PDF
                      </Typography>
                    </>
                  )}
                  {uploadedFile && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Selected file: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(2)} KB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              {isUploading && (
                <Grid item xs={12}>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      {uploadProgress < 100 ? 'Uploading and processing...' : 'Processing complete!'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUploadDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleUpload}
              disabled={!selectedOrganization || !uploadedFile || isUploading}
              startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Submission Detail Dialog */}
        <Dialog open={openSubmissionDetail} onClose={handleCloseSubmissionDetail} maxWidth="lg" fullWidth>
          {selectedSubmission && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Membership List: {selectedSubmission.submissionReference}</Typography>
                  {getStatusChip(selectedSubmission.status)}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Organization:</strong> {selectedSubmission.organizationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Submission Date:</strong> {selectedSubmission.submissionDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Submitted By:</strong> {selectedSubmission.submittedBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total Members:</strong> {selectedSubmission.totalMembers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Changes:</strong> +{selectedSubmission.newMembers} new, ~{selectedSubmission.modifiedMembers} modified, -{selectedSubmission.removedMembers} removed
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Issues:</strong> {selectedSubmission.errorCount} errors, {selectedSubmission.warningCount} warnings
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Stepper activeStep={activeStep} orientation="vertical">
                        {getApprovalSteps().map((step, index) => (
                          <Step key={step.label}>
                            <StepLabel
                              optional={
                                <Typography variant="caption">
                                  Assigned to: {step.assignedTo}
                                </Typography>
                              }
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {step.label}
                                {step.status === 'approved' && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                                {step.status === 'rejected' && <CancelIcon color="error" sx={{ ml: 1 }} />}
                              </Box>
                            </StepLabel>
                            <StepContent>
                              <Typography>{step.description}</Typography>
                              <Box sx={{ mb: 2 }}>
                                <div>
                                  <Button
                                    variant="contained"
                                    onClick={handleOpenReviewDialog}
                                    sx={{ mt: 1, mr: 1 }}
                                  >
                                    Review
                                  </Button>
                                  <Button
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                  >
                                    Back
                                  </Button>
                                </div>
                              </Box>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Membership List
                    </Typography>
                    
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Validation Status</InputLabel>
                          <Select
                            value={validationFilter}
                            onChange={(e) => setValidationFilter(e.target.value)}
                            label="Validation Status"
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="valid">Valid</MenuItem>
                            <MenuItem value="warning">Warnings</MenuItem>
                            <MenuItem value="error">Errors</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Change Type</InputLabel>
                          <Select
                            value={changeTypeFilter}
                            onChange={(e) => setChangeTypeFilter(e.target.value)}
                            label="Change Type"
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="existing">Existing</MenuItem>
                            <MenuItem value="modified">Modified</MenuItem>
                            <MenuItem value="removed">Removed</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      
                      <TextField
                        size="small"
                        placeholder="Search members..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Member ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Change Type</TableCell>
                            <TableCell>Validation</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getFilteredMembers().map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>{member.memberId}</TableCell>
                              <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                              <TableCell>{member.position}</TableCell>
                              <TableCell>{member.department}</TableCell>
                              <TableCell>{getChangeTypeChip(member.changeType)}</TableCell>
                              <TableCell>
                                <Tooltip title={member.validationMessage || 'Valid'}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getValidationStatusIcon(member.validationStatus)}
                                  </Box>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <IconButton size="small" onClick={() => handleViewMember(member)}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          {getFilteredMembers().length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No members found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Validation Issues
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Issue Type</TableCell>
                            <TableCell>Field</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mockValidationIssues.map((issue) => (
                            <TableRow key={issue.id}>
                              <TableCell>{issue.issueType.replace('_', ' ')}</TableCell>
                              <TableCell>{issue.fieldName || 'N/A'}</TableCell>
                              <TableCell>{issue.description}</TableCell>
                              <TableCell>
                                {issue.severity === 'error' && <Chip label="Error" color="error" size="small" />}
                                {issue.severity === 'warning' && <Chip label="Warning" color="warning" size="small" />}
                                {issue.severity === 'info' && <Chip label="Info" color="info" size="small" />}
                              </TableCell>
                              <TableCell>
                                {issue.resolved ? (
                                  <Chip label="Resolved" color="success" size="small" />
                                ) : (
                                  <Chip label="Unresolved" color="default" size="small" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          {mockValidationIssues.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                No validation issues found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSubmissionDetail}>Close</Button>
                <Button 
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
                {selectedSubmission.status === 'submitted' && (
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={handleOpenReviewDialog}
                  >
                    Review
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
        
        {/* Review Dialog */}
        <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
          <DialogTitle>Review Membership List</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please review the membership list and provide your decision.
            </DialogContentText>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={reviewAction}
                onChange={(e) => setReviewAction(e.target.value)}
                label="Action"
              >
                <MenuItem value="approved">Approve</MenuItem>
                <MenuItem value="rejected">Reject</MenuItem>
                <MenuItem value="needs_revision">Request Revision</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Comments"
              fullWidth
              multiline
              rows={4}
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReviewDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitReview}
              disabled={!reviewAction}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Member Detail Dialog */}
        <Dialog open={openMemberDetail} onClose={handleCloseMemberDetail} maxWidth="md">
          {selectedMember && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Member Details: {selectedMember.memberId}</Typography>
                  {getChangeTypeChip(selectedMember.changeType)}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>First Name:</strong> {selectedMember.firstName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Last Name:</strong> {selectedMember.lastName}
                    </Typography>
                    {selectedMember.middleName && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Middle Name:</strong> {selectedMember.middleName}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Gender:</strong> {selectedMember.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date of Birth:</strong> {selectedMember.dateOfBirth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>National ID:</strong> {selectedMember.nationalId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Position:</strong> {selectedMember.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Department:</strong> {selectedMember.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Employment ID:</strong> {selectedMember.employmentId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Employment Date:</strong> {selectedMember.employmentDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Membership Start Date:</strong> {selectedMember.membershipStartDate}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Contact Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Contact Number:</strong> {selectedMember.contactNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {selectedMember.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {selectedMember.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Province:</strong> {selectedMember.province}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>District:</strong> {selectedMember.district}
                    </Typography>
                  </Grid>
                  
                  {selectedMember.validationStatus !== 'valid' && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Validation Issues
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Alert severity={selectedMember.validationStatus === 'warning' ? 'warning' : 'error'}>
                          {selectedMember.validationMessage}
                        </Alert>
                      </Grid>
                    </>
                  )}
                  
                  {selectedMember.changeType === 'modified' && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Changes
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Field</TableCell>
                                <TableCell>Previous Value</TableCell>
                                <TableCell>New Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Position</TableCell>
                                <TableCell>Maintenance Assistant</TableCell>
                                <TableCell>Maintenance Technician</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Contact Number</TableCell>
                                <TableCell>+675 7456 1234</TableCell>
                                <TableCell>+675 7456 7890</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMemberDetail}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default MembershipListManager;

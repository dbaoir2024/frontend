// Enhanced React component for Document Management with Union Profile
// src/components/documents/EnhancedDocumentManager.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
  Breadcrumbs,
  Link,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  FindInPage as FindInPageIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  MoreVert as MoreVertIcon,
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachFile as AttachFileIcon,
  Fullscreen as FullscreenIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { RootState } from '../../app/store';
import { formatDate, formatFileSize } from '../../utils/formatUtils';
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
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
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

const EnhancedDocumentManager: React.FC = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openVersionDialog, setOpenVersionDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentDirectory, setCurrentDirectory] = useState<string>('');
  const [searchMode, setSearchMode] = useState<string>('basic');
  const [enableOcr, setEnableOcr] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>('grid');
  
  // Mock data for demonstration
  const documentCategories = [
    { id: 'GEN', name: 'General Matters', code: '0' },
    { id: 'APP', name: 'Application For Registration', code: '1' },
    { id: 'CERT', name: 'Registration Certificate', code: '2' },
    { id: 'RULES', name: 'Rules and Constitution', code: '3' },
    { id: 'MEM', name: 'Financial Membership List', code: '4' },
    { id: 'ELECT', name: 'Election of Office Bearers', code: '5' },
    { id: 'BALLOT', name: 'Secret Ballots', code: '6' },
    { id: 'FIN', name: 'Financial Returns', code: '7' },
    { id: 'INSP', name: 'Inspection Reports', code: '9' },
    { id: 'GS', name: 'General Secretary Appointments', code: '10' },
    { id: 'WELF', name: 'Welfare Funds', code: '11' }
  ];
  
  const mockOrganizations = [
    { 
      id: 1, 
      registration_number: 'IO-101', 
      organization_name: 'National Academic Staff Association of the University of PNG',
      logo: 'https://example.com/logos/nasa_upng.png',
      established_date: '1977-07-31',
      status: 'active',
      member_count: 350,
      sector: 'Education',
      address: 'University of Papua New Guinea, Waigani, Papua New Guinea',
      contact_person: 'Dr. John Smith',
      email: 'nasa@upng.ac.pg',
      phone: '+675 326 7200'
    },
    { 
      id: 2, 
      registration_number: 'IO-102', 
      organization_name: 'PNG Teachers Association',
      logo: 'https://example.com/logos/pngta.png',
      established_date: '1970-05-15',
      status: 'active',
      member_count: 25000,
      sector: 'Education',
      address: 'P.O. Box 1393, Boroko, NCD, Papua New Guinea',
      contact_person: 'Mary Johnson',
      email: 'info@pngta.org.pg',
      phone: '+675 325 3315'
    },
    { 
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
    }
  ];
  
  const mockDocuments = [
    {
      id: 1,
      organization_id: 3,
      category_id: 'RULES',
      document_number: 'IO-142-3',
      file_name: 'constitution_2023.pdf',
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2023.pdf',
      file_type: 'application/pdf',
      file_size: 2457600,
      description: 'Updated constitution approved in 2023',
      upload_date: '2023-05-15T10:30:00Z',
      version: 2,
      status: 'active',
      metadata: {
        title: 'Constitution of PNG Maritime Workers Industrial Union',
        author: 'Executive Committee',
        keywords: ['constitution', 'rules', 'maritime', 'workers', 'union'],
        created_date: '2023-04-10',
        modified_date: '2023-05-12',
        pages: 42
      },
      ocr_content: 'Constitution of PNG Maritime Workers Industrial Union...'
    },
    {
      id: 2,
      organization_id: 3,
      category_id: 'MEM',
      document_number: 'IO-142-4',
      file_name: 'membership_list_2025.xlsx',
      file_path: '/data/unions/IO-142/4_Financial_Membership_List/membership_list_2025.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_size: 1548800,
      description: 'Current financial membership list for 2025',
      upload_date: '2025-01-10T14:45:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'Financial Membership List 2025',
        author: 'General Secretary',
        keywords: ['members', 'financial', 'dues', 'maritime'],
        created_date: '2025-01-05',
        modified_date: '2025-01-10',
        rows: 12568
      }
    },
    {
      id: 3,
      organization_id: 3,
      category_id: 'ELECT',
      document_number: 'IO-142-5',
      file_name: 'election_results_2024.pdf',
      file_path: '/data/unions/IO-142/5_Election_of_Office_Bearers/election_results_2024.pdf',
      file_type: 'application/pdf',
      file_size: 1024000,
      description: 'Results of the 2024 executive election',
      upload_date: '2024-06-22T09:15:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'Election Results 2024',
        author: 'Electoral Commission',
        keywords: ['election', 'results', 'executive', 'officers'],
        created_date: '2024-06-20',
        modified_date: '2024-06-22',
        pages: 15
      },
      ocr_content: 'PNG Maritime Workers Industrial Union Election Results 2024...'
    },
    {
      id: 4,
      organization_id: 3,
      category_id: 'FIN',
      document_number: 'IO-142-7',
      file_name: 'financial_return_2024.pdf',
      file_path: '/data/unions/IO-142/7_Financial_Returns/financial_return_2024.pdf',
      file_type: 'application/pdf',
      file_size: 3145728,
      description: 'Annual financial return for 2024',
      upload_date: '2025-02-28T16:20:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'Financial Return 2024',
        author: 'Treasurer',
        keywords: ['financial', 'return', 'annual', 'audit'],
        created_date: '2025-02-25',
        modified_date: '2025-02-28',
        pages: 28
      },
      ocr_content: 'PNG Maritime Workers Industrial Union Financial Return 2024...'
    },
    {
      id: 5,
      organization_id: 3,
      category_id: 'INSP',
      document_number: 'IO-142-9',
      file_name: 'inspection_report_2025.pdf',
      file_path: '/data/unions/IO-142/9_Inspection_Reports/inspection_report_2025.pdf',
      file_type: 'application/pdf',
      file_size: 2097152,
      description: 'OIR inspection report from March 2025',
      upload_date: '2025-03-15T11:10:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'OIR Inspection Report 2025',
        author: 'Industrial Registrar',
        keywords: ['inspection', 'compliance', 'report', 'OIR'],
        created_date: '2025-03-12',
        modified_date: '2025-03-15',
        pages: 18
      },
      ocr_content: 'Office of the Industrial Registrar Inspection Report...'
    },
    {
      id: 6,
      organization_id: 3,
      category_id: 'APP',
      document_number: 'IO-142-1',
      file_name: 'original_application_1986.pdf',
      file_path: '/data/unions/IO-142/1_Application_For_Registration/original_application_1986.pdf',
      file_type: 'application/pdf',
      file_size: 1835008,
      description: 'Original application for registration from 1986',
      upload_date: '2020-10-05T09:30:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'Application for Registration',
        author: 'Founding Committee',
        keywords: ['application', 'registration', 'founding', 'maritime'],
        created_date: '1986-09-15',
        modified_date: '2020-10-05',
        pages: 24
      },
      ocr_content: 'Application for Registration of PNG Maritime Workers Industrial Union...'
    },
    {
      id: 7,
      organization_id: 3,
      category_id: 'CERT',
      document_number: 'IO-142-2',
      file_name: 'registration_certificate.pdf',
      file_path: '/data/unions/IO-142/2_Registration_Certificate/registration_certificate.pdf',
      file_type: 'application/pdf',
      file_size: 512000,
      description: 'Certificate of Registration',
      upload_date: '2020-10-05T09:35:00Z',
      version: 1,
      status: 'active',
      metadata: {
        title: 'Certificate of Registration',
        author: 'Office of the Industrial Registrar',
        keywords: ['certificate', 'registration', 'official', 'legal'],
        created_date: '1986-11-22',
        modified_date: '2020-10-05',
        pages: 1
      },
      ocr_content: 'Certificate of Registration - PNG Maritime Workers Industrial Union...'
    }
  ];
  
  const mockVersions = [
    {
      id: 1,
      document_id: 1,
      version: 1,
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2020.pdf',
      file_size: 2097152,
      modification_date: '2020-06-10T09:30:00Z',
      change_notes: 'Initial upload of constitution'
    },
    {
      id: 2,
      document_id: 1,
      version: 2,
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2023.pdf',
      file_size: 2457600,
      modification_date: '2023-05-15T10:30:00Z',
      change_notes: 'Updated with amendments approved at 2023 AGM'
    }
  ];

  useEffect(() => {
    // In a real application, this would fetch documents based on filters
    // For now, we're using mock data
    setSelectedOrganization(mockOrganizations[2]); // Default to IO-142
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
  };

  const handleOpenUploadDialog = (category: string) => {
    setSelectedCategory(category);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedCategory('');
  };

  const handleViewVersions = (document: any) => {
    setSelectedDocument(document);
    setOpenVersionDialog(true);
  };

  const handleCloseVersionDialog = () => {
    setOpenVersionDialog(false);
    setSelectedDocument(null);
  };

  const handleNavigateToDirectory = (category: string) => {
    setCategoryFilter(category);
    setCurrentDirectory(category);
  };

  const handleSearchModeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchMode(event.target.value as string);
  };

  const handleOcrToggle = () => {
    setEnableOcr(!enableOcr);
  };

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <PdfIcon color="error" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <DocIcon color="primary" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <ExcelIcon color="success" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon color="secondary" />;
    } else {
      return <FileIcon />;
    }
  };

  const getFilteredDocuments = () => {
    if (!selectedOrganization) return [];
    
    let filtered = mockDocuments.filter(doc => doc.organization_id === selectedOrganization.id);
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category_id === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      if (searchMode === 'basic') {
        filtered = filtered.filter(doc => 
          doc.file_name.toLowerCase().includes(query) || 
          doc.description.toLowerCase().includes(query) ||
          doc.document_number.toLowerCase().includes(query)
        );
      } else if (searchMode === 'metadata') {
        filtered = filtered.filter(doc => 
          doc.metadata?.title?.toLowerCase().includes(query) ||
          doc.metadata?.author?.toLowerCase().includes(query) ||
          doc.metadata?.keywords?.some((keyword: string) => keyword.toLowerCase().includes(query))
        );
      } else if (searchMode === 'ocr' && enableOcr) {
        filtered = filtered.filter(doc => 
          doc.ocr_content?.toLowerCase().includes(query)
        );
      } else if (searchMode === 'advanced') {
        filtered = filtered.filter(doc => 
          doc.file_name.toLowerCase().includes(query) || 
          doc.description.toLowerCase().includes(query) ||
          doc.document_number.toLowerCase().includes(query) ||
          doc.metadata?.title?.toLowerCase().includes(query) ||
          doc.metadata?.author?.toLowerCase().includes(query) ||
          doc.metadata?.keywords?.some((keyword: string) => keyword.toLowerCase().includes(query)) ||
          (enableOcr && doc.ocr_content?.toLowerCase().includes(query))
        );
      }
    }
    
    if (dateRangeStart) {
      filtered = filtered.filter(doc => new Date(doc.upload_date) >= dateRangeStart);
    }
    
    if (dateRangeEnd) {
      filtered = filtered.filter(doc => new Date(doc.upload_date) <= dateRangeEnd);
    }
    
    return filtered;
  };

  const renderBreadcrumbs = () => {
    const paths = [
      { name: 'Home', path: 'home' },
      { name: 'Documents', path: 'documents' }
    ];
    
    if (selectedOrganization) {
      paths.push({ 
        name: `${selectedOrganization.registration_number} - ${selectedOrganization.organization_name}`, 
        path: `org_${selectedOrganization.id}` 
      });
    }
    
    if (currentDirectory) {
      const category = documentCategories.find(c => c.id === currentDirectory);
      if (category) {
        paths.push({ 
          name: category.name, 
          path: `category_${category.id}` 
        });
      }
    }
    
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          return isLast ? (
            <Typography key={path.path} color="text.primary">
              {path.name}
            </Typography>
          ) : (
            <Link
              key={path.path}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (path.path.startsWith('category_')) {
                  const categoryId = path.path.replace('category_', '');
                  handleNavigateToDirectory(categoryId);
                } else if (path.path === 'documents') {
                  setCategoryFilter('all');
                  setCurrentDirectory('');
                }
              }}
            >
              {path.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  const renderUnionProfile = () => {
    if (!selectedOrganization) return null;
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={
            <Avatar 
              src={selectedOrganization.logo} 
              alt={selectedOrganization.organization_name}
              sx={{ width: 64, height: 64 }}
            >
              {selectedOrganization.organization_name.charAt(0)}
            </Avatar>
          }
          title={
            <Typography variant="h5">
              {selectedOrganization.organization_name}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              Registration Number: {selectedOrganization.registration_number}
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Established:</strong> {new Date(selectedOrganization.established_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {selectedOrganization.status.charAt(0).toUpperCase() + selectedOrganization.status.slice(1)}
              </Typography>
              <Typography variant="body2">
                <strong>Members:</strong> {selectedOrganization.member_count.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Sector:</strong> {selectedOrganization.sector}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Address:</strong> {selectedOrganization.address}
              </Typography>
              <Typography variant="body2">
                <strong>Contact Person:</strong> {selectedOrganization.contact_person}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedOrganization.email}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {selectedOrganization.phone}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Union Document Management</Typography>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Union</InputLabel>
          <Select
            value={selectedOrganization ? selectedOrganization.id : ''}
            onChange={(e) => {
              const orgId = e.target.value as number;
              const org = mockOrganizations.find(o => o.id === orgId);
              setSelectedOrganization(org);
              setCategoryFilter('all');
              setCurrentDirectory('');
            }}
            label="Select Union"
          >
            {mockOrganizations.map(org => (
              <MenuItem key={org.id} value={org.id}>
                {org.registration_number} - {org.organization_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedOrganization && (
        <>
          {renderUnionProfile()}
          
          {renderBreadcrumbs()}
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="document tabs" variant="scrollable" scrollButtons="auto">
              <Tab label="All Documents" />
              <Tab label="Document Explorer" />
              <Tab label="Recent Uploads" />
              <Tab label="Document Statistics" />
            </Tabs>
          </Box>
          
          <Box sx={{ mb: 3, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Documents"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search documents..."
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Advanced Search Options">
                          <IconButton size="small" onClick={() => {}}>
                            <FilterListIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Search Mode</InputLabel>
                  <Select
                    value={searchMode}
                    onChange={handleSearchModeChange}
                    label="Search Mode"
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="metadata">Metadata</MenuItem>
                    <MenuItem value="ocr">OCR Content</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {documentCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
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
              <Grid item xs={12} md={2}>
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableOcr}
                        onChange={handleOcrToggle}
                        color="primary"
                      />
                    }
                    label="Enable OCR Search"
                  />
                  <Box>
                    <Tooltip title="Grid View">
                      <IconButton 
                        color={viewMode === 'grid' ? 'primary' : 'default'} 
                        onClick={() => handleViewModeChange('grid')}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="List View">
                      <IconButton 
                        color={viewMode === 'list' ? 'primary' : 'default'} 
                        onClick={() => handleViewModeChange('list')}
                      >
                        <ViewListIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => handleOpenUploadDialog(categoryFilter !== 'all' ? categoryFilter : documentCategories[0].id)}
                      sx={{ ml: 2 }}
                    >
                      Upload New Document
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {viewMode === 'list' ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Number</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Version</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredDocuments().map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.document_number}</TableCell>
                        <TableCell>
                          {documentCategories.find(c => c.id === doc.category_id)?.name || doc.category_id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getFileIcon(doc.file_type)}
                            <Typography sx={{ ml: 1 }}>{doc.file_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{doc.description}</TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell>{new Date(doc.upload_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`v${doc.version}`} 
                            size="small" 
                            color={doc.version > 1 ? "primary" : "default"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" title="View Document">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Download">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          {doc.version > 1 && (
                            <IconButton 
                              size="small" 
                              title="View Version History"
                              onClick={() => handleViewVersions(doc)}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Grid container spacing={2}>
                {getFilteredDocuments().map((doc) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1, mr: 2 }}>
                            {getFileIcon(doc.file_type)}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" noWrap>
                              {doc.file_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {doc.document_number}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {doc.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="caption">
                            {formatFileSize(doc.file_size)}
                          </Typography>
                          <Typography variant="caption">
                            {new Date(doc.upload_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        <IconButton size="small" title="View Document">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title="Download">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        {doc.version > 1 ? (
                          <IconButton 
                            size="small" 
                            title="View Version History"
                            onClick={() => handleViewVersions(doc)}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton size="small" disabled>
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton size="small" title="More Options">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {documentCategories.map((category) => {
                const docs = mockDocuments.filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id);
                return (
                  <Grid item xs={12} md={4} key={category.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-4px)'
                        }
                      }}
                      onClick={() => handleNavigateToDirectory(category.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FolderIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">{category.name}</Typography>
                          </Box>
                          <Badge 
                            badgeContent={docs.length} 
                            color="primary"
                            showZero
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Document Number: {selectedOrganization.registration_number}-{category.code}
                        </Typography>
                        <List dense>
                          {docs.slice(0, 3).map((doc) => (
                            <ListItem key={doc.id} disablePadding>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getFileIcon(doc.file_type)}
                              </ListItemIcon>
                              <ListItemText 
                                primary={doc.file_name} 
                                secondary={`${new Date(doc.upload_date).toLocaleDateString()}`} 
                                primaryTypographyProps={{ noWrap: true }}
                                secondaryTypographyProps={{ noWrap: true }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToDirectory(category.id);
                            }}
                          >
                            Open Folder
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            startIcon={<UploadIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenUploadDialog(category.id);
                            }}
                          >
                            Upload
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Recent Document Uploads</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Number</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDocuments
                    .filter(doc => doc.organization_id === selectedOrganization.id)
                    .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
                    .slice(0, 10)
                    .map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.document_number}</TableCell>
                        <TableCell>
                          {documentCategories.find(c => c.id === doc.category_id)?.name || doc.category_id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getFileIcon(doc.file_type)}
                            <Typography sx={{ ml: 1 }}>{doc.file_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{new Date(doc.upload_date).toLocaleString()}</TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" title="View Document">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Download">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Document Count by Category</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Document Count</TableCell>
                            <TableCell align="right">Total Size</TableCell>
                            <TableCell align="right">Last Updated</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {documentCategories.map((category) => {
                            const docs = mockDocuments.filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id);
                            const totalSize = docs.reduce((sum, doc) => sum + doc.file_size, 0);
                            const lastUpdated = docs.length > 0 
                              ? new Date(Math.max(...docs.map(d => new Date(d.upload_date).getTime()))).toLocaleDateString()
                              : 'N/A';
                            
                            return (
                              <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell align="right">{docs.length}</TableCell>
                                <TableCell align="right">{formatFileSize(totalSize)}</TableCell>
                                <TableCell align="right">{lastUpdated}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Document Storage Summary</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Total Documents:</strong> {mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Total Storage Used:</strong> {formatFileSize(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).reduce((sum, doc) => sum + doc.file_size, 0))}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Document Categories Used:</strong> {new Set(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).map(d => d.category_id)).size} of {documentCategories.length}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Most Recent Upload:</strong> {
                          mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length > 0 
                            ? new Date(Math.max(...mockDocuments.filter(d => d.organization_id === selectedOrganization.id).map(d => new Date(d.upload_date).getTime()))).toLocaleString()
                            : 'N/A'
                        }
                      </Typography>
                      <Typography variant="body1">
                        <strong>Average File Size:</strong> {
                          mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length > 0 
                            ? formatFileSize(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).reduce((sum, doc) => sum + doc.file_size, 0) / mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length)
                            : 'N/A'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
      
      {/* Upload Document Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Document - {documentCategories.find(c => c.id === selectedCategory)?.name || ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Document Number: {selectedOrganization ? `${selectedOrganization.registration_number}-${documentCategories.find(c => c.id === selectedCategory)?.code || ''}` : ''}
            </Typography>
            
            <TextField
              fullWidth
              label="Document Description"
              placeholder="Enter a description for this document"
              margin="normal"
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Upload File</Typography>
              <FileDropzone
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'application/vnd.ms-excel': ['.xls'],
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png']
                }}
                maxFiles={1}
                maxSize={20971520} // 20MB
              />
            </Box>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Version Type</InputLabel>
              <Select
                label="Version Type"
                defaultValue="new"
              >
                <MenuItem value="new">New Document</MenuItem>
                <MenuItem value="update">Update Existing Document</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Version Notes"
              placeholder="Enter notes about this version (changes made, reason for update, etc.)"
              margin="normal"
              multiline
              rows={3}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Confidentiality</InputLabel>
              <Select
                label="Confidentiality"
                defaultValue="standard"
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="confidential">Confidential</MenuItem>
                <MenuItem value="restricted">Restricted Access</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  color="primary"
                />
              }
              label="Enable OCR Processing"
              sx={{ mt: 2 }}
            />
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              OCR processing will extract text content from the document for advanced searching.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
          >
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Version History Dialog */}
      <Dialog open={openVersionDialog} onClose={handleCloseVersionDialog} maxWidth="md" fullWidth>
        {selectedDocument && (
          <>
            <DialogTitle>
              Version History - {selectedDocument.file_name}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" gutterBottom>
                Document Number: {selectedDocument.document_number}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedDocument.description}
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Version</TableCell>
                      <TableCell>Date Modified</TableCell>
                      <TableCell>File Size</TableCell>
                      <TableCell>Change Notes</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockVersions
                      .filter(v => v.document_id === selectedDocument.id)
                      .sort((a, b) => b.version - a.version)
                      .map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            <Chip 
                              label={`v${version.version}`} 
                              size="small" 
                              color={version.version === selectedDocument.version ? "primary" : "default"}
                            />
                            {version.version === selectedDocument.version && (
                              <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                (Current)
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{new Date(version.modification_date).toLocaleString()}</TableCell>
                          <TableCell>{formatFileSize(version.file_size)}</TableCell>
                          <TableCell>{version.change_notes}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" title="View Document">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" title="Download">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVersionDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default EnhancedDocumentManager;

// Missing import
function ViewListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}

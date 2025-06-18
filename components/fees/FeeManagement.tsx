// Fee Management Component for OIR Dashboard
// src/components/fees/FeeManagement.tsx

import React, { useState, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  AttachMoney as AttachMoneyIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Mock data for demonstration
const mockFeeTypes = [
  { id: 1, code: 'REG-ORG', name: 'Registration of Organization', amount: 100.00, description: 'Fee for registration of an industrial organization', legalReference: 'Industrial Organizations Act 1962, Section 7', isActive: true },
  { id: 2, code: 'REG-AMEND', name: 'Registration of Amendment', amount: 50.00, description: 'Fee for registration of amendment to rules or constitution', legalReference: 'Industrial Organizations Act 1962, Section 27', isActive: true },
  { id: 3, code: 'CERT-COPY', name: 'Certified Copy', amount: 20.00, description: 'Fee for certified copy of certificate or document', legalReference: 'Industrial Organizations Act 1962, Section 7', isActive: true },
  { id: 4, code: 'INSPECT-REG', name: 'Inspection of Register', amount: 10.00, description: 'Fee for inspection of register', legalReference: 'Industrial Organizations Act 1962, Section 7', isActive: true },
  { id: 5, code: 'BALLOT-SUPER', name: 'Ballot Supervision', amount: 200.00, description: 'Fee for supervision of ballot', legalReference: 'Industrial Organizations Act 1962, Section 15', isActive: true },
  { id: 6, code: 'LATE-FIN', name: 'Late Financial Return', amount: 100.00, description: 'Fine for late submission of financial return', legalReference: 'Industrial Organizations Act 1962, Section 31', isActive: true },
  { id: 7, code: 'LATE-AUDIT', name: 'Late Audit Report', amount: 100.00, description: 'Fine for late submission of audit report', legalReference: 'Industrial Organizations Act 1962, Section 31', isActive: true },
  { id: 8, code: 'LATE-MEMBER', name: 'Late Membership List', amount: 50.00, description: 'Fine for late submission of membership list', legalReference: 'Industrial Organizations Act 1962, Section 31', isActive: true }
];

const mockOrganizations = [
  { id: 1, name: 'PNG Teachers Association', registrationNumber: 'IO-001' },
  { id: 2, name: 'Public Employees Association', registrationNumber: 'IO-002' },
  { id: 3, name: 'Maritime Workers Union', registrationNumber: 'IO-003' },
  { id: 4, name: 'Energy Workers Association', registrationNumber: 'IO-004' },
  { id: 5, name: 'National Academic Staff Association', registrationNumber: 'IO-101' }
];

const mockReceipts = [
  { 
    id: 1, 
    receiptNumber: 'OIR-2025-00001', 
    organizationId: 1, 
    organizationName: 'PNG Teachers Association',
    totalAmount: 100.00, 
    paymentMethod: 'Bank Transfer', 
    paymentReference: 'BT12345678', 
    paymentDate: '2025-05-01', 
    issuedBy: 'Alice Ngih',
    items: [
      { id: 1, feeTypeId: 1, feeTypeName: 'Registration of Organization', description: 'Annual registration fee', quantity: 1, unitPrice: 100.00, amount: 100.00 }
    ],
    isCancelled: false
  },
  { 
    id: 2, 
    receiptNumber: 'OIR-2025-00002', 
    organizationId: 2, 
    organizationName: 'Public Employees Association',
    totalAmount: 70.00, 
    paymentMethod: 'Cash', 
    paymentReference: '', 
    paymentDate: '2025-05-10', 
    issuedBy: 'Alice Ngih',
    items: [
      { id: 2, feeTypeId: 3, feeTypeName: 'Certified Copy', description: 'Certificate of registration copy', quantity: 1, unitPrice: 20.00, amount: 20.00 },
      { id: 3, feeTypeId: 4, feeTypeName: 'Inspection of Register', description: 'Register inspection fee', quantity: 5, unitPrice: 10.00, amount: 50.00 }
    ],
    isCancelled: false
  },
  { 
    id: 3, 
    receiptNumber: 'OIR-2025-00003', 
    organizationId: 3, 
    organizationName: 'Maritime Workers Union',
    totalAmount: 200.00, 
    paymentMethod: 'Check', 
    paymentReference: 'CHK987654', 
    paymentDate: '2025-05-15', 
    issuedBy: 'Bernard Toqiba',
    items: [
      { id: 4, feeTypeId: 5, feeTypeName: 'Ballot Supervision', description: 'Election supervision fee', quantity: 1, unitPrice: 200.00, amount: 200.00 }
    ],
    isCancelled: false
  },
  { 
    id: 4, 
    receiptNumber: 'OIR-2025-00004', 
    organizationId: 4, 
    organizationName: 'Energy Workers Association',
    totalAmount: 150.00, 
    paymentMethod: 'Online', 
    paymentReference: 'TXN123456789', 
    paymentDate: '2025-05-20', 
    issuedBy: 'Alice Ngih',
    items: [
      { id: 5, feeTypeId: 6, feeTypeName: 'Late Financial Return', description: 'Late fee for financial return', quantity: 1, unitPrice: 100.00, amount: 100.00 },
      { id: 6, feeTypeId: 8, feeTypeName: 'Late Membership List', description: 'Late fee for membership list', quantity: 1, unitPrice: 50.00, amount: 50.00 }
    ],
    isCancelled: true,
    cancelledReason: 'Duplicate payment',
    cancelledBy: 'Paul Wartovo',
    cancelledAt: '2025-05-21'
  }
];

const mockPendingFees = [
  { 
    id: 1, 
    organizationId: 1, 
    organizationName: 'PNG Teachers Association',
    feeTypeId: 2, 
    feeTypeName: 'Registration of Amendment',
    amount: 50.00, 
    dueDate: '2025-06-15',
    workflowId: 101,
    workflowTitle: 'Amendment to Constitution',
    status: 'pending'
  },
  { 
    id: 2, 
    organizationId: 3, 
    organizationName: 'Maritime Workers Union',
    feeTypeId: 7, 
    feeTypeName: 'Late Audit Report',
    amount: 100.00, 
    dueDate: '2025-06-10',
    workflowId: 102,
    workflowTitle: 'Late Submission of Audit Report',
    status: 'overdue'
  },
  { 
    id: 3, 
    organizationId: 5, 
    organizationName: 'National Academic Staff Association',
    feeTypeId: 5, 
    feeTypeName: 'Ballot Supervision',
    amount: 200.00, 
    dueDate: '2025-06-20',
    workflowId: 103,
    workflowTitle: 'Election Supervision Request',
    status: 'pending'
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
      id={`fee-tabpanel-${index}`}
      aria-labelledby={`fee-tab-${index}`}
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

const FeeManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openNewReceipt, setOpenNewReceipt] = useState(false);
  const [openFeeTypeDialog, setOpenFeeTypeDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [selectedFeeTypes, setSelectedFeeTypes] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());
  const [receiptItems, setReceiptItems] = useState<any[]>([]);
  const [currentFeeType, setCurrentFeeType] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [filteredReceipts, setFilteredReceipts] = useState(mockReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [openReceiptDetail, setOpenReceiptDetail] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenNewReceipt = () => {
    setOpenNewReceipt(true);
  };

  const handleCloseNewReceipt = () => {
    setOpenNewReceipt(false);
    setSelectedOrganization(null);
    setSelectedFeeTypes([]);
    setPaymentMethod('');
    setPaymentReference('');
    setPaymentDate(new Date());
    setReceiptItems([]);
  };

  const handleOpenFeeTypeDialog = () => {
    setOpenFeeTypeDialog(true);
  };

  const handleCloseFeeTypeDialog = () => {
    setOpenFeeTypeDialog(false);
    setCurrentFeeType(null);
  };

  const handleAddFeeType = () => {
    if (currentFeeType) {
      const existingItem = receiptItems.find(item => item.feeTypeId === currentFeeType.id);
      if (existingItem) {
        setSnackbarMessage('This fee type is already added to the receipt');
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);
        return;
      }
      
      const newItem = {
        id: Date.now(),
        feeTypeId: currentFeeType.id,
        feeTypeName: currentFeeType.name,
        description: currentFeeType.description,
        quantity: 1,
        unitPrice: currentFeeType.amount,
        amount: currentFeeType.amount
      };
      
      setReceiptItems([...receiptItems, newItem]);
      setCurrentFeeType(null);
      setOpenFeeTypeDialog(false);
    }
  };

  const handleRemoveReceiptItem = (itemId: number) => {
    setReceiptItems(receiptItems.filter(item => item.id !== itemId));
  };

  const handleUpdateItemQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setReceiptItems(receiptItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          amount: quantity * item.unitPrice
        };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return receiptItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleCreateReceipt = () => {
    if (!selectedOrganization) {
      setSnackbarMessage('Please select an organization');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (receiptItems.length === 0) {
      setSnackbarMessage('Please add at least one fee item');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (!paymentMethod) {
      setSnackbarMessage('Please select a payment method');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    if (!paymentDate) {
      setSnackbarMessage('Please select a payment date');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    // In a real app, this would send the data to the API
    const newReceipt = {
      id: mockReceipts.length + 1,
      receiptNumber: `OIR-2025-${String(mockReceipts.length + 1).padStart(5, '0')}`,
      organizationId: selectedOrganization.id,
      organizationName: selectedOrganization.name,
      totalAmount: calculateTotal(),
      paymentMethod,
      paymentReference,
      paymentDate: paymentDate.toISOString().split('T')[0],
      issuedBy: 'Current User',
      items: receiptItems,
      isCancelled: false
    };
    
    // In a real app, we would update the state after API success
    setSnackbarMessage('Receipt created successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    handleCloseNewReceipt();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Filter receipts based on search term and date range
    let filtered = [...mockReceipts];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(receipt => 
        receipt.receiptNumber.toLowerCase().includes(term) ||
        receipt.organizationName.toLowerCase().includes(term) ||
        receipt.paymentReference.toLowerCase().includes(term)
      );
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(receipt => 
        new Date(receipt.paymentDate) >= dateRange.start!
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(receipt => 
        new Date(receipt.paymentDate) <= dateRange.end!
      );
    }
    
    setFilteredReceipts(filtered);
  }, [searchTerm, dateRange]);

  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setOpenReceiptDetail(true);
  };

  const handleCloseReceiptDetail = () => {
    setOpenReceiptDetail(false);
    setSelectedReceipt(null);
  };

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCancelReason('');
  };

  const handleCancelReceipt = () => {
    if (!cancelReason) {
      setSnackbarMessage('Please provide a reason for cancellation');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    // In a real app, this would send the cancellation to the API
    setSnackbarMessage('Receipt cancelled successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    handleCloseCancelDialog();
    handleCloseReceiptDetail();
  };

  const handlePrintReceipt = () => {
    // In a real app, this would generate a printable receipt
    setSnackbarMessage('Printing receipt...');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  const handlePayFee = (fee: any) => {
    // In a real app, this would open the payment dialog
    setSnackbarMessage(`Processing payment for ${fee.organizationName}`);
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fee Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="fee management tabs">
            <Tab label="Receipts" id="fee-tab-0" aria-controls="fee-tabpanel-0" />
            <Tab label="Pending Fees" id="fee-tab-1" aria-controls="fee-tabpanel-1" />
            <Tab label="Fee Types" id="fee-tab-2" aria-controls="fee-tabpanel-2" />
            <Tab label="Reports" id="fee-tab-3" aria-controls="fee-tabpanel-3" />
          </Tabs>
        </Box>
        
        {/* Receipts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewReceipt}
            >
              New Receipt
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search receipts..."
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
                  <TableCell>Receipt Number</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id} sx={{ bgcolor: receipt.isCancelled ? 'rgba(244, 67, 54, 0.05)' : 'inherit' }}>
                    <TableCell>{receipt.receiptNumber}</TableCell>
                    <TableCell>{receipt.organizationName}</TableCell>
                    <TableCell>K {receipt.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{receipt.paymentMethod}</TableCell>
                    <TableCell>{receipt.paymentDate}</TableCell>
                    <TableCell>
                      {receipt.isCancelled ? (
                        <Chip label="Cancelled" color="error" size="small" />
                      ) : (
                        <Chip label="Paid" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewReceipt(receipt)}>
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handlePrintReceipt}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReceipts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No receipts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Pending Fees Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Fee Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Related Workflow</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPendingFees.map((fee) => (
                  <TableRow key={fee.id} sx={{ bgcolor: fee.status === 'overdue' ? 'rgba(244, 67, 54, 0.05)' : 'inherit' }}>
                    <TableCell>{fee.organizationName}</TableCell>
                    <TableCell>{fee.feeTypeName}</TableCell>
                    <TableCell>K {fee.amount.toFixed(2)}</TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>{fee.workflowTitle}</TableCell>
                    <TableCell>
                      <Chip 
                        label={fee.status === 'overdue' ? 'Overdue' : 'Pending'} 
                        color={fee.status === 'overdue' ? 'error' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayFee(fee)}
                      >
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {mockPendingFees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No pending fees
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Fee Types Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Legal Reference</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockFeeTypes.map((feeType) => (
                  <TableRow key={feeType.id}>
                    <TableCell>{feeType.code}</TableCell>
                    <TableCell>{feeType.name}</TableCell>
                    <TableCell>K {feeType.amount.toFixed(2)}</TableCell>
                    <TableCell>{feeType.description}</TableCell>
                    <TableCell>{feeType.legalReference}</TableCell>
                    <TableCell>
                      <Chip 
                        label={feeType.isActive ? 'Active' : 'Inactive'} 
                        color={feeType.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fee Collection Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a summary report of all fees collected within a specific date range.
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
                    Outstanding Fees Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of all outstanding fees by organization.
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
                    Fee Collection by Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of fees collected by fee type.
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
                    Cancelled Receipts Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generate a report of all cancelled receipts within a specific date range.
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
        
        {/* New Receipt Dialog */}
        <Dialog open={openNewReceipt} onClose={handleCloseNewReceipt} maxWidth="md" fullWidth>
          <DialogTitle>Create New Receipt</DialogTitle>
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
                <Typography variant="subtitle1" gutterBottom>
                  Fee Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fee Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receiptItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.feeTypeName}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemQuantity(item.id, parseInt(e.target.value))}
                              InputProps={{ inputProps: { min: 1 } }}
                              sx={{ width: 70 }}
                            />
                          </TableCell>
                          <TableCell align="right">K {item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">K {item.amount.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => handleRemoveReceiptItem(item.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {receiptItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenFeeTypeDialog}
                  >
                    Add Fee Item
                  </Button>
                  <Typography variant="h6">
                    Total: K {calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Payment Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Check">Check</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Online">Online Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Payment Reference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  helperText="Check number, transaction ID, etc."
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(date) => setPaymentDate(date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewReceipt}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleCreateReceipt}
              disabled={receiptItems.length === 0 || !selectedOrganization || !paymentMethod || !paymentDate}
            >
              Create Receipt
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Fee Type Selection Dialog */}
        <Dialog open={openFeeTypeDialog} onClose={handleCloseFeeTypeDialog}>
          <DialogTitle>Select Fee Type</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Fee Type</InputLabel>
              <Select
                value={currentFeeType ? currentFeeType.id : ''}
                onChange={(e) => {
                  const selectedFeeType = mockFeeTypes.find(ft => ft.id === e.target.value);
                  setCurrentFeeType(selectedFeeType);
                }}
                label="Fee Type"
              >
                {mockFeeTypes.map((feeType) => (
                  <MenuItem key={feeType.id} value={feeType.id}>
                    {feeType.name} - K {feeType.amount.toFixed(2)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {currentFeeType && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Description:</strong> {currentFeeType.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Legal Reference:</strong> {currentFeeType.legalReference}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFeeTypeDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleAddFeeType}
              disabled={!currentFeeType}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Receipt Detail Dialog */}
        <Dialog open={openReceiptDetail} onClose={handleCloseReceiptDetail} maxWidth="md" fullWidth>
          {selectedReceipt && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Receipt {selectedReceipt.receiptNumber}</Typography>
                  {selectedReceipt.isCancelled && (
                    <Chip label="CANCELLED" color="error" />
                  )}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Organization:</strong> {selectedReceipt.organizationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Payment Method:</strong> {selectedReceipt.paymentMethod}
                    </Typography>
                    {selectedReceipt.paymentReference && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Payment Reference:</strong> {selectedReceipt.paymentReference}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Payment Date:</strong> {selectedReceipt.paymentDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Issued By:</strong> {selectedReceipt.issuedBy}
                    </Typography>
                    {selectedReceipt.isCancelled && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cancelled By:</strong> {selectedReceipt.cancelledBy}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cancellation Reason:</strong> {selectedReceipt.cancelledReason}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Fee Items
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Fee Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedReceipt.items.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.feeTypeName}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">K {item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell align="right">K {item.amount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              <Typography variant="subtitle1">Total:</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle1">K {selectedReceipt.totalAmount.toFixed(2)}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseReceiptDetail}>Close</Button>
                <Button 
                  startIcon={<PrintIcon />}
                  onClick={handlePrintReceipt}
                >
                  Print
                </Button>
                {!selectedReceipt.isCancelled && (
                  <Button 
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleOpenCancelDialog}
                  >
                    Cancel Receipt
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
        
        {/* Cancel Receipt Dialog */}
        <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
          <DialogTitle>Cancel Receipt</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this receipt? This action cannot be undone.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Cancellation"
              fullWidth
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancelDialog}>No, Keep Receipt</Button>
            <Button 
              color="error" 
              onClick={handleCancelReceipt}
              disabled={!cancelReason}
            >
              Yes, Cancel Receipt
            </Button>
          </DialogActions>
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

export default FeeManagement;

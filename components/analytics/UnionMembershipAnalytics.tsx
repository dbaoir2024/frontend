// Enhanced React component for Union Membership Analytics with Economic Sector Filtering
// src/components/analytics/UnionMembershipAnalytics.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  CircularProgress,
  Tooltip as MuiTooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from 'recharts';
import { Info as InfoIcon } from '@mui/icons-material';
import { fetchUnionMembershipData } from '../../features/analytics/membershipSlice';
import { RootState } from '../../app/store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const UnionMembershipAnalytics: React.FC = () => {
  const dispatch = useDispatch();
  const { unionMembershipData, sectorData, loading } = useSelector((state: RootState) => state.membership);
  
  const [sortBy, setSortBy] = useState<string>('membershipDesc');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [selectedUnion, setSelectedUnion] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [activePieIndex, setActivePieIndex] = useState<number>(0);
  
  useEffect(() => {
    dispatch(fetchUnionMembershipData({ sortBy, sectorFilter }));
  }, [dispatch, sortBy, sectorFilter]);

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortBy(event.target.value as string);
  };

  const handleSectorFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSectorFilter(event.target.value as string);
  };

  const handleBarClick = (data: any) => {
    setSelectedUnion(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onPieEnter = (_: any, index: number) => {
    setActivePieIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} members`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  // Calculate total membership
  const totalMembers = unionMembershipData.reduce((sum, union) => sum + union.membershipCount, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Union Membership Analytics
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Analyze union membership data by size, sector, and other metrics.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="membershipDesc">Membership (Highest to Lowest)</MenuItem>
              <MenuItem value="membershipAsc">Membership (Lowest to Highest)</MenuItem>
              <MenuItem value="nameAsc">Union Name (A-Z)</MenuItem>
              <MenuItem value="nameDesc">Union Name (Z-A)</MenuItem>
              <MenuItem value="registrationAsc">Registration Date (Oldest First)</MenuItem>
              <MenuItem value="registrationDesc">Registration Date (Newest First)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Economic Sector</InputLabel>
            <Select
              value={sectorFilter}
              onChange={handleSectorFilterChange}
              label="Economic Sector"
            >
              <MenuItem value="all">All Sectors</MenuItem>
              <MenuItem value="agriculture">Agriculture & Forestry</MenuItem>
              <MenuItem value="mining">Mining & Resources</MenuItem>
              <MenuItem value="manufacturing">Manufacturing</MenuItem>
              <MenuItem value="construction">Construction</MenuItem>
              <MenuItem value="transport">Transport & Logistics</MenuItem>
              <MenuItem value="retail">Retail & Commerce</MenuItem>
              <MenuItem value="finance">Finance & Banking</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="health">Healthcare</MenuItem>
              <MenuItem value="public">Public Service</MenuItem>
              <MenuItem value="other">Other Sectors</MenuItem>
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
                    Total Unions
                  </Typography>
                  <Typography variant="h4">
                    {unionMembershipData.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {sectorFilter === 'all' ? 'Across all sectors' : `In ${sectorFilter} sector`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Members
                  </Typography>
                  <Typography variant="h4">
                    {totalMembers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Across all listed unions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Average Union Size
                  </Typography>
                  <Typography variant="h4">
                    {unionMembershipData.length > 0 
                      ? Math.round(totalMembers / unionMembershipData.length).toLocaleString() 
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Members per union
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Largest Union
                  </Typography>
                  <Typography variant="h4">
                    {unionMembershipData.length > 0 
                      ? Math.max(...unionMembershipData.map(u => u.membershipCount)).toLocaleString() 
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {unionMembershipData.length > 0 
                      ? unionMembershipData.reduce((prev, current) => 
                          (prev.membershipCount > current.membershipCount) ? prev : current
                        ).organizationName
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Membership Bar Chart */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Union Membership Size
              </Typography>
              <MuiTooltip title="Click on any bar to see detailed information about the union">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </MuiTooltip>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={unionMembershipData}
                margin={{ top: 5, right: 30, left: 20, bottom: 120 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="registrationNumber" 
                  angle={-45} 
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [`${value.toLocaleString()} members`, props.payload.organizationName]}
                  labelFormatter={(label) => `Registration: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="membershipCount" 
                  name="Membership" 
                  fill="#0088FE" 
                  onClick={handleBarClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          
          {/* Sector Distribution */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Union Distribution by Economic Sector
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        activeIndex={activePieIndex}
                        activeShape={renderActiveShape}
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="unionCount"
                        onMouseEnter={onPieEnter}
                        onClick={(data) => setSectorFilter(data.sectorCode)}
                        cursor="pointer"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} unions`, props.payload.sectorName]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Typography variant="body2" color="textSecondary" align="center">
                  Click on any sector to filter the data
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Membership Distribution by Economic Sector
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="membershipCount"
                        onClick={(data) => setSectorFilter(data.sectorCode)}
                        cursor="pointer"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value.toLocaleString()} members`, props.payload.sectorName]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Typography variant="body2" color="textSecondary" align="center">
                  Click on any sector to filter the data
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Union Details Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            {selectedUnion && (
              <>
                <DialogTitle>
                  {selectedUnion.organizationName} ({selectedUnion.registrationNumber})
                </DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">Registration Date</Typography>
                      <Typography variant="body1">{new Date(selectedUnion.registrationDate).toLocaleDateString()}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Status</Typography>
                      <Typography variant="body1">{selectedUnion.status}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Economic Sector</Typography>
                      <Typography variant="body1">{selectedUnion.sectorName}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Contact Person</Typography>
                      <Typography variant="body1">{selectedUnion.contactPerson || 'Not specified'}</Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">Current Membership</Typography>
                      <Typography variant="h4">{selectedUnion.membershipCount.toLocaleString()}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Membership Change (Last Year)</Typography>
                      <Typography 
                        variant="body1" 
                        color={selectedUnion.membershipChange >= 0 ? 'success.main' : 'error.main'}
                      >
                        {selectedUnion.membershipChange > 0 ? '+' : ''}{selectedUnion.membershipChange}%
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Last Membership Update</Typography>
                      <Typography variant="body1">
                        {selectedUnion.lastMembershipUpdate 
                          ? new Date(selectedUnion.lastMembershipUpdate).toLocaleDateString() 
                          : 'Not available'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" gutterBottom>Membership History</Typography>
                      
                      {selectedUnion.membershipHistory && selectedUnion.membershipHistory.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Members</TableCell>
                                <TableCell align="right">Change</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedUnion.membershipHistory.map((history: any) => (
                                <TableRow key={history.date}>
                                  <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                                  <TableCell align="right">{history.count.toLocaleString()}</TableCell>
                                  <TableCell 
                                    align="right"
                                    sx={{ 
                                      color: history.percentChange > 0 
                                        ? 'success.main' 
                                        : history.percentChange < 0 
                                          ? 'error.main' 
                                          : 'inherit'
                                    }}
                                  >
                                    {history.percentChange > 0 ? '+' : ''}{history.percentChange}%
                                  </TableCell>
                                  <TableCell>{history.status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No membership history available
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Close</Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      handleCloseDialog();
                      // Navigate to organization detail page (implementation would depend on your routing setup)
                    }}
                  >
                    View Full Details
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default UnionMembershipAnalytics;

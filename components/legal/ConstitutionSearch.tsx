// Enhanced React component for OCR-based Constitution Search
// src/components/legal/ConstitutionSearch.tsx

import React, { useState } from 'react';
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
  TextField,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  HighlightAlt as HighlightAltIcon
} from '@mui/icons-material';
import { searchConstitutions } from '../../features/organizations/constitutionsSlice';
import { RootState } from '../../app/store';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';

const ConstitutionSearch: React.FC = () => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state: RootState) => state.constitutions);
  const { items: organizations } = useSelector((state: RootState) => state.organizations);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  React.useEffect(() => {
    dispatch(fetchOrganizations({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    dispatch(searchConstitutions({
      query: searchQuery,
      organizationId: selectedOrganization || undefined
    }));
    setSearchPerformed(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? <mark key={i}>{part}</mark> : part
        )}
      </>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Constitution Clause Search
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Search for specific clauses or content within organization constitutions using OCR technology.
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search for clauses or content"
            placeholder="e.g., 'election procedures' or 'membership requirements'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{ ml: 1 }}
                >
                  Search
                </Button>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Organization (Optional)</InputLabel>
            <Select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value as string)}
              label="Filter by Organization (Optional)"
            >
              <MenuItem value="">All Organizations</MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.registrationNumber} - {org.organizationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {searchPerformed && !loading && searchResults.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="body1" color="textSecondary">
            No results found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try using different keywords or removing filters.
          </Typography>
        </Paper>
      )}
      
      {searchPerformed && !loading && searchResults.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Found {searchResults.length} results for "{searchQuery}"
            </Typography>
          </Box>
          
          <List>
            {searchResults.map((result) => (
              <Card key={result.constitution.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">
                        {result.organization.organizationName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Registration: {result.organization.registrationNumber} | 
                        Constitution Version: {result.constitution.versionNumber} | 
                        Effective: {new Date(result.constitution.effectiveDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={result.constitution.status} 
                      color={
                        result.constitution.status === 'approved' ? 'success' : 
                        result.constitution.status === 'pending' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Matched Content:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      maxHeight: '150px',
                      overflow: 'auto'
                    }}
                  >
                    <Typography variant="body2">
                      {highlightMatches(result.matchedText, searchQuery)}
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      startIcon={<VisibilityIcon />}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      View Full Constitution
                    </Button>
                    <Button
                      startIcon={<DownloadIcon />}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default ConstitutionSearch;

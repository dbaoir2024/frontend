// Dashboard slice for Redux store
// Manages dashboard state using Redux Toolkit

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api.service';
import { 
  DashboardStats, 
  OrganizationCompliance, 
  UpcomingAgreementRenewal, 
  UpcomingBallot, 
  UpcomingTraining,
  ChartData,
  GeoDistributionData
} from '../../types';

// Define the dashboard state interface
interface DashboardState {
  stats: DashboardStats | null;
  organizationCompliance: OrganizationCompliance[];
  upcomingAgreementRenewals: UpcomingAgreementRenewal[];
  upcomingBallots: UpcomingBallot[];
  upcomingTrainings: UpcomingTraining[];
  organizationGrowthData: ChartData | null;
  disputeResolutionData: ChartData | null;
  geoDistributionData: GeoDistributionData[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  organizationCompliance: [],
  upcomingAgreementRenewals: [],
  upcomingBallots: [],
  upcomingTrainings: [],
  organizationGrowthData: null,
  disputeResolutionData: null,
  geoDistributionData: [],
  isLoading: false,
  error: null,
};

// Async thunks for dashboard data
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<DashboardStats>('/dashboard/stats');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch dashboard stats');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard stats');
    }
  }
);

export const fetchOrganizationCompliance = createAsyncThunk(
  'dashboard/fetchOrganizationCompliance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<OrganizationCompliance[]>('/dashboard/organization-compliance');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch organization compliance data');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch organization compliance data');
    }
  }
);

export const fetchUpcomingAgreementRenewals = createAsyncThunk(
  'dashboard/fetchUpcomingAgreementRenewals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<UpcomingAgreementRenewal[]>('/dashboard/upcoming-agreement-renewals');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch upcoming agreement renewals');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch upcoming agreement renewals');
    }
  }
);

export const fetchUpcomingBallots = createAsyncThunk(
  'dashboard/fetchUpcomingBallots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<UpcomingBallot[]>('/dashboard/upcoming-ballots');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch upcoming ballots');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch upcoming ballots');
    }
  }
);

export const fetchUpcomingTrainings = createAsyncThunk(
  'dashboard/fetchUpcomingTrainings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<UpcomingTraining[]>('/dashboard/upcoming-trainings');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch upcoming trainings');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch upcoming trainings');
    }
  }
);

export const fetchOrganizationGrowthData = createAsyncThunk(
  'dashboard/fetchOrganizationGrowthData',
  async (period: 'month' | 'quarter' | 'year' = 'year', { rejectWithValue }) => {
    try {
      const response = await ApiService.get<ChartData>('/dashboard/organization-growth', { period });
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch organization growth data');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch organization growth data');
    }
  }
);

export const fetchDisputeResolutionData = createAsyncThunk(
  'dashboard/fetchDisputeResolutionData',
  async (period: 'month' | 'quarter' | 'year' = 'year', { rejectWithValue }) => {
    try {
      const response = await ApiService.get<ChartData>('/dashboard/dispute-resolution', { period });
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch dispute resolution data');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch dispute resolution data');
    }
  }
);

export const fetchGeoDistributionData = createAsyncThunk(
  'dashboard/fetchGeoDistributionData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.get<GeoDistributionData[]>('/dashboard/geo-distribution');
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch geographical distribution data');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch geographical distribution data');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Organization Compliance
    builder
      .addCase(fetchOrganizationCompliance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationCompliance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizationCompliance = action.payload;
        state.error = null;
      })
      .addCase(fetchOrganizationCompliance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Upcoming Agreement Renewals
    builder
      .addCase(fetchUpcomingAgreementRenewals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAgreementRenewals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingAgreementRenewals = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingAgreementRenewals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Upcoming Ballots
    builder
      .addCase(fetchUpcomingBallots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingBallots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingBallots = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingBallots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Upcoming Trainings
    builder
      .addCase(fetchUpcomingTrainings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingTrainings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingTrainings = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingTrainings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Organization Growth Data
    builder
      .addCase(fetchOrganizationGrowthData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationGrowthData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizationGrowthData = action.payload;
        state.error = null;
      })
      .addCase(fetchOrganizationGrowthData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Dispute Resolution Data
    builder
      .addCase(fetchDisputeResolutionData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDisputeResolutionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disputeResolutionData = action.payload;
        state.error = null;
      })
      .addCase(fetchDisputeResolutionData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Geo Distribution Data
    builder
      .addCase(fetchGeoDistributionData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeoDistributionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.geoDistributionData = action.payload;
        state.error = null;
      })
      .addCase(fetchGeoDistributionData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

import type { DashboardData, DashboardFilterState } from '../types/dashboard.types';
import { MOCK_DASHBOARD_DATA } from '../mock/mockDashboardData';

export interface IDashboardService {
  getDashboardData(filters?: Partial<DashboardFilterState>): Promise<DashboardData>;
}

class MockDashboardService implements IDashboardService {
  async getDashboardData(_filters?: Partial<DashboardFilterState>): Promise<DashboardData> {
    // Simulating slight network latency
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_DASHBOARD_DATA;
  }
}

// Export the singleton service instance
export const dashboardService: IDashboardService = new MockDashboardService();

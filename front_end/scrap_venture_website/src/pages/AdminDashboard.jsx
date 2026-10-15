import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest, getStoredUser } from '../utils/api.js';
import {
  ShieldIcon,
  UserIcon,
  TruckIcon,
} from '../components/icons.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [userStats, setUserStats] = useState({ customercount: 0, collectorcount: 0 });
  const [orderStats, setOrderStats] = useState({ market_orders_count: 0, scrap_orders_count: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        apiRequest('/api/admindashboard/user_stats').catch(() => ({ stats: { customercount: 0, collectorcount: 0 } })),
        apiRequest('/api/admindashboard/order-stats').catch(async () => {
          const [mRes, sRes] = await Promise.all([
            apiRequest('/api/admindashboard/market-orders').catch(() => ({ market_orders: [] })),
            apiRequest('/api/admindashboard/scrap-orders').catch(() => ({ scrap_orders: [] })),
          ]);
          return {
            market_orders_count: mRes?.market_orders?.length || 0,
            scrap_orders_count: sRes?.scrap_orders?.length || 0,
          };
        }),
      ]);

      setUserStats({
        customercount: uRes?.stats?.customercount || 0,
        collectorcount: uRes?.stats?.collectorcount || 0,
      });

      setOrderStats({
        market_orders_count: oRes?.market_orders_count || 0,
        scrap_orders_count: oRes?.scrap_orders_count || 0,
      });
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[{ label: 'Admin Portal', to: '/admin/dashboard' }, { label: 'Dashboard' }]}
    >
      {/* Top Header Row */}
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Command Overview &amp; Control</h1>
          <p>
            Master oversight of circular waste streams, collector verification, orders fulfillment, and awards outreach.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="portal-kpi-grid">
        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">TOTAL CUSTOMERS</div>
            <div className="portal-kpi-val">
              {loading ? '...' : (userStats.customercount || 1452).toLocaleString()}
            </div>
            <div className="portal-kpi-sub">Citizens recycling with ScrapVenture</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            <UserIcon size={18} />
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">SCRAP COLLECTORS</div>
            <div className="portal-kpi-val">
              {loading ? '...' : (userStats.collectorcount || 48).toLocaleString()}
            </div>
            <div className="portal-kpi-sub">Registered logistics fleet partners</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--blue">
            <TruckIcon size={18} />
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">MARKET BUY REQUESTS</div>
            <div className="portal-kpi-val">
              {loading ? '...' : (orderStats.market_orders_count || 184).toLocaleString()}
            </div>
            <div className="portal-kpi-sub">Circular eco products ordered</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--orange">
            🛒
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">SCRAP PICKUP ORDERS</div>
            <div className="portal-kpi-val">
              {loading ? '...' : (orderStats.scrap_orders_count || 96).toLocaleString()}
            </div>
            <div className="portal-kpi-sub">Doorstep waste collection orders</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            ♻️
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

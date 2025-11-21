/**
 * Admin Dashboard - Platform management
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import './AdminDashboardPage.css';

interface Stats {
  users: {
    total: number;
    founders: number;
    admins: number;
  };
  startups: {
    total: number;
  };
  investments: {
    total: number;
    pending_review: number;
    live: number;
  };
}

interface Investment {
  id: string;
  startup_name: string;
  founder_name: string;
  total_investment_sought: number;
  equity_offered: number;
  status: string;
  created_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadDashboard();
  }, [user, token, navigate]);

  const loadDashboard = async () => {
    if (!token) return;

    try {
      // Fetch stats
      const statsRes = await fetch('http://localhost:8080/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch investments
      const investmentsRes = await fetch('http://localhost:8080/admin/investments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (investmentsRes.ok) {
        const investmentsData = await investmentsRes.json();
        setInvestments(investmentsData.investments || []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleApprove = async (investmentId: string) => {
    if (!token || !confirm('Approve this investment?')) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/investments/${investmentId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Investment approved!');
        loadDashboard(); // Refresh
      } else {
        alert('Failed to approve investment');
      }
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Failed to approve investment');
    }
  };

  const handleReject = async (investmentId: string) => {
    if (!token || !confirm('Reject this investment?')) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/investments/${investmentId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Investment rejected!');
        loadDashboard(); // Refresh
      } else {
        alert('Failed to reject investment');
      }
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Failed to reject investment');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Platform Management</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.users.total}</div>
            <div className="stat-breakdown">
              Founders: {stats.users.founders} | Admins: {stats.users.admins}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Startups</div>
            <div className="stat-value">{stats.startups.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{stats.investments.pending_review}</div>
            <div className="stat-breakdown">
              Total: {stats.investments.total} | Live: {stats.investments.live}
            </div>
          </div>
        </div>
      )}

      {/* Investments Table */}
      <div className="admin-section">
        <h2>Investment Rounds</h2>

        {investments.length === 0 ? (
          <p className="admin-empty">No investments yet</p>
        ) : (
          <div className="investments-table">
            <table>
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Founder</th>
                  <th>Amount</th>
                  <th>Equity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id}>
                    <td><strong>{inv.startup_name}</strong></td>
                    <td>{inv.founder_name}</td>
                    <td>${inv.total_investment_sought.toLocaleString()}</td>
                    <td>{inv.equity_offered}%</td>
                    <td>
                      <span className={`status-badge status-${inv.status}`}>
                        {inv.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td>
                      {inv.status === 'pending_review' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleApprove(inv.id)}
                            className="btn-approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(inv.id)}
                            className="btn-reject"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

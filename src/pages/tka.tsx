import React, { useState } from 'react';
import Head from 'next/head';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import type { DashboardVariant } from '@/components/dashboard/types';

type DaerahDashboardProps = {
  variant?: DashboardVariant | null;
};

type ReportStatus = 'pending' | 'approved' | 'rejected';

type Report = {
  id: number;
  name: string;
  location: string;
  date: string;
  type: string;
  status: ReportStatus;
};

const formatThousandsShort = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}M`;
  }
  if (abs >= 1_000) {
    const formatted = (value / 1_000).toFixed(1);
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
};

const DaerahDashboard = ({ variant }: DaerahDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: 'SPPG Banyuwangi',
      location: 'Jawa Timur',
      date: '06/11/2025 14:30',
      type: 'Distribusi Harian',
      status: 'pending',
    },
    {
      id: 2,
      name: 'SPPG Kediri',
      location: 'Jawa Timur',
      date: '06/11/2025 13:15',
      type: 'Kualitas Gizi',
      status: 'pending',
    },
  ]);

  const distributionData = [
    { name: 'Malang', value: 250000 },
    { name: 'Surabaya', value: 220000 },
    { name: 'Jember', value: 180000 },
    { name: 'Kediri', value: 150000 },
    { name: 'Jombang', value: 100000 },
  ];

  const nutritionData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 87 },
    { name: 'Mar', value: 90 },
    { name: 'Apr', value: 88 },
    { name: 'Mei', value: 82 },
    { name: 'Jun', value: 79 },
  ];

  const handleApprove = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as ReportStatus } : r)),
    );
  };

  const handleReject = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as ReportStatus } : r)),
    );
  };

  const handleView = () => {
    alert('Fitur detail laporan akan segera hadir.');
  };

  const handleAddSekolahUser = () => {
    alert('Tambah akun untuk peran Sekolah (hubungkan ke formulir backend di produksi).');
  };

  const handleMainContentClick = () => {
    if (sidebarOpen && typeof window !== 'undefined' && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard Daerah - MBGsecure</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="dashboard-root">
        <button
          id="menu-toggle"
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <i className="fas fa-bars" />
        </button>

        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`sidebar ${sidebarOpen ? 'active' : ''} ${
            sidebarCollapsed ? 'collapsed' : ''
          }`}
          id="sidebar"
        >
          <div className="sidebar-scroll-container">
            <div className="logo-section" style={{ padding: '0 25px 15px' }}>
              <h2>
                <i className="fas fa-shield-alt" /> MBGsecure
              </h2>
              <p>Pengelola Wilayah</p>
            </div>

            <div className="menu-section" style={{ padding: '10px 0' }}>
              <div className="menu-title">Menu Utama</div>
              <a href="#" className="menu-item active">
                <i className="fas fa-tachometer-alt" />
                <span className="menu-label">Dashboard</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-utensils" />
                <span className="menu-label">Distribusi Makanan</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-school" />
                <span className="menu-label">Program Sekolah</span>
              </a>
              <a href="/lapor" className="menu-item">
                <i className="fas fa-chart-line" />
                <span className="menu-label">Laporan Kualitas</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-file-signature" />
                <span className="menu-label">Verifikasi SPPG</span>
                <span className="notification-badge">7</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-exclamation-triangle" />
                <span className="menu-label">Peringatan</span>
                <span className="notification-badge">3</span>
              </a>
            </div>

            <div className="menu-section" style={{ padding: '10px 0' }}>
              <div className="menu-title">Data & Analisis</div>
              <a href="#" className="menu-item">
                <i className="fas fa-file-alt" />
                <span className="menu-label">Laporan Wilayah</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-chart-bar" />
                <span className="menu-label">Statistik Daerah</span>
              </a>
              <a href="#" className="menu-item">
                <i className="fas fa-archive" />
                <span className="menu-label">Arsip Data</span>
              </a>
            </div>

            <div className="menu-section" style={{ padding: '10px 0' }}>
              <div className="menu-title">Pengguna</div>
              <a
                href="#"
                className="menu-item big"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddSekolahUser();
                }}
              >
                <i className="fas fa-school" />
                <span className="menu-label">Tambah Akun Sekolah</span>
              </a>
            </div>
          </div>

          <div className="floating-toggle">
            <button
              className={`collapse-btn floating ${sidebarCollapsed ? 'is-collapsed' : ''}`}
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Collapse sidebar"
              aria-pressed={sidebarCollapsed}
            >
              <i
                className={`fas fa-${sidebarCollapsed ? 'angle-right' : 'angle-left'}`}
                aria-hidden
              />
            </button>
          </div>

          <a href="#" className="logout-btn" data-action="logout">
            <i className="fas fa-sign-out-alt" />
            <span className="logout-text">Keluar</span>
          </a>
        </div>

        <div
          className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}
          onClick={handleMainContentClick}
        >
          <div className="header">
            <div className="header-left">
              <h1>Selamat Datang, Admin Daerah</h1>
              <p>{variant?.heroSummary ?? 'Berikut adalah ringkasan data program MBG hari ini.'}</p>
            </div>
            <div className="header-right">
              {/* <div className="search-box">
                <i className="fas fa-search" />
                <input type="text" placeholder="Cari data..." />
              </div> */}
              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/lapor';
                  }
                }}
                aria-label="Buka percakapan tiket"
              >
                <i className="fas fa-comments" />
              </button>
              <div className="icon-btn">
                <i className="fas fa-bell" />
                <span className="badge">5</span>
              </div>
              <div
                className="user-profile"
                id="userProfile"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Menu profil akan segera hadir!');
                }}
              >
                <div className="user-avatar">
                  <img
                    src="/assets/images/logo.png"
                    alt="Admin Daerah"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div className="user-info">
                  <div className="name">Admin Daerah</div>
                  <div className="role">Pengelola Wilayah</div>
                </div>
                <i className="fas fa-chevron-down" />
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Distribusi Mingguan</div>
                </div>
                <div className="stat-icon blue">
                  <i className="fas fa-utensils" />
                </div>
              </div>
              <div className="stat-value">18.450</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up" /> +4.2% dari minggu lalu
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Sekolah Aktif</div>
                </div>
                <div className="stat-icon green">
                  <i className="fas fa-school" />
                </div>
              </div>
              <div className="stat-value">312</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up" /> +1.8% dari minggu lalu
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">Kepatuhan SLA</div>
                </div>
                <div className="stat-icon orange">
                  <i className="fas fa-check-circle" />
                </div>
              </div>
              <div className="stat-value">83.5%</div>
              <div className="stat-change negative">
                <i className="fas fa-arrow-down" /> -1.2% dari minggu lalu
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div>
                  <div className="stat-title">SPPG Perlu Tinjau</div>
                </div>
                <div className="stat-icon red">
                  <i className="fas fa-exclamation-triangle" />
                </div>
              </div>
              <div className="stat-value">9</div>
              <div className="stat-change negative">
                <i className="fas fa-arrow-up" /> +2 dari minggu lalu
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Distribusi per Kabupaten</div>
                <div className="chart-menu">
                  {/* <i className="fas fa-ellipsis-v" /> */}
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={distributionData}
                    margin={{ top: 5, right: 10, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 178, 160, 0.35)" />
                    <XAxis dataKey="name" tick={{ fill: '#002366', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#C0B2A0', fontSize: 11 }} tickFormatter={formatThousandsShort} />
                    <Tooltip />
                    <Bar dataKey="value" name="Jumlah Distribusi" fill="rgba(15, 82, 186, 0.7)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">Kualitas Gizi Wilayah</div>
                <div className="chart-menu">
                  {/* <i className="fas fa-ellipsis-v" /> */}
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={nutritionData} margin={{ top: 5, right: 10, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 178, 160, 0.35)" />
                    <XAxis dataKey="name" tick={{ fill: '#002366', fontSize: 11 }} />
                    <YAxis domain={[70, 100]} tick={{ fill: '#C0B2A0', fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Skor Kualitas Gizi"
                      stroke="#0F52BA"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="alerts-section">
            <div className="section-header">
              <div className="section-title">Peringatan Wilayah</div>
              <a href="#" className="view-all">
                {'Lihat Semua \u2192'}
              </a>
            </div>
            <div className="alert-card danger">
              <div className="alert-icon danger">
                <i className="fas fa-exclamation-circle" />
              </div>
              <div className="alert-content">
                <div className="alert-title">Kualitas gizi turun di Kab. B</div>
                <div className="alert-description">
                  Nilai gizi turun 8% dalam 3 hari terakhir. Perlu pengecekan dapur.
                </div>
              </div>
              <div className="alert-time">3 jam lalu</div>
            </div>
            <div className="alert-card warning">
              <div className="alert-icon warning">
                <i className="fas fa-exclamation-triangle" />
              </div>
              <div className="alert-content">
                <div className="alert-title">Keterlambatan laporan Kab. D</div>
                <div className="alert-description">
                  Belum mengirim laporan distribusi selama 4 hari.
                </div>
              </div>
              <div className="alert-time">6 jam lalu</div>
            </div>
          </div>

          <div className="reports-section">
            <div className="table-header">
              <div className="section-title">Laporan SPPG Menunggu Persetujuan</div>
              <div className="filter-group">
                <button className="filter-btn">
                  <i className="fas fa-filter" /> Filter
                </button>
                <button className="filter-btn">
                  <i className="fas fa-download" /> Export
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama SPPG</th>
                    <th>Provinsi</th>
                    <th>Tanggal Laporan</th>
                    <th>Jenis Laporan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr key={report.id} data-id={report.id}>
                      <td>{idx + 1}</td>
                      <td>{report.name}</td>
                      <td>{report.location}</td>
                      <td>{report.date}</td>
                      <td>{report.type}</td>
                      <td>
                        <span className={`status-badge ${report.status}`}>
                          {report.status === 'pending'
                            ? 'Menunggu'
                            : report.status === 'approved'
                            ? 'Disetujui'
                            : 'Ditolak'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn view" onClick={handleView}>
                            <i className="fas fa-eye" /> Lihat
                          </button>
                          <button
                            className="action-btn approve"
                            onClick={() => handleApprove(report.id)}
                            disabled={report.status !== 'pending'}
                          >
                            <i className="fas fa-check" /> Setujui
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleReject(report.id)}
                            disabled={report.status !== 'pending'}
                          >
                            <i className="fas fa-times" /> Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #f7f5f0;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }
        .dashboard-root {
          color: #002366;
          /* Use opacity-only animation so fixed sidebar is truly viewport-fixed */
          animation: fadeOpacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          min-height: 100vh;
        }
        @supports (height: 100dvh) {
          .dashboard-root {
            min-height: 100dvh;
          }
        }

        /* SIDEBAR - UPDATED */
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 260px;
          height: 100vh;
          background: linear-gradient(135deg, #002366 0%, #0f52ba 100%);
          display: flex;
          flex-direction: column;
          /* REMOVED: justify-content: space-between; */
          padding: 30px 0;
          /* REMOVED: overflow-y: auto; */
          /* REMOVED: overflow-x: visible; */
          z-index: 100;
          transition: width 0.25s ease, transform 0.3s ease;
          animation: fadeSlideLeft 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          /* REMOVED: scrollbar-width: none; */
        }
        @supports (height: 100dvh) {
          .sidebar {
            height: 100dvh;
          }
        }
        /* REMOVED: .sidebar::-webkit-scrollbar */

        /* NEW: Scroll container for sidebar content */
        .sidebar-scroll-container {
          flex: 1; /* Takes up all available space, pushing logout btn to bottom */
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .sidebar-scroll-container::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.08;
          background-image: radial-gradient(
            circle at 50% 50%,
            transparent 30%,
            #c0b2a0 30%,
            #c0b2a0 32%,
            transparent 32%
          );
          background-size: 60px 60px;
          pointer-events: none;
        }
        .logo-section h2 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .logo-section p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }
        .menu-section {
          padding: 20px 0;
        }
        .menu-title {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 25px;
          margin-bottom: 10px;
        }

        /* Floating toggle moved near top (not middle like screenshot) */
        .floating-toggle {
          position: absolute;
          right: -18px;
          top: 80px;
          transform: none;
          z-index: 150;
        }
        .sidebar.collapsed .floating-toggle {
          right: -14px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 14px 25px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          font-size: 14px;
        }
        .menu-item:hover,
        .menu-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        .menu-item.active {
          border-left: 4px solid #c0b2a0;
        }
        .menu-item i {
          margin-right: 12px;
          font-size: 18px;
          width: 20px;
          text-align: center;
        }
        .menu-label {
          flex: 1;
          margin-left: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-text {
          margin-left: 12px;
          white-space: nowrap;
        }
        .notification-badge {
          background: #e74c3c;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: auto;
        }
        .logout-btn {
          margin: 0 25px 20px; /* Align with other dashboards; sits above sidebar bottom padding */
          padding: 14px 20px;
          display: flex;
          align-items: center;
          background: rgba(231, 76, 60, 0.2);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 14px;
          flex-shrink: 0; /* Prevent logout button from shrinking */
        }
        .logout-btn i {
          margin-right: 12px;
        }
        .logout-btn:hover {
          background: rgba(231, 76, 60, 0.3);
        }

        .sidebar.collapsed {
          width: 90px;
        }
        .sidebar.collapsed .logo-section h2,
        .sidebar.collapsed .logo-section p,
        .sidebar.collapsed .menu-title,
        .sidebar.collapsed .notification-badge {
          display: none;
        }
        .sidebar.collapsed .menu-item {
          justify-content: center;
          padding: 12px;
          gap: 0;
        }
        .sidebar.collapsed .menu-item i {
          margin-right: 0;
        }
        .sidebar.collapsed .menu-label,
        .sidebar.collapsed .logout-text {
          display: none;
        }
        .sidebar.collapsed .logout-btn {
          justify-content: center;
          gap: 0;
        }
        .sidebar.collapsed .logout-btn i {
          margin-right: 0;
        }

        /* MAIN CONTENT */
        .main-content {
          margin-left: 260px;
          padding: 30px;
          transition: margin-left 0.25s ease, padding 0.25s ease;
          animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.1s;
        }
        .main-content.collapsed {
          margin-left: 90px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          gap: 20px;
        }
        .header-left h1 {
          color: #002366;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 5px;
          overflow-wrap: break-word;
        }
        .header-left p {
          color: #c0b2a0;
          font-size: 14px;
          overflow-wrap: break-word;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
          flex-wrap: nowrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          padding: 10px 18px;
          border-radius: 12px;
          border: 2px solid rgba(192, 178, 160, 0.2);
          width: 300px;
          max-width: 100%;
        }
        .search-box input {
          border: none;
          outline: none;
          background: none;
          width: 100%;
          font-size: 14px;
          color: #002366;
        }
        .search-box input::placeholder {
          color: #c0b2a0;
        }
        .search-box i {
          color: #c0b2a0;
          margin-right: 10px;
        }
        .icon-btn {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 12px;
          border: 2px solid rgba(192, 178, 160, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          color: #002366;
          font-size: 18px;
          flex-shrink: 0;
        }
        .icon-btn:hover {
          border-color: #0f52ba;
          transform: translateY(-2px);
        }
        .icon-btn .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          font-size: 10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 15px 8px 8px;
          background: white;
          border-radius: 12px;
          border: 2px solid rgba(192, 178, 160, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          height: 56px;
          line-height: 1.2;
          min-width: 0;
        }
        .user-profile:hover {
          border-color: #0f52ba;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0f52ba, #002366);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          overflow: hidden;
        }
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }
        .user-info .name {
          color: #002366;
          font-weight: 600;
          font-size: 14px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-info .role {
          color: #c0b2a0;
          font-size: 12px;
          line-height: 1.2;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Collapse button styling */
        .collapse-btn {
          height: 42px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          border: 1px solid rgba(0, 35, 102, 0.15);
          background: #f7f5f0;
          color: #002366;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-right: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        .collapse-btn:hover {
          border-color: #0f52ba;
          color: #0f52ba;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .collapse-btn.is-collapsed {
          width: 36px;
          padding: 0;
          gap: 0;
        }
        .collapse-btn.floating {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          padding: 0;
          gap: 0;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
          background: white;
          margin-right: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease both;
        }
        .stat-card:nth-child(1) {
          animation-delay: 0.12s;
        }
        .stat-card:nth-child(2) {
          animation-delay: 0.18s;
        }
        .stat-card:nth-child(3) {
          animation-delay: 0.24s;
        }
        .stat-card:nth-child(4) {
          animation-delay: 0.3s;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(15, 82, 186, 0.05) 0%, transparent 70%);
          border-radius: 50%;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .stat-title {
          color: #c0b2a0;
          font-size: 13px;
          font-weight: 500;
          overflow-wrap: break-word;
        }
        .stat-icon {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .stat-icon.blue {
          background: rgba(15, 82, 186, 0.1);
          color: #0f52ba;
        }
        .stat-icon.green {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }
        .stat-icon.orange {
          background: rgba(230, 126, 34, 0.1);
          color: #e67e22;
        }
        .stat-icon.red {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        .stat-value {
          color: #002366;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          overflow-wrap: break-word;
        }
        .stat-change {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
        }
        .stat-change.positive {
          color: #2ecc71;
        }
        .stat-change.negative {
          color: #e74c3c;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-bottom: 30px;
        }
        .chart-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.6s ease both 0.18s;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .chart-title {
          color: #002366;
          font-size: 18px;
          font-weight: 600;
          overflow-wrap: break-word;
        }
        .chart-menu {
          color: #c0b2a0;
          cursor: pointer;
          font-size: 20px;
        }
        .chart-container {
          height: 250px;
          position: relative;
        }

        .alerts-section {
          margin-bottom: 30px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        .section-title {
          color: #002366;
          font-size: 20px;
          font-weight: 600;
          overflow-wrap: break-word;
        }
        .view-all {
          color: #0f52ba;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
        .view-all:hover {
          text-decoration: underline;
        }
        .alert-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-left: 4px solid;
          animation: fadeIn 0.6s ease both 0.22s;
        }
        .alert-card.warning {
          border-left-color: #f39c12;
        }
        .alert-card.danger {
          border-left-color: #e74c3c;
        }
        .alert-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .alert-icon.warning {
          background: rgba(243, 156, 18, 0.1);
          color: #f39c12;
        }
        .alert-icon.danger {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        .alert-content {
          flex: 1;
          min-width: 0;
        }
        .alert-title {
          color: #002366;
          font-weight: 600;
          margin-bottom: 5px;
          overflow-wrap: break-word;
        }
        .alert-description {
          color: #c0b2a0;
          font-size: 13px;
          overflow-wrap: break-word;
        }
        .alert-time {
          color: #c0b2a0;
          font-size: 12px;
          white-space: nowrap;
        }

        .reports-section {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.6s ease both 0.26s;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 10px 18px;
          border: 2px solid rgba(192, 178, 160, 0.2);
          background: white;
          border-radius: 10px;
          color: #002366;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .filter-btn:hover {
          border-color: #0f52ba;
          color: #0f52ba;
        }
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .reports-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        .reports-table th {
          text-align: left;
          padding: 15px;
          color: #002366;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(247, 245, 240, 0.5);
          word-break: break-word;
        }
        .reports-table td {
          padding: 18px 15px;
          border-bottom: 1px solid rgba(192, 178, 160, 0.1);
          color: #002366;
          font-size: 14px;
          word-break: break-word;
        }
        .reports-table tr:hover {
          background: rgba(15, 82, 186, 0.02);
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        .status-badge.pending {
          background: rgba(243, 156, 18, 0.1);
          color: #f39c12;
        }
        .status-badge.approved {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }
        .status-badge.rejected {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        .action-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .action-btn.approve {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }
        .action-btn.approve:hover {
          background: #2ecc71;
          color: white;
        }
        .action-btn.reject {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }
        .action-btn.reject:hover {
          background: #e74c3c;
          color: white;
        }
        .action-btn.view {
          background: rgba(15, 82, 186, 0.1);
          color: #0f52ba;
        }
        .action-btn.view:hover {
          background: #0f52ba;
          color: white;
        }

        /* Animations */
        @keyframes fadeOpacity {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeSlideLeft {
          from {
            opacity: 0;
            transform: translate(-24px, 0);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* BACKDROP */
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 90;
          display: none;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Desktop: hide hamburger */
        #menu-toggle {
          display: none;
        }

        /* Mobile: convert sidebar to full-screen dropdown from top */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 100vh;
            left: 0;
            right: 0;
            top: 0;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            animation: none;
          }
          .sidebar.active {
            transform: translateY(0);
          }
          .floating-toggle {
            display: none;
          }

          .main-content,
          .main-content.collapsed {
            margin-left: 0;
            padding: 20px 16px 24px;
          }

          #menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 200;
            font-size: 22px;
            color: #002366;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: none;
            background: rgba(247, 245, 240, 0.95);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            cursor: pointer;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-right {
            width: 100%;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
          .search-box {
            width: 100%;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sidebar-backdrop {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default DaerahDashboard;

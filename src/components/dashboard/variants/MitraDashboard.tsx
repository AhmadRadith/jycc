import React, { useEffect, useRef, useState, FormEvent } from "react";
import Head from "next/head";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

export default function SppgDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/mitra");
        const data = await res.json();
        if (data.reports) {
          const mappedReports = data.reports.map((r: any) => ({
            id: r._id,
            school: r.schoolName || r.schoolId || "Sekolah",
            menu: "Menu Standar",
            qty: 100,
            status: r.status,
            time: new Date(r.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date(r.createdAt).toLocaleDateString(),
            type: r.category || "Laporan Umum",
          }));
          setReports(mappedReports);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);


  const verifiedReports = reports.filter((r) => r.status === "resolved");
  const pendingReports = reports.filter(
    (r) => r.status === "pending" || r.status === "escalated"
  );

  return (
    <MbgSidebarLayout
      activeMenu="dashboard"
      role="mitra"
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
    >
      <Head>
        <title>Mitra Dashboard - MBG</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Mitra</h1>
        <p className="text-gray-500">Selamat datang, CV Mitra Sejahtera</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Ketepatan Waktu
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.onTimeDelivery || 0}%
              </h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <i className="fas fa-clock"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Rating Rata-rata
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.averageRating || 0}
              </h3>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <i className="fas fa-star"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Total Pengiriman
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.totalDeliveries || 0}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <i className="fas fa-truck"></i>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">
                Isu Pending
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.pendingIssues || 0}
              </h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <i className="fas fa-exclamation-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            ✅ Laporan yang Sudah Diverifikasi oleh BGN
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Sekolah</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Jenis Laporan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verifikasi Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {verifiedReports.length > 0 ? (
                verifiedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{report.school}</td>
                    <td className="px-6 py-4">{report.date}</td>
                    <td className="px-6 py-4">{report.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Diverifikasi
                      </span>
                    </td>
                    <td className="px-6 py-4">Admin BGN</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada laporan terverifikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            ⏳ Laporan yang Belum Diverifikasi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Sekolah</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bukti Foto</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {pendingReports.length > 0 ? (
                pendingReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{report.school}</td>
                    <td className="px-6 py-4">{report.date}</td>
                    <td className="px-6 py-4">{report.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          report.status === "escalated"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status === "escalated"
                          ? "Eskalasi"
                          : "Menunggu"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {report.status === "escalated" ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-colors ${
                          report.status === "escalated"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        <i
                          className={`fas ${
                            report.status === "escalated"
                              ? "fa-exclamation"
                              : "fa-eye"
                          }`}
                        />
                        {report.status === "escalated"
                          ? " Tinjau"
                          : " Verifikasi"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada laporan tertunda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            Data Supplier Mitra
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Komoditas</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">CV. Pangan Sehat</td>
                <td className="px-6 py-4">Beras, Sayur</td>
                <td className="px-6 py-4">0812...</td>
                <td className="px-6 py-4">Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            Harga Bahan Makanan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Bahan</th>
                <th className="px-6 py-4">Harga (per kg)</th>
                <th className="px-6 py-4">Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">Beras</td>
                <td className="px-6 py-4">Rp 12.500</td>
                <td className="px-6 py-4 text-green-600 font-bold">↑ 2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            Ambil Bukti Foto Verifikasi
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Gunakan kamera untuk foto: kedaluwarsa, kebersihan, proses memasak.
        </p>
        {!cameraActive && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => setCameraActive(true)}
          >
            <i className="fas fa-camera" /> Buka Kamera
          </button>
        )}
        {cameraActive && (
          <div id="cameraContainer" className="mt-5 block">
            <video
              ref={videoRef}
              className="w-full rounded-xl"
              autoPlay
              playsInline
            />
            <div className="mt-3 flex gap-3">
              <button
                id="captureBtn"
                className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                onClick={() => alert("Fitur ambil foto akan segera hadir.")}
              >
                <i className="fas fa-camera" /> Ambil Foto
              </button>
              <button
                id="closeCamera"
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                onClick={() => setCameraActive(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Polling */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-900">
            Input Polling Menu Makanan
          </h3>
        </div>
        <form
          className="space-y-4"
          id="pollForm"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Fitur polling akan segera hadir.");
          }}
        >
          <input
            type="text"
            placeholder="Judul Polling"
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
          />
          <select
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
          >
            <option value="">Pilih Jenis</option>
            <option value="pagi">Sarapan</option>
            <option value="siang">Makan Siang</option>
          </select>
          <input
            type="date"
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus" /> Buat Polling
          </button>
        </form>
      </div>
    </MbgSidebarLayout>
  );
}

{
  /* Styles from tka.tsx */
}
<style jsx global>{`
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
  .main-content {
    animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.1s;
  }
`}</style>;

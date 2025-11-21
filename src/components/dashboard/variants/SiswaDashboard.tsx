import React, { FormEvent, useState, useEffect } from "react";
import Head from "next/head";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";
import {
  School,
  MapPin,
  Sun,
  Clock,
  CheckCircle,
  History,
  Vote,
  Send,
  LogOut,
  Utensils,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

interface MenuNutrition {
  kalori: string;
  protein: string;
  karbo: string;
  lemak: string;
}

interface Menu {
  date: string;
  today: string;
  nutrition: MenuNutrition;
}

interface HistoryItem {
  date: string;
  menu: string;
  status: string;
}

interface ApiHistoryItem {
  createdAt: string;
  status: string;
}

export default function DashboardSiswa() {
  const [attendanceDone, setAttendanceDone] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [schoolInfo, setSchoolInfo] = useState({
    name: "Loading...",
    province: "Loading...",
  });
  const [menu, setMenu] = useState<Menu | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/siswa");
        const data = await res.json();
        if (data.menu) {
          setMenu(data.menu);
        }
        if (data.school) {
          setSchoolInfo(data.school);
        }
        if (data.studentId) {
          setStudentId(data.studentId);
        }
        if (typeof data.attendanceDone === "boolean") {
          setAttendanceDone(data.attendanceDone);
        }
        if (data.history) {
          const mappedHistory = data.history.map((h: ApiHistoryItem) => ({
            date: new Date(h.createdAt).toLocaleDateString(),
            menu: "Menu Standar",
            status: h.status === "approved" ? "Hadir" : "Pending",
          }));
          setHistory(mappedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const handleAttendanceClick = async () => {
    if (!studentId) {
      alert("Data siswa tidak ditemukan. Silakan refresh halaman.");
      return;
    }
    if (window.confirm("Apakah kamu sudah makan siang hari ini?")) {
      try {
        const res = await fetch("/api/student/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, status: "received" }),
        });
        if (res.ok) {
          setAttendanceDone(true);
        } else {
          alert("Gagal mencatat presensi. Silakan coba lagi.");
        }
      } catch (error) {
        console.error("Error submitting attendance:", error);
        alert("Terjadi kesalahan saat mengirim data.");
      }
    }
  };

  const handlePollSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      "Terima kasih! Pilihanmu akan membantu kami membuat menu yang lebih enak!"
    );
    e.currentTarget.reset();
  };

  return (
    <MbgSidebarLayout
      role="siswa"
      activeMenu="dashboard"
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
    >
      <Head>
        <title>Dashboard Siswa - Makan Siang MBG</title>
      </Head>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center relative mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Halo! 👋</h1>
          <p className="text-gray-500 text-sm">
            Dashboard Siswa - MBGsecure oleh MIT
          </p>
          <a
            href="/lapor"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all hover:-translate-y-1"
          >
            <MessageSquare size={16} /> Lapor Masalah
          </a>

          <div className="absolute -top-8 -right-4 w-24 opacity-90 hidden sm:block">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="35" fill="#B0E0E6" />
              <circle cx="40" cy="42" r="7" fill="white" />
              <circle cx="60" cy="42" r="7" fill="white" />
              <circle cx="40" cy="42" r="3.5" fill="black" />
              <circle cx="60" cy="42" r="3.5" fill="black" />
              <path
                d="M 45 58 Q 50 63, 55 58"
                stroke="#333"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="50" cy="30" r="12" fill="#FFD700" />
              <circle cx="50" cy="30" r="6" fill="#FFA500" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-lg">
            <School className="text-blue-500" /> Sekolah & Provinsi
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-gray-800">
              {schoolInfo.name}
            </div>
            <div className="text-gray-500 flex items-center gap-2 text-sm">
              <MapPin size={14} /> {schoolInfo.province}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-lg">
            <Sun className="text-orange-500" /> Menu Makan Siang Hari Ini
          </div>
          <div className="bg-blue-50 p-6 rounded-xl text-center mb-4">
            <div className="text-blue-900 font-semibold mb-2 text-lg">
              {menu ? menu.date : "Memuat Tanggal..."}
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              {menu ? menu.today : "Memuat Menu..."}
            </h3>
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-blue-200 border-dashed">
              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-500 font-medium">
                  Kalori
                </span>
                <span className="text-sm font-bold text-blue-900">
                  {menu?.nutrition?.kalori ?? "..."}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-500 font-medium">
                  Protein
                </span>
                <span className="text-sm font-bold text-blue-900">
                  {menu?.nutrition?.protein ?? "..."}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-500 font-medium">Karbo</span>
                <span className="text-sm font-bold text-blue-900">
                  {menu?.nutrition?.karbo ?? "..."}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-blue-500 font-medium">Lemak</span>
                <span className="text-sm font-bold text-blue-900">
                  {menu?.nutrition?.lemak ?? "..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-lg">
            <Clock className="text-blue-500" /> Jadwal Makan Siang
          </div>
          <div className="bg-blue-50 text-blue-600 font-bold text-center py-3 rounded-xl text-lg">
            12.00 - 13.00 WIB
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-lg">
            <CheckCircle className="text-green-500" /> Presensi Makan Siang
          </div>
          <button
            onClick={handleAttendanceClick}
            disabled={attendanceDone}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              attendanceDone
                ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-green-400 to-green-600 text-white hover:shadow-green-500/30 hover:-translate-y-1"
            }`}
          >
            {attendanceDone ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={20} /> Sudah Makan Siang
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Utensils size={20} /> Saya Sudah Makan Siang Hari Ini!
              </span>
            )}
          </button>
          {attendanceDone && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium animate-fade-in">
              ✅ Terima kasih! Presensi makan siangmu telah tercatat.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold text-lg">
            <History className="text-purple-500" /> Riwayat Makan Siang
          </div>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0"
                >
                  <div className="font-medium text-gray-700">{item.date}</div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                    {item.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-4">
                Memuat riwayat...
              </div>
            )}
          </div>
        </div>

        {/* Polling */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-lg">
            <Vote className="text-pink-500" /> Pilih Menu Makan Siang Favoritmu!
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Pilih menu makan siang yang ingin kamu makan minggu depan!
          </p>
          <form onSubmit={handlePollSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Menu Makan Siang Favorit
              </label>
              <select
                required
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
              >
                <option value="">Pilih menu favoritmu</option>
                <option value="nasi-goreng">Nasi Goreng Kampung</option>
                <option value="mie-ayam">Mie Ayam</option>
                <option value="soto-ayam">Soto Ayam</option>
                <option value="gado-gado">Gado-Gado</option>
                <option value="nasi-ayam-kecap">Nasi Ayam Kecap</option>
                <option value="nasi-bakar-ayam">Nasi Bakar Ayam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Saran untuk Menu Makan Siang
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Tambahkan lebih banyak sayur, kurangi rasa manis, dll."
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Send size={18} /> Kirim Pilihanmu
            </button>
          </form>
        </div>

        <div className="text-center text-gray-400 text-xs mt-8 pb-8">
          © 2025 MBGsecure - Program Makan Bergizi Gratis
        </div>
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

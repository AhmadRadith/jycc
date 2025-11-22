import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  School,
  Headset,
  AlertTriangle,
  UserPlus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  FileText,
  Settings,
  Bell,
  Users,
  ChartLine,
  FileSignature,
  BarChart3,
  Archive,
} from "lucide-react";

type MenuKey =
  | "dashboard"
  | "distribusi"
  | "sekolah"
  | "lapor"
  | "quality"
  | "laporan"
  | "verifikasi"
  | "peringatan"
  | "users"
  | "murid"
  | "notifikasi"
  | "pengaturan"
  | "reports"
  | "stats"
  | "archive"
  | "laporan-siswa";

interface MenuItem {
  key: MenuKey;
  label: string;
  icon?: React.ElementType;
  iconClass?: string;
  href: string;
  badge?: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const UNIFIED_MENU: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "distribusi",
    label: "Distribusi Makanan",
    icon: Utensils,
    href: "/dashboard?tab=distribution",
  },
  {
    key: "sekolah",
    label: "Program Sekolah",
    icon: School,
    href: "/dashboard?tab=schools",
  },
  {
    key: "lapor",
    label: "Lihat seluruh Laporan",
    icon: Headset,
    href: "/lapor",
  },
  {
    key: "peringatan",
    label: "Peringatan",
    icon: AlertTriangle,
    href: "/dashboard?tab=alerts",
  },
  {
    key: "users",
    label: "Manajemen User",
    icon: UserPlus,
    href: "/dashboard?tab=addUser",
  },
];

const SEKOLAH_MENU: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "murid",
    label: "Data Murid",
    icon: Users,
    href: "/dashboard?tab=murid",
  },
  {
    key: "laporan",
    label: "Riwayat Laporan",
    icon: FileText,
    href: "/dashboard?tab=laporan",
  },
  {
    key: "laporan-siswa",
    label: "Laporan Siswa",
    icon: FileSignature,
    href: "/dashboard?tab=laporan-siswa",
  },
  {
    key: "lapor",
    label: "Lapor Sesuatu",
    icon: AlertTriangle,
    href: "/lapor",
  },
  {
    key: "notifikasi",
    label: "Notifikasi",
    icon: Bell,
    href: "/dashboard?tab=notifikasi",
  },
  {
    key: "pengaturan",
    label: "Pengaturan",
    icon: Settings,
    href: "/dashboard?tab=pengaturan",
  },
];

const DAERAH_MENU: MenuSection[] = [
  {
    title: "Menu Utama",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        iconClass: "fas fa-tachometer-alt",
        href: "/dashboard",
      },
      {
        key: "distribusi",
        label: "Distribusi Makanan",
        iconClass: "fas fa-utensils",
        href: "/dashboard?tab=distribution",
      },
      {
        key: "sekolah",
        label: "Program Sekolah",
        iconClass: "fas fa-school",
        href: "/dashboard?tab=schools",
      },
      {
        key: "quality",
        label: "Laporan Kualitas",
        iconClass: "fas fa-chart-line",
        href: "/dashboard?tab=quality",
      },
      // {
      //   key: "verifikasi",
      //   label: "Verifikasi SPPG",
      //   iconClass: "fas fa-file-signature",
      //   href: "/dashboard?tab=verification",
      //   badge: "7",
      // },
      {
        key: "peringatan",
        label: "Peringatan",
        iconClass: "fas fa-exclamation-triangle",
        href: "/dashboard?tab=alerts",
        badge: "3",
      },
    ],
  },
  {
    title: "Data & Analisis",
    items: [
      {
        key: "reports",
        label: "Laporan Wilayah",
        iconClass: "fas fa-file-alt",
        href: "/dashboard?tab=reports",
      },
      {
        key: "stats",
        label: "Statistik Daerah",
        iconClass: "fas fa-chart-bar",
        href: "/dashboard?tab=stats",
      },
      {
        key: "archive",
        label: "Arsip Data",
        iconClass: "fas fa-archive",
        href: "/dashboard?tab=archive",
      },
    ],
  },
  {
    title: "Pengguna",
    items: [
      {
        key: "users",
        label: "Tambah Akun Sekolah",
        iconClass: "fas fa-school",
        href: "/dashboard?tab=addUser",
      },
    ],
  },
];

const PUSAT_MENU: MenuSection[] = [
  {
    title: "Menu Utama",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        key: "distribusi",
        label: "Distribusi Makanan",
        icon: Utensils,
        href: "/dashboard?tab=distribution",
      },
      {
        key: "sekolah",
        label: "Program Sekolah",
        icon: School,
        href: "/dashboard?tab=schools",
      },
      {
        key: "quality",
        label: "Laporan Kualitas",
        icon: ChartLine,
        href: "/dashboard?tab=quality",
      },
      // {
      //   key: "verifikasi",
      //   label: "Verifikasi SPPG",
      //   icon: FileSignature,
      //   href: "/dashboard?tab=verification",
      //   badge: "7",
      // },
      {
        key: "peringatan",
        label: "Peringatan",
        icon: AlertTriangle,
        href: "/dashboard?tab=alerts",
      },
    ],
  },
  {
    title: "Data & Analisis",
    items: [
      {
        key: "reports",
        label: "Laporan Wilayah",
        icon: FileText,
        href: "/dashboard?tab=reports",
      },
      {
        key: "stats",
        label: "Statistik Nasional",
        icon: BarChart3,
        href: "/dashboard?tab=stats",
      },
      {
        key: "archive",
        label: "Arsip Data",
        icon: Archive,
        href: "/dashboard?tab=archive",
      },
    ],
  },
  {
    title: "Pengguna",
    items: [
      {
        key: "users",
        label: "Manajemen User",
        icon: UserPlus,
        href: "/dashboard?tab=addUser",
      },
    ],
  },
];

const MENU_CONFIG: Record<string, MenuSection[]> = {
  pusat: PUSAT_MENU,
  daerah: DAERAH_MENU,
  sekolah: [{ title: "Menu Utama", items: SEKOLAH_MENU }],
  mitra: [
    {
      title: "Menu Utama",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
        {
          key: "distribusi",
          label: "Distribusi Makanan",
          icon: Utensils,
          href: "/dashboard?tab=distribution",
        },
        {
          key: "sekolah",
          label: "Sekolah yang Ditanggung",
          icon: School,
          href: "/dashboard?tab=schools",
        },
        {
          key: "lapor",
          label: "Lihat seluruh Laporan",
          icon: Headset,
          href: "/lapor",
        },
        {
          key: "peringatan",
          label: "Peringatan",
          icon: AlertTriangle,
          href: "/dashboard?tab=alerts",
        },
      ],
    },
  ],
  murid: [
    {
      title: "Menu Utama",
      items: UNIFIED_MENU.filter(
        (item) => item.key === "dashboard" || item.key === "lapor"
      ),
    },
  ],
  siswa: [
    {
      title: "Menu Utama",
      items: UNIFIED_MENU.filter(
        (item) => item.key === "dashboard" || item.key === "lapor"
      ),
    },
  ],
};

interface MbgSidebarLayoutProps {
  children: React.ReactNode;
  activeMenu?: MenuKey;
  contentClassName?: string;
  role?: string;
  badges?: Record<string, string | number>;
  menuItems?: MenuSection[];
}

export function MbgSidebarLayout({
  children,
  activeMenu = "dashboard",
  contentClassName = "",
  role = "pusat",
  badges = {},
  menuItems,
}: MbgSidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    setSidebarCollapsed(false);
  }, []);

  const closeSidebarIfMobile = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleMainContentClick = useCallback(() => {
    if (!sidebarOpen) return;
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  const mainContentClasses = useMemo(() => {
    return [
      "transition-all duration-250 ease-out min-h-screen",
      sidebarCollapsed ? "ml-0 md:ml-[90px]" : "ml-0 md:ml-[260px]",
      contentClassName || "bg-[#f7f5f0]",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }, [sidebarCollapsed, contentClassName]);

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-sans text-slate-900">
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((open) => !open)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 text-blue-900 md:hidden hover:bg-white transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-[linear-gradient(135deg,#002366_0%,#0f52ba_100%)] text-white z-50 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-2xl
          ${
            sidebarOpen ? "translate-y-0" : "-translate-y-full md:translate-y-0"
          }
          ${sidebarCollapsed ? "w-[90px]" : "w-full md:w-[260px]"}
          md:translate-x-0 flex flex-col
        `}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, transparent 30%, #c0b2a0 30%, #c0b2a0 32%, transparent 32%)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className={`relative z-10 px-6 py-6 border-b border-white/10 ${
            sidebarCollapsed ? "text-center px-2" : ""
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Shield className="text-blue-300 shrink-0" size={24} />
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-lg leading-tight">MBGsecure</h2>
                <p className="text-xs text-blue-200">Badan Gizi Nasional</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setSidebarCollapsed((c) => !c)}
          className="hidden md:flex absolute -right-4 top-20 w-8 h-8 bg-white text-blue-600 rounded-full shadow-lg items-center justify-center hover:bg-blue-50 transition-transform z-50 border border-blue-100"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>

        <nav className="flex-1 overflow-y-auto py-6 relative z-10 scrollbar-none">
          <div className="space-y-6">
            {(menuItems || MENU_CONFIG[role] || MENU_CONFIG["pusat"]).map(
              (section, idx) => (
                <div key={idx}>
                  {!sidebarCollapsed && section.title && (
                    <div className="px-[25px] mb-[10px] text-[11px] font-semibold text-white/50 uppercase tracking-[1px]">
                      {section.title}
                    </div>
                  )}
                  <div className="space-y-0">
                    {section.items.map((item) => {
                      const isActive = item.key === activeMenu;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={(e) => {
                            if (item.href === "#") e.preventDefault();
                            closeSidebarIfMobile();
                          }}
                          className={`
                          group flex items-center gap-3 px-[25px] py-[14px] transition-all duration-200 border-l-4
                          ${
                            isActive
                              ? "bg-white/15 text-white border-[#c0b2a0]"
                              : "text-white/80 hover:bg-white/15 hover:text-white border-transparent"
                          }
                          ${sidebarCollapsed ? "justify-center px-2" : ""}
                        `}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          {item.iconClass ? (
                            <i
                              className={`${
                                item.iconClass
                              } shrink-0 text-[20px] w-[20px] text-center ${
                                isActive
                                  ? "text-blue-300"
                                  : "group-hover:text-blue-200"
                              }`}
                            />
                          ) : Icon ? (
                            <Icon
                              size={20}
                              className={`shrink-0 ${
                                isActive
                                  ? "text-blue-300"
                                  : "group-hover:text-blue-200"
                              }`}
                            />
                          ) : null}

                          {!sidebarCollapsed && (
                            <span className="flex-1 truncate text-sm">
                              {item.label}
                            </span>
                          )}

                          {(badges[item.key] || item.badge) && (
                            <span
                              className={`
                            bg-red-500 text-white font-bold rounded-full flex items-center justify-center
                            ${
                              sidebarCollapsed
                                ? "absolute top-2 right-2 w-2 h-2 p-0"
                                : "text-[10px] px-1.5 py-0.5"
                            }
                          `}
                            >
                              {!sidebarCollapsed &&
                                (badges[item.key] || item.badge)}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <button
            data-action="logout"
            className={`
              flex items-center gap-3 w-full px-3 py-3 rounded-xl text-white bg-red-500/20 hover:bg-red-500/30 transition-all duration-200
              ${sidebarCollapsed ? "justify-center px-2" : ""}
            `}
            title={sidebarCollapsed ? "Keluar" : undefined}
          >
            <i className="fas fa-sign-out-alt shrink-0 text-[20px] w-[20px] text-center" />
            {!sidebarCollapsed && (
              <span className="flex-1 text-left text-sm font-medium">
                Keluar
              </span>
            )}
          </button>
        </div>
      </aside>

      <main className={mainContentClasses} onClick={handleMainContentClick}>
        {children}
      </main>
    </div>
  );
}

export type { MenuKey as SidebarMenuKey };

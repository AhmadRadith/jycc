import type { GetServerSideProps } from "next";

import PusatDashboard from "@/components/dashboard/variants/PusatDashboard";
import DaerahDashboard from "@/components/dashboard/variants/DaerahDashboard";
import SekolahDashboard from "@/components/dashboard/variants/SekolahDashboard";
import SiswaDashboard from "@/components/dashboard/variants/SiswaDashboard";
import MitraDashboard from "@/components/dashboard/variants/MitraDashboard";
import { getSessionUserFromCookies } from "@/lib/session";
import {
  getDashboardPathForRole,
  getRoleDisplayName,
  normalizeRoleSlug,
  type RoleSlug,
} from "@/shared/roles";

export type DashboardPageProps = {
  activeRole: RoleSlug | null;
};

const DEFAULT_ROLE: RoleSlug = "pusat";

const DashboardPage = ({ activeRole }: DashboardPageProps) => {
  if (activeRole === "sekolah") {
    return <SekolahDashboard />;
  }

  if (activeRole === "murid") {
    return <SiswaDashboard />;
  }

  if (activeRole === "mitra") {
    return <MitraDashboard />;
  }

  const isShellRole = activeRole === "pusat" || activeRole === "daerah";
  const resolvedRole: RoleSlug = isShellRole ? activeRole : DEFAULT_ROLE;

  return resolvedRole === "daerah" ? <DaerahDashboard /> : <PusatDashboard />;
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps<
  DashboardPageProps
> = async (context) => {
  const user = getSessionUserFromCookies(context.req?.headers?.cookie);

  if (!user) {
    const nextParam = encodeURIComponent(context.resolvedUrl || "/dashboard");
    return {
      redirect: {
        destination: `/login?next=${nextParam}`,
        permanent: false,
      },
    };
  }

  const roleSlug = normalizeRoleSlug(user.role);
  if (!roleSlug) {
    return {
      props: {
        activeRole: null,
      },
    };
  }

  const destinationPath = getDashboardPathForRole(roleSlug);
  const [currentPath, currentQuery] = context.resolvedUrl.split("?");

  if (currentPath !== destinationPath) {
    const redirectUrl = currentQuery
      ? `${destinationPath}?${currentQuery}`
      : destinationPath;
    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      activeRole: roleSlug,
    },
  };
};

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getSessionUserFromCookies } from '@/lib/session';
import { getDashboardPathForRole } from '@/shared/roles';

export default function IndexPage() {
  return null;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Record<string, never>>> {
  const user = getSessionUserFromCookies(context.req?.headers?.cookie);
  const destination = user ? getDashboardPathForRole(user.role) : '/login';
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}

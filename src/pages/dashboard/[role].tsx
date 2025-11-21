import type { GetServerSideProps } from 'next';
import DashboardPage, { getServerSideProps as indexGetServerSideProps } from './index';

const toParamValue = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) {
    return value.length ? String(value[0]) : null;
  }
  return typeof value === 'string' ? value : null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roleParam = toParamValue(context.params?.role) ?? undefined;
  context.params = { ...(context.params ?? {}), role: roleParam };
  return indexGetServerSideProps(context as any);
};

export default DashboardPage;

import type { ReactNode } from 'react';

interface DashboardGridProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

const DashboardGrid = ({ left, center, right }: DashboardGridProps) => {
  return (
    <div
      className="mx-auto grid w-full max-w-none gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:gap-8 2xl:gap-10 xl:grid-cols-[18rem_minmax(0,1fr)_22rem] 2xl:grid-cols-[20rem_minmax(0,1fr)_24rem] 3xl:grid-cols-[22rem_minmax(0,1fr)_26rem]"
      data-dashboard-grid
    >
      <div className="flex flex-col gap-6" data-dashboard-column="left">
        {left}
      </div>
      <div className="flex flex-col gap-6" data-dashboard-column="center">
        {center}
      </div>
      <div className="flex flex-col gap-6" data-dashboard-column="right">
        {right}
      </div>
    </div>
  );
};

export default DashboardGrid;

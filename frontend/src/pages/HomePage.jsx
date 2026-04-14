import React from 'react';
import DateRangePicker from '../components/DateRangePicker';
import SummaryCard from '../components/SummaryCard';
import CategoryChart from '../components/CategoryChart';

export default function HomePage({ startDate, endDate, onChangeRange, summary }) {
  return (
    <div className="pb-28">
      <DateRangePicker startDate={startDate} endDate={endDate} onChangeRange={onChangeRange} />
      <SummaryCard summary={summary} />
      <CategoryChart categories={summary?.categories || []} />
    </div>
  );
}

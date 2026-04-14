import React from 'react';
import DateRangePicker from '../components/DateRangePicker';
import ExpenseList from '../components/ExpenseList';

export default function DetailPage({
  startDate,
  endDate,
  onChangeRange,
  expenses,
  onEdit,
  onDelete,
  onRefresh,
}) {
  return (
    <div className="pb-28">
      <DateRangePicker startDate={startDate} endDate={endDate} onChangeRange={onChangeRange} />
      <ExpenseList
        expenses={expenses}
        onEdit={onEdit}
        onDelete={onDelete}
        onRefresh={onRefresh}
      />
    </div>
  );
}

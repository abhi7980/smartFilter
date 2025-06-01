import React from 'react';
import DynamicDataTable from '../components/dataTable/DynamicDataTable';

const columns = {
  name: 'Name',
  age: 'Age',
  email: 'Email',
};

const data = [
  { name: 'Alice', age: 30, email: 'alice@example.com' },
  { name: 'Bob', age: 25, email: 'bob@example.com' },
  { name: 'Charlie', age: 28, email: 'charlie@example.com' },
];

export default function UserDetails() {
  const handleRowClick = (row) => {
    alert(`You clicked on ${row.name}`);
  };

  return <DynamicDataTable title={"Users"} columns={columns} data={data} onRowClick={handleRowClick} />;
}
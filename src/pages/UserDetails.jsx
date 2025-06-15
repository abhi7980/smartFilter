import React from 'react';
import DynamicDataTable from '../components/dataTable/DynamicDataTable';

const columns = {
  name: 'Name',
  email: 'Email',
mobile:'Mobile',
userName: 'Username',
password: 'Password',
role: 'Role',
};

const data = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    mobile: '9876543210',
    userName: 'alice123',
    password: 'passAlice',
    role: 'Admin',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    mobile: '8765432109',
    userName: 'bob456',
    password: 'passBob',
    role: 'User',
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    mobile: '7654321098',
    userName: 'charlie789',
    password: 'passCharlie',
    role: 'Moderator',
  },
  {
    name: 'David',
    email: 'david@example.com',
    mobile: '9876512340',
    userName: 'david01',
    password: 'passDavid',
    role: 'User',
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    mobile: '9123456780',
    userName: 'eve007',
    password: 'passEve',
    role: 'Admin',
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    mobile: '9988776655',
    userName: 'frank99',
    password: 'passFrank',
    role: 'User',
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    mobile: '8899001122',
    userName: 'grace22',
    password: 'passGrace',
    role: 'Moderator',
  },
  {
    name: 'Hank',
    email: 'hank@example.com',
    mobile: '7788990011',
    userName: 'hank007',
    password: 'passHank',
    role: 'User',
  },
  {
    name: 'Ivy',
    email: 'ivy@example.com',
    mobile: '6677889900',
    userName: 'ivy123',
    password: 'passIvy',
    role: 'Admin',
  },
  {
    name: 'Jack',
    email: 'jack@example.com',
    mobile: '5566778899',
    userName: 'jackie',
    password: 'passJack',
    role: 'User',
  },
  {
    name: 'Kate',
    email: 'kate@example.com',
    mobile: '4455667788',
    userName: 'katy',
    password: 'passKate',
    role: 'Moderator',
  },
  {
    name: 'Leo',
    email: 'leo@example.com',
    mobile: '3344556677',
    userName: 'leo44',
    password: 'passLeo',
    role: 'User',
  },
];


export default function UserDetails() {

  


  const handleRowClick = (row) => {
    alert(`You clicked on ${row.name}`);
  };

  return <DynamicDataTable title={"Users"} columns={columns} data={data} onRowClick={handleRowClick} />;
}
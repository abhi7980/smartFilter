import React, { useEffect, useState } from 'react';
import DynamicDataTable from '../components/dataTable/DynamicDataTable';
import { deleteUser, editStatus, getUsers } from '../networkHandler/services'; 
import Cookies from 'js-cookie';
import AddEditUser from '../components/forms/users/AddEditUser'
import EditUser from '../components/forms/users/EditUsers';
const columns = {
  // id: 'ID',
  name: 'Name',
  email: 'Email',
  userName: 'Username',
  mobile: 'Mobile',
  password: 'Password',
  photo: 'Photo',
  role: 'Role',
  address: 'Address',
  street: 'Street',
  landmark: 'Landmark',
  state: 'State',
  city: 'City',
  pinCode: 'PIN Code',
  // latitude: 'Latitude',
  // longitude: 'Longitude',
  status: 'Status',
  regDate: 'Registration Date',
};


export default function UserDetails() {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false)

  const PUID = JSON.parse(Cookies.get("user"))?.id



  console.log(PUID, "puid")

  const fetchUsers = async () => {
    try {
      const response = await getUsers({
        PageNo: 1,
        PageSize: 100,
        CrudAction: 'VIEW',
        Slug: 'user',
        PUID: PUID,
      });
      setData(response?.data || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };
  
    const handleDelete = async (id) => {
      console.log(id)
      await deleteUser({id:id})
      setShouldUpdate(!shouldUpdate)
    }

  useEffect(() => {
    fetchUsers();
  }, [shouldUpdate]);

  const handleRowClick = (row) => {
    alert(`You clicked on ${row.name}`);
  };

  async function toggleStatus(row,key){
const formValues = {
   Id : row.id || "",
    // Name: row.name||"",
    // Email: row.email||"",
    // Mobile: row.mobile|| "",
    // UserName: row.userName||"",
    // Password: row.password||"",
    // Role: row.role||"",
    // Address: row.address||"",
    // Landmark: row.landmark||"",
    // Street:row.street|| "",
    // City: row.city||"",
    // State: row.state|| "",
    // PinCode: row.pinCode||"",
    // AddressType: "Home",
    Status: !row.status,
  };
  const response=await editStatus({...formValues},'User')
  console.log(response)
  if (response=== "OK") setShouldUpdate(!shouldUpdate)
  }

  return (
    <DynamicDataTable
      title="Users"
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={handleRowClick}
      onToggle={toggleStatus}
      // addComponent={(props) => <AddEditUser {...props shouldUpdate={shouldUpdate}} />}
      addComponent={(props) => <AddEditUser {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate}/>}

      editComponent={(props) => <EditUser {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate}/>}
      handleDelete={handleDelete}
    />
  );
}

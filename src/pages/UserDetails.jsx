import React, { useEffect, useState } from 'react';
import DynamicDataTable from '../components/dataTable/DynamicDataTable';
import { deleteUser, getUsers } from '../networkHandler/services'; 
import Cookies from 'js-cookie';
import AddEditUser from '../components/forms/users/AddEditUser'
import EditUser from '../components/forms/users/EditUsers';
const columns = {
  id: 'ID',
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
  latitude: 'Latitude',
  longitude: 'Longitude',
  status: 'Status',
  regDate: 'Registration Date',
};

export default function UserDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false)

  const PUID = JSON.parse(Cookies.get("user"))?.id

  console.log(PUID)

  const fetchUsers = async () => {
    try {
      const response = await getUsers({
        PageNo: 1,
        PageSize: 100,
        CrudAction: 'VIEW',
        Slug: 'user',
        PUID: 63884721222350,
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

  return (
    <DynamicDataTable
      title="Users"
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={handleRowClick}
      // addComponent={(props) => <AddEditUser {...props shouldUpdate={shouldUpdate}} />}
      addComponent={(props) => <AddEditUser {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate}/>}

      editComponent={(props) => <EditUser {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate}/>}
      handleDelete={handleDelete}
    />
  );
}

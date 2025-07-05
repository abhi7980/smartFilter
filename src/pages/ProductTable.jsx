import React, { useEffect, useState } from 'react';
import DynamicDataTable from '../components/dataTable/DynamicDataTable';
import { deleteProduct, deleteUser, editStatus, getProducts, getUsers } from '../networkHandler/services'; // Replace with getProducts & deleteProduct if available
import Cookies from 'js-cookie';
import AddProduct from '../components/forms/product/AddProduct';
import EditProduct from '../components/forms/product/EditProduct';

const columns = {
  // id: 'ID',
  name: 'Name',
  about: 'Description',
  photo: "Image",
  price: 'Price',
  depositAmount: 'Deposit Amount',
  rentId: 'Rent ID',
  status: 'Active',
  regDate: 'Registration Date',
};

export default function ProductTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const PUID = JSON.parse(Cookies.get("user"))?.id;

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ // Replace getUsers with getProducts if available
        PageNo: 1,
        PageSize: 100,
        CrudAction: 'VIEW',
        Slug: 'product',
        PUID: PUID,
      });
      setData(response?.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct({ id }); // Replace deleteUser with deleteProduct if available
      setShouldUpdate(!shouldUpdate);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shouldUpdate]);

  const handleRowClick = (row) => {
    alert(`You clicked on ${row.name}`);
  };

  async function toggleStatus(row, key) {
    const formValues = {
      // Name: "",
      // RentalPlan: "",
      // ViewOrder: "",
      // About: "",
      // Price: "",
      // DepositAmount: "",
      Id: row.id,
      Status: !row.status,
    };
    const response = await editStatus({ ...formValues }, 'Product')
    console.log(response)
    if (response === "OK") setShouldUpdate(!shouldUpdate)
  }

  return (
    <DynamicDataTable
      title="Products"
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={handleRowClick}
      onToggle={toggleStatus}
      addComponent={(props) => (
        <AddProduct {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate} />
      )}
      editComponent={(props) => (
        <EditProduct {...props} setShouldUpdate={setShouldUpdate} shouldUpdate={shouldUpdate} />
      )}
      handleDelete={handleDelete}
    />
  );
}

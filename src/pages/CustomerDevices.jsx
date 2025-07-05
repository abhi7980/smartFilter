import React, { useEffect, useState } from "react";
import DynamicDataTable from "../components/dataTable/DynamicDataTable";
import { deleteMyProduct, deleteRental, editStatus, getMyproductsAdmin, getRental } from "../networkHandler/services";
import Cookies from "js-cookie";
import AddMyProduct from "../components/forms/myproduct/AddMyProduct";
import EditMyProduct from "../components/forms/myproduct/EditMyProduct";
const columns = {
  // id: "ID",
  userName: "Name",
   productName:"Device Name",
   mpMac:"Device Mac",
   mpipAddress:"Device IP",
  deviceStatus:"Device Status",
  status: "Status",
//   amount: "Registration Date",
//   status: "Status",
  regDate: "Registration Date",
};

export default function CustomerDevices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const PUID = JSON.parse(Cookies.get("user"))?.id;

  console.log(PUID);

  const fetchUsers = async () => {
    try {
      const response = await getMyproductsAdmin({
        PageNo: 1,
        PageSize: 100,
        CrudAction: "VIEW",
        Slug: "user",
        PUID: PUID,
      });
      setData(response?.data || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    await deleteMyProduct({ id: id });
    setShouldUpdate(!shouldUpdate);
  };

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
      // About: row.about||"",
      // Amount: row.amount|| "",
        Status: !row.status,
      };
      const response=await editStatus({...formValues},'MyProduct')
      console.log(response)
      if (response=== "OK") setShouldUpdate(!shouldUpdate)
      }
  return (
    <DynamicDataTable
      title="My Products"
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={handleRowClick}
      onToggle={toggleStatus}
      // addComponent={(props) => <AddEditUser {...props shouldUpdate={shouldUpdate}} />}
      addComponent={(props) => (
        <AddMyProduct
          {...props}
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
        />
      )}
      editComponent={(props) => (
        <EditMyProduct
          {...props}
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
        />
      )}
      handleDelete={handleDelete}
    />
  );
}

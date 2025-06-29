import React, { useEffect, useState } from "react";
import DynamicDataTable from "../components/dataTable/DynamicDataTable";
import { deleteRental, getMyproductsAdmin, getRental } from "../networkHandler/services";
import Cookies from "js-cookie";
import AddRental from "../components/forms/rental/AddRental";
import EditRental from "../components/forms/rental/EditRental";
const columns = {
  // id: "ID",
  name: "Name",
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
    await deleteRental({ id: id });
    setShouldUpdate(!shouldUpdate);
  };

  useEffect(() => {
    fetchUsers();
  }, [shouldUpdate]);

  const handleRowClick = (row) => {
    alert(`You clicked on ${row.name}`);
  };

  return (
    <DynamicDataTable
      title="Rentals"
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={handleRowClick}
      // addComponent={(props) => <AddEditUser {...props shouldUpdate={shouldUpdate}} />}
      addComponent={(props) => (
        <AddRental
          {...props}
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
        />
      )}
      editComponent={(props) => (
        <EditRental
          {...props}
          setShouldUpdate={setShouldUpdate}
          shouldUpdate={shouldUpdate}
        />
      )}
      handleDelete={handleDelete}
    />
  );
}

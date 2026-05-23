import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../apps.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import OIPopup from "../OpeningItemHelp.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseItemPopup from "../PurchaseItemPopup";
import { showConfirmationToast } from "../ToastConfirmation";
import PoCustomerPopup from "../SalesVendorPopup";
import PoVendorPopup from "../PurchaseVendorPopup";
import LoadingScreen from "../Loading";
import ObPopup from "../OBPopup";

const config = require("../Apiconfig");

function Openingbalance() {
  const getFinancialYearDate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

    return `${startYear}-04-01`;
  };
  const [rowData, setRowData] = useState([
    {
      serialNumber: 1,
      TransactionNo: "",
      entry_date: getFinancialYearDate(),
      party_type: "",
      party_code: "",
      itemName: "",
      balance_type: "",
      opening_amount: "",
      remarks: "",
    },
  ]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_no, settransaction_no] = useState("");
  const [additionalData, setAdditionalData] = useState({
    modified_by: "",
    created_by: "",
    modified_date: "",
    created_date: "",
  });
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [showAsterisk, setShowAsterisk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [party, setParty] = useState(null);
  const [partyDrop, setPartyDrop] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [balance_typeDrop, setbalance_typeDrop] = useState([]);
  const [isExistingData, setIsExistingData] = useState(false);
  const [showStatusColumn, setShowStatusColumn] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const openingItemPermission = permissions
    .filter((permission) => permission.screen_type === "OpeningItem")
    .map((permission) => permission.permission_type.toLowerCase());

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const financialYearStartDate = `${startYear}-04-01`;
    settransaction_date(financialYearStartDate);
  }, []);

  const handleClickOpen = (params) => {
    const GlobalSerialNumber = params.data.serialNumber;
    setGlobal(GlobalSerialNumber);

    const selectedPartType = params.data.party_type;

    if (!selectedPartType) {
      toast.warning("Please select Party Type");
      return;
    }

    if (selectedPartType === "Customer") {
      setOpen2(true);
    } else if (selectedPartType === "Vendor") {
      setOpen4(true);
    } else {
      toast.warning("Invalid Party Type Selected");
    }
  };

  const getFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12

  // FY starts April 1
  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

  // const handleCustomerSelect = async (selectedData) => {
  //   let updatedRowDataCopy = [...rowData];

  //   updatedRowDataCopy = updatedRowDataCopy.map((row) => {
  //     if (row.serialNumber === global) {
  //       return {
  //         ...row,
  //         itemCode: selectedData.customer_code,
  //         itemName: selectedData.customer_name,
  //       };
  //     }
  //     return row;
  //   });

  //   setRowData(updatedRowDataCopy);
  //   setOpen2(false);
  // };

  // const handleVendorSelect = async (selectedData) => {
  //   let updatedRowDataCopy = [...rowData];

  //   updatedRowDataCopy = updatedRowDataCopy.map((row) => {
  //     if (row.serialNumber === global) {
  //       return {
  //         ...row,
  //         itemCode: selectedData.vendor_code,
  //         itemName: selectedData.vendor_name,
  //       };
  //     }
  //     return row;
  //   });

  //   setRowData(updatedRowDataCopy);
  //   setOpen4(false);
  // };

  const handleUpdateRow = async (row) => {
    try {
    const payload = {
      mode: "U",
      transaction_no: row.TransactionNo || row.transaction_no,
      financial_year: getFinancialYear(),
      entry_date: row.entry_date,
      party_type: row.party_type,
      party_code: row.party_code,
      keyfield: row.keyfield,
      opening_amount: parseFloat(row.opening_amount),
      balance_type: row.balance_type,
      remarks: row.remarks,
      status: row.status,
      data_deleted: false,

      company_code: sessionStorage.getItem("selectedCompanyCode"), // 🔥 FIX
      created_by: sessionStorage.getItem("selectedUserCode"),      // 🔥 FIX
      created_date: new Date(),
      modified_by: sessionStorage.getItem("selectedUserCode"),
      modified_date: new Date(),
    };

    console.log("UPDATE PAYLOAD:", payload);

    const response = await fetch(
      `${config.apiBaseUrl}/opening_balanceLoopUpdate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opening_balanceData: [payload] }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Updated Successfully");
    } else {
      toast.error(data.message || "Update Failed");
    }
    } catch (err) {
      console.error(err);
      toast.error("Error updating row");
    }
  };

  const handleDeleteRow = async (row) => {
    try {
      console.log("Delete Row :", row);
      // toast.warning(`Delete clicked for ${row.party_code}`);
      // later API call here
      const response = await fetch(
        `${config.apiBaseUrl}/opening_balanceLoopDelete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opening_balanceData: [row],
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Row Deleted Successfully");

        const updatedRows = rowData.filter(
          (item) => item.serialNumber !== row.serialNumber,
        );

        setRowData(updatedRows);
      } else {
        toast.error(data.message || "Delete Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting row");
    }
  };
  const filteredOptionParty = Array.isArray(partyDrop)
    ? partyDrop.map((option) => ({
        value: option.descriptions,
        label: option.descriptions,
      }))
    : [];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getGSTReport`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPartyDrop(data);
        const defaultParty =
          data.find((item) => item.descriptions === "Customer") || data[0];
        if (defaultParty) {
          setSelectedParty({
            value: defaultParty.descriptions,
            label: defaultParty.descriptions,
          });
          setParty(defaultParty.descriptions);
        }
      })
      .catch((error) => console.error("Error fetching invoice types:", error));
  }, []);

  const partTypeOptions = Array.isArray(partyDrop)
    ? partyDrop.map((option) => option.descriptions)
    : [];

  const filteredOptionBT = balance_typeDrop.map((option) => ({
    value: option.attributedetails_code,
    label: `${option.attributedetails_code} - ${option.attributedetails_name}`,
  }));

  const balanceTypeOptions = balance_typeDrop.map(
    (option) => option.attributedetails_code,
  );

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getbalance_type`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((data) => {
        setbalance_typeDrop(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        field: "serialNumber",
        maxWidth: 80,
        sortable: false,
        editable: false,
      },
      {
        headerName: "Transaction No",
        field: "TransactionNo",
        sortable: false,
        editable: false,
        hide: true,
      },
      {
        headerName: "Action",
        field: "action",
        hide: !isExistingData,
        editable: false,
        sortable: false,
        filter: false,
        minWidth: 140,
        cellRenderer: (params) => {
          return (
            <div className="d-flex gap-2 mt-1">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleUpdateRow(params.data)}
              >
                Update
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteRow(params.data)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
      {
        headerName: "Transaction Date",
        field: "entry_date",
        sortable: false,
        hide: true,
        editable: false,
        valueFormatter: (params) => {
          if (!params.value) return "";

          const date = new Date(params.value);

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return `${year}-${month}-${day}`;
        },
      },
      {
        headerName: "Party Type",
        field: "party_type",
        editable: !showAsterisk,
        filter: true,
        sortable: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: partTypeOptions,
        },
        singleClickEdit: true,
      },
      {
        headerName: "Party Code",
        field: "party_code",
        editable: true,
        filter: true,
        sortable: false,
        cellRenderer: (params) => {
          const cellWidth = params.column.getActualWidth();
          const showSearchIcon = cellWidth > 30;

          return (
            <div
              className="position-relative d-flex align-items-center"
              style={{ minHeight: "100%" }}
            >
              <div className="flex-grow-1">{params.value}</div>

              {showSearchIcon && (
                <span
                  className="icon searchIcon"
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  onClick={() => handleClickOpen(params)}
                >
                  <i className="fa fa-search"></i>
                </span>
              )}
            </div>
          );
        },
      },
      {
        headerName: "Party Name",
        field: "itemName",
        editable: false,
        sortable: false,
        filter: true,
      },
      {
        headerName: "Balance Type",
        field: "balance_type",
        editable: !showAsterisk,
        filter: true,
        sortable: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: balanceTypeOptions,
        },
        singleClickEdit: true,
        valueFormatter: (params) => {
          const selected = filteredOptionBT.find(
            (item) => item.value === params.value,
          );

          return selected ? selected.label : params.value;
        },
      },
      {
        headerName: "Opening Amount",
        field: "opening_amount",
        editable: !showAsterisk,
        filter: true,
        sortable: false,
      },
      {
        headerName: "Remarks",
        field: "remarks",
        editable: !showAsterisk,
        filter: true,
        sortable: false,
      },
      {
        headerName: "Financial Year",
        field: "financial_year",
        editable: !showAsterisk,
        filter: true,
        hide: true,
        sortable: false,
      },
      {
        headerName: "Keyfield",
        field: "keyfield",
        editable: !showAsterisk,
        filter: true,
        hide: true,
        sortable: false,
      },
      {
        headerName: "Status",
        field: "status",
        hide: !showStatusColumn, // 👈 KEY FIX
        editable: !showAsterisk,
        filter: true,
        sortable: false,

        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: statusdrop.map((opt) => opt.attributedetails_name),
        },

        singleClickEdit: true,

        valueFormatter: (params) => {
          const selected = filteredOptionStatus.find(
            (item) => item.value === params.value,
          );

          return selected ? selected.label : params.value;
        },
      },
    ],
    [partyDrop, showAsterisk, isExistingData, statusdrop, showStatusColumn],
  );

  const handleItemCode = async (params) => {
    setLoading(true);
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    try {
      const response = await fetch(`${config.apiBaseUrl}/getitemcodepurdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_code, Item_code: params.data.itemCode }),
      });

      if (response.ok) {
        const searchData = await response.json();
        const updatedRow = rowData.map((row) => {
          if (row.party_code === params.data.itemCode) {
            const matchedItem = searchData.find((item) => item.id === row.id);
            if (matchedItem) {
              return {
                ...row,
                itemCode: matchedItem.Item_code,
                itemName: matchedItem.Item_name,
              };
            }
          }
          return row;
        });
        setRowData(updatedRow);
        console.log(updatedRow);
      } else if (response.status === 404) {
        toast.warning("Data not found!", {
          onClose: () => {
            const updatedRowData = rowData.map((row) => {
              if (row.itemCode === params.data.itemCode) {
                return {
                  ...row,
                  itemCode: "",
                  itemName: "",
                };
              }
              return row;
            });
            setRowData(updatedRowData);
          },
        });
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItem = async (selectedData) => {
    console.log("Selected Data:", selectedData);
    let updatedRowDataCopy = [...rowData];
    let highestSerialNumber = updatedRowDataCopy.reduce(
      (max, row) => Math.max(max, row.serialNumber),
      0,
    );

    selectedData.forEach((item) => {
      const existingItemWithSameCode = updatedRowDataCopy.find(
        (row) => row.serialNumber === global && row.itemCode === globalItem,
      );

      if (existingItemWithSameCode) {
        console.log("if", existingItemWithSameCode);
        existingItemWithSameCode.itemCode = item.itemCode;
        existingItemWithSameCode.itemName = item.itemName;
      } else {
        console.log("else");
        highestSerialNumber += 1;
        const newRow = {
          serialNumber: highestSerialNumber,
          itemCode: item.itemCode,
          itemName: item.itemName,
        };
        updatedRowDataCopy.push(newRow);
      }
    });

    setRowData(updatedRowDataCopy);
    return true;
  };

  const defaultColDef = {
    resizable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleCellValueChanged = (params) => {
    const { colDef, rowIndex, newValue } = params;

    const lastRowIndex = rowData.length - 1;

    if (colDef.field === "opening_amount") {
      const amount = parseFloat(newValue);

      if (amount > 0 && rowIndex === lastRowIndex) {
        const serialNumber = rowData.length + 1;

        const newRowData = {
          serialNumber,
          TransactionNo: "",
          entry_date: getFinancialYearDate(),
          party_type: "",
          party_code: "",
          itemName: "",
          balance_type: "",
          opening_amount: "",
          remarks: "",
        };

        setRowData((prevRowData) => [...prevRowData, newRowData]);
      }
    }
  };

  // const handleSaveButtonClick = async () => {
  //   if (!transaction_date) {
  //     toast.warning("Missing require field");
  //     setError(" ");
  //     return;
  //   }

  //   const hasValidData = rowData.some(
  //     (row) =>
  //       row?.itemCode?.trim() !== "" ||
  //       row?.itemName?.trim() !== "" ||
  //       row?.purchaseQty?.trim() !== "",
  //   );

  //   if (!hasValidData) {
  //     toast.warning("No valid data available to save");
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const Header = {
  //       company_code: sessionStorage.getItem("selectedCompanyCode"),
  //       transaction_date,
  //       created_by: sessionStorage.getItem("selectedUserCode"),
  //     };

  //     const response = await fetch(`${config.apiBaseUrl}/openingitemhdr`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(Header),
  //     });

  //     if (response.ok) {
  //       const searchData = await response.json();
  //       console.log(searchData);
  //       const [{ transaction_no }] = searchData;
  //       settransaction_no(transaction_no);
  //       await OpeningItemDetails(transaction_no);
  //       toast.success("Data Inserted Successfully");
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message || "Failed to insert sales data");
  //       console.error(errorResponse.details || errorResponse.message);
  //     }
  //   } catch (error) {
  //     console.error("Error inserting data:", error);
  //     toast.error("Error inserting data: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async () => {
    try {
      setLoading(true);

      const opening_balanceData = rowData
        .filter(
          (row) =>
            row.party_code &&
            row.party_type &&
            row.opening_amount &&
            row.balance_type,
        )
        .map((row) => ({
          transaction_no: "",
          financial_year: getFinancialYear(),
          entry_date: row.entry_date,
          party_type: row.party_type,
          party_code: row.party_code,
          keyfield: "",
          opening_amount: parseFloat(row.opening_amount),
          balance_type: row.balance_type,
          remarks: row.remarks || "",
          status: "Active",
          data_deleted: false,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          created_by: sessionStorage.getItem("selectedUserCode"),
          created_date: new Date(),
          modified_by: "",
          modified_date: null,
        }));

      console.log("Payload :", opening_balanceData);

      if (opening_balanceData.length === 0) {
        toast.warning("Please enter grid data");
        return;
      }

      const response = await fetch(
        `${config.apiBaseUrl}/opening_balanceLoopInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opening_balanceData,
          }),
        },
      );

      const data = await response.json();

      console.log("Response :", data);

      if (response.ok) {
        toast.success("Data Inserted Successfully");

        // set generated transaction no
        settransaction_no(data.transaction_no);

        // update grid transaction no
        const updatedRows = rowData.map((row) => ({
          ...row,
          TransactionNo: data.transaction_no,
        }));

        setRowData(updatedRows);
      } else {
        toast.error(data.message || "Insert Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while saving");
    } finally {
      setLoading(false);
    }
  };
  const OpeningItemDetails = async (transaction_no) => {
    try {
      const validRows = rowData.filter(
        (row) => row.itemCode && row.itemName && row.billQty > 0,
      );

      for (const row of validRows) {
        const Details = {
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          created_by: sessionStorage.getItem("selectedUserCode"),
          transaction_date,
          transaction_no,
          Item_SNo: row.serialNumber,
          Item_code: row.itemCode,
          Item_name: row.itemName,
          bill_qty: row.billQty,
        };

        const response = await fetch(
          `${config.apiBaseUrl}/addOpeningItemDetail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Details),
          },
        );

        if (response.ok) {
          console.log("Data inserted successfully");
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to insert sales data");
          console.error(errorResponse.details || errorResponse.message);
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (!transaction_no) {
      setDeleteError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to delete the data?",
      async () => {
        setLoading(true);
        try {
          const detailResult = await OIDetailDelete();
          const headerResult = await OIHeaderDelete();

          if (headerResult === true && detailResult === true) {
            console.log("Data Deleted Successfully");
            toast.success("Data Deleted Successfully", {
              autoClose: true,
              onClose: () => {
                window.location.reload();
              },
            });
          } else {
            const errorMessage =
              headerResult !== true ? headerResult : detailResult;
            toast.error(errorMessage);
          }
        } catch (error) {
          console.error("Error executing API calls:", error);
          toast.error("Error occurred: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data deletion cancelled.");
      },
    );
  };

  const OIHeaderDelete = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/openingitemdelhdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_no,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (response.ok) {
        return true;
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.details || errorResponse.message);
        return errorResponse.message || errorResponse.details;
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
      return "Error occurred during header deletion.";
    }
  };

  const OIDetailDelete = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/deleteOpeningItemDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_no,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        },
      );

      if (response.ok) {
        return true;
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.details || errorResponse.message);
        return errorResponse.message || errorResponse.details;
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
      return "Error occurred during detail deletion.";
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOpeningItem(transaction_no);
    }
  };

  const handleOpeningItem = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getallOpeningItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_no: code,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });
      if (response.ok) {
        setSaveButtonVisible(false);
        setShowAsterisk(true);
        const searchData = await response.json();
        if (searchData.Header && searchData.Header.length > 0) {
          const item = searchData.Header[0];
          settransaction_date(formatDate(item.transaction_date));
          settransaction_no(item.transaction_no);
        } else {
          console.log("Header Data is empty or not found");
          settransaction_date("");
          settransaction_no("");
        }

        if (searchData.Details && searchData.Details.length > 0) {
          const updatedRowData = searchData.Details.map((item) => {
            return {
              serialNumber: item.Item_SNo,
              entry_date: formatDate(item.transaction_date),
              itemCode: item.Item_code,
              itemName: item.Item_name,
              billQty: item.bill_qty,
            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Detail Data is empty or not found");
          setRowData([
            {
              serialNumber: 1,
              itemCode: "",
              itemName: "",
              billQty: "",
            },
          ]);
        }

        console.log("data fetched successfully");
      } else if (response.status === 404) {
        toast.warning("Data not found");

        settransaction_date("");
        settransaction_no("");
        setRowData([
          {
            serialNumber: 1,
            itemCode: "",
            itemName: "",
            billQty: "",
          },
        ]);
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [global, setGlobal] = useState(null);
  const [globalItem, setGlobalItem] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
  };

  const handleOpeningBalance = () => {
    setOpen(true);
  };

  const handleOb = (selectedData) => {
    const formattedData = selectedData.map((item, index) => ({
      serialNumber: index + 1,

      TransactionNo: item.transaction_no,
      entry_date: item.entry_date,
      party_type: item.party_type,
      party_code: item.party_code,
      opening_amount: item.opening_amount,
      balance_type: item.balance_type,
      remarks: item.remarks,
      keyfield: item.keyfield,
      status: item.status,
    }));

    setRowData(formattedData);
  };

  const handleOI = (selectedData) => {
    setIsExistingData(true);

    if (selectedData && selectedData.length > 0) {
      const formattedData = selectedData.map((item, index) => ({
        serialNumber: index + 1,

        TransactionNo: item.transaction_no,
        entry_date: item.entry_date,
        party_type: item.party_type,
        party_code: item.party_code,
        itemName: item.party_code, // keep same behavior
        balance_type: item.balance_type,
        opening_amount: item.opening_amount,
        financial_year: item.financial_year,
        keyfield: item.keyfield,
        remarks: item.remarks,
        status: item.status,
      }));

      settransaction_no(selectedData[0].transaction_no);
      setRowData(formattedData);
      setShowStatusColumn(true);
    }
  };

  const OpeningBalanceDetail = async (transactionNo) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/getallOpeningItemDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_no: transactionNo,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        },
      );

      if (response.ok) {
        const searchData = await response.json();
        const newRowData = searchData.map((item, index) => ({
          serialNumber: index + 1,
          TransactionNo: item.transaction_no,
          entry_date: formatDate(item.entry_date),
          party_type: item.party_type,
          party_code: item.party_code,
          itemName: item.party_code, // temporary
          balance_type: item.balance_type,
          opening_amount: item.opening_amount,
          remarks: item.remarks,
          keyfield: item.keyfield,
          status: item.status,
        }));

        setRowData(newRowData);
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleReload = () => {
    setIsExistingData(false);
    window.location.reload();
  };

  const handleChangeParty = (selectedParty) => {
    setSelectedParty(selectedParty);
    const selectedValue = selectedParty ? selectedParty.value : "";

    setParty(selectedValue);

    // if (selectedValue === "Customer") {
    //   const shipToField = headerRowData.find((row) => row.fieldName === "Vendor / Customer Code");
    //   if (shipToField?.shipTo) {
    //     handleCustomerDetailsShipTo(shipToField.shipTo);
    //   }
    // } else if (selectedValue === "Vendor") {
    //   const shipToField = headerRowData.find((row) => row.fieldName === "Vendor / Customer Code");
    //   if (shipToField?.shipTo) {
    //     handleVendorDetailsShipTo(shipToField.shipTo);
    //   }
    // }
  };

  const handleCustomerSelect = (selectedData) => {
    const updatedRowData = [...rowData];

    if (selectedData.length > 0) {
      updatedRowData[global - 1] = {
        ...updatedRowData[global - 1],
        party_code: selectedData[0].CustomerCode,
        itemName: selectedData[0].CustomerName,
      };
    }

    setRowData(updatedRowData);
    setOpen2(false);
  };

  const handleVendorSelect = (selectedData) => {
    const updatedRowData = [...rowData];

    if (selectedData.length > 0) {
      updatedRowData[global - 1] = {
        ...updatedRowData[global - 1],
        party_code: selectedData[0].VendorCode,
        itemName: selectedData[0].VendorName,
      };
    }

    setRowData(updatedRowData);
    setOpen4(false);
  };
  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Opening Balance
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {saveButtonVisible &&
                ["add", "all permission"].some((permission) =>
                  openingItemPermission.includes(permission),
                ) && (
                  <savebutton
                    className="purbut"
                    title="Save"
                    onClick={handleSave}
                  >
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
              {["delete", "all permission"].some((permission) =>
                openingItemPermission.includes(permission),
              ) && (
                <delbutton
                  className="purbut"
                  title="Delete"
                  onClick={handleDeleteButtonClick}
                >
                  <i class="fa-solid fa-trash"></i>
                </delbutton>
              )}
              <printbutton
                className="purbut"
                title="Reload"
                onClick={handleReload}
              >
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1">
                    Opening Item
                  </h1>
                </div>
                <div class="dropdown mt-2 me-4">
                  <button
                    class="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    {saveButtonVisible && (
                      <li class="iconbutton d-flex justify-content-center text-success">
                        {["add", "all permission"].some((permission) =>
                          openingItemPermission.includes(permission),
                        ) && (
                          <icon class="icon" onClick={handleSave}>
                            <i class="fa-regular fa-floppy-disk"></i>
                          </icon>
                        )}
                      </li>
                    )}
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {["delete", "all permission"].some((permission) =>
                        openingItemPermission.includes(permission),
                      ) && (
                        <icon class="icon" onClick={handleDeleteButtonClick}>
                          <i class="fa-solid fa-trash"></i>
                        </icon>
                      )}
                    </li>
                    <li class="iconbutton  d-flex justify-content-center">
                      <icon class="icon" onClick={handleReload}>
                        <i class="fa-solid fa-arrow-rotate-right"></i>
                      </icon>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="shadow-lg p-1 bg-body-tertiary rounded  pt-4 "
          align="left"
        >
          <div className="row ms-3 mb-3 me-3">
            <div className="col-md-3 form-group ">
              <div class="exp-form-floating">
                <label
                  for="rolname"
                  className={`${deleteError && !transaction_no ? "red" : ""}`}
                >
                  Transaction No{" "}
                  {showAsterisk && <span className="text-danger">*</span>}
                </label>
                <div class="d-flex justify-content-end">
                  <input
                    id="transactionNO"
                    className="exp-input-field form-control justify-content-start"
                    type="text"
                    placeholder=""
                    required
                    title="Please fill the transaction no here"
                    value={transaction_no}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                    onChange={(e) => settransaction_no(e.target.value)}
                  />
                  <div className="position-absolute mt-1 me-2">
                    <span
                      className="icon searchIcon"
                      title="Opening Item Help"
                      onClick={handleOpeningBalance}
                    >
                      <i class="fa fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                <label
                  for="rolname"
                  className={`${error && !transaction_date ? "red" : ""}`}
                >
                  Transaction Date
                  {!showAsterisk && <span className="text-danger">*</span>}
                </label>
                <input
                  id="transactionDate"
                  className="exp-input-field form-control"
                  type="date"
                  value={transaction_date}
                  onChange={(e) => settransaction_date(e.target.value)}
                  readOnly
                  title="Transaction date is fixed and based on the financial year."
                />
              </div>
            </div>
          </div>
          <div class="ag-theme-alpine" style={{ height: 545, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={handleCellValueChanged}
              paginationAutoPageSize={true}
              pagination={true}
            />
          </div>
          <div>
            <PurchaseItemPopup
              open={open1}
              handleClose={handleClose}
              handleItem={handleItem}
            />
            <PoCustomerPopup
              open={open2}
              handleClose={handleClose}
              handleVendor={handleCustomerSelect}
            />
            <PoVendorPopup
              open={open4}
              handleClose={handleClose}
              handleVendor={handleVendorSelect}
            />
            <ObPopup
              open={open}
              handleClose={handleClose}
              handleOb={handleOI}
            />
          </div>
        </div>
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">Created_by: {additionalData.created_by}</p>
            <p className="col-md-">
              Created_date: {additionalData.created_date}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              modified_by: {additionalData.modified_by}
            </p>
            <p className="col-md-6">
              modified_date: {additionalData.modified_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Openingbalance;

import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ExpensesPopup from "./ExpensesPopUp.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PurchaseItemPopup from "./PurchaseItemPopup";
import { showConfirmationToast } from './ToastConfirmation';
import LoadingScreen from './Loading';
import { CheckboxCellEditor, CheckboxCellRenderer } from "ag-grid-community";
import swal from "sweetalert2";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import Select from "react-select";

const config = require("./Apiconfig");

const ReferenceSelectEditor = React.forwardRef((props, ref) => {

  const referenceType = props?.data?.reference_type;

  const options = props.getReferenceOptions(referenceType);

  const formattedOptions = options.map(item => ({
    value: item.value,
    label: item.label
  }));

  const selectedOption = formattedOptions.find(
    option => option.value === props.value
  );

  const [selected, setSelected] = useState(selectedOption || null);

  React.useImperativeHandle(ref, () => ({
    getValue() {
      return selected ? selected.value : "";
    }
  }));

  return (
    <div style={{ width: "100%" }}>
      <Select
        autoFocus
        menuPortalTarget={document.body}
        options={formattedOptions}
        value={selected}
        onChange={(option) => {

          setSelected(option);

          setTimeout(() => {
            props.stopEditing();
          });
        }}
        placeholder="Select..."
        isClearable
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
      />
    </div>
  );
});

function OpeningbalanceGrid() {
  const [rowData, setRowData] = useState(
    [{
      serialNumber: 1,
      expense_type: "",
      reference_type: "",
      reference_code: "",
      payment_mode: "",
      amount: "",
      description: "",
      is_approved: "",
    },]
  );
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const gridRef = useRef();
  const [transaction_date, settransaction_date] = useState("");
  const [transaction_no, settransaction_no] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  const [expense_no, setexpense_no] = useState("");
  const [expense_date, setexpense_date] = useState(getTodayDate());

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

  // Under development
  const [condrop, setCondrop] = useState([]);
  const [ExpenseTypeDrop, setExpenseTypeDrop] = useState([]);
  const [ReferenceTypeDrop, setReferenceTypeDrop] = useState([]);
  const [PaymentTypeDrop, setPaymentTypeDrop] = useState([]);
  const [IsApprovedDrop, setIsApprovedDrop] = useState([]);
  const [CustomerDrop, setCustomerDrop] = useState([]);
  const [VendorDrop, setVendorDrop] = useState([]);
  const [SiteDrop, setSiteDrop] = useState([]);



  // Use Effects
  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getExpenseType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map((option) => option.attributedetails_name);
        setExpenseTypeDrop(countries);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getReferenceType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map((option) => option.attributedetails_name);
        setReferenceTypeDrop(countries);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getExpensePaymentType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map((option) => option.attributedetails_name);
        setPaymentTypeDrop(countries);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getKids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const countries = data.map((option) => option.attributedetails_name);
        setIsApprovedDrop(countries);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getCustomerCodeExpenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Merge dept_id and dept_name
        const CustomerOptions = data.map((option) => ({
          value: option.customer_code,
          label: `${option.customer_code} - ${option.customer_name}`,
        }));

        setCustomerDrop(CustomerOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/vendorCodeDropdownExpenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Merge dept_id and dept_name
        const VendorOptions = data.map((option) => ({
          value: option.vendor_code,
          label: `${option.vendor_code} - ${option.vendor_name}`,
        }));

        setVendorDrop(VendorOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getSiteMasterExpenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Merge dept_id and dept_name
        const SiteOptions = data.map((option) => ({
          value: option.site_id,
          label: `${option.site_id} - ${option.site_name}`,
        }));

        setSiteDrop(SiteOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
    const GlobalItem = params.data.itemCode;
    setGlobalItem(GlobalItem);
    setOpen1(true);
    console.log("Opening popup...");
  };

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.serialNumber;
    const updatedRowData = rowData.filter(row => row.serialNumber !== serialNumberToDelete);
    setRowData(updatedRowData);

    if (updatedRowData.length === 0) {
      const newRow = {
        serialNumber: 1,
        itemCode: '',
        itemName: '',
        Hsn: '',
        purchaseQty: '',
        baseuom: '',
        purchaseAmt: '',
        TotalItemAmount: ''
      };
      setRowData([newRow]);
    }
    else {
      const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
        ...row,
        serialNumber: index + 1
      }));
      setRowData(updatedRowDataWithNewSerials);
    }
  };

  const getReferenceOptions = (referenceType) => {

    switch (referenceType) {

      case "Customer":
        return CustomerDrop;

      case "Vendor":
        return VendorDrop;

      case "Site":
        return SiteDrop;

      default:
        return [];
    }
  };

  const columnDefs = [
    {
      headerName: "S.No",
      field: "serialNumber",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 80,
      sortable: false,
      editable: false,
    },
    {
      headerName: "Expense Type",
      field: "expense_type",
      editable: !showAsterisk,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ExpenseTypeDrop,
      },
    },
    {
      headerName: "Reference Type",
      field: "reference_type",
      editable: !showAsterisk,
      cellStyle: { textAlign: "left" },

      cellEditor: "agSelectCellEditor",

      cellEditorParams: {
        values: ReferenceTypeDrop,
      },
    },
    {
      headerName: "Reference Code - Name",
      field: "reference_code",
      editable: !showAsterisk,
      cellStyle: { textAlign: "left" },
      flex: 2,
      cellEditor: ReferenceSelectEditor,
      cellEditorParams: {
        getReferenceOptions
      },



      valueFormatter: (params) => {

        if (!params.value) return "";

        const referenceType = params?.data?.reference_type;

        const options = getReferenceOptions(referenceType);

        const item = options.find(
          d => d.value === params.value
        );

        return item ? item.label : params.value;
      },

      valueSetter: (params) => {

        const selectedValue = params.newValue;

        const referenceType = params?.data?.reference_type;

        const options = getReferenceOptions(referenceType);

        const item = options.find(
          d => d.value === selectedValue
        );

        if (item) {

          params.data.reference_code = item.value;

          params.data.reference_name = item.label.split(" - ").slice(1).join(" - ");
          return true;
        }

        return false;
      }
    },
    {
      headerName: "Payment Mode",
      field: "payment_mode",
      editable: !showAsterisk,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: PaymentTypeDrop,
      },
    },
    {
      headerName: "Amount",
      field: "amount",
      editable: !showAsterisk,
      filter: true,
      sortable: false,
      // cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        min: 0,
        precision: 2
      }
    },
    {
      headerName: "Description",
      field: "description",
      editable: !showAsterisk,
      filter: true,
      sortable: false,
      cellEditorParams: {
        maxLength: 255,
      },
    },
    {
      headerName: "Is Approved",
      field: "is_approved",
      editable: !showAsterisk,
      cellStyle: { textAlign: "left" },
      // minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: IsApprovedDrop,
      },
    },
  ];

  const handleExpensesCode = async (params) => {
    setLoading(true);
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    const Location = sessionStorage.getItem("selectedLocationCode");
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
          if (row.itemCode === params.data.itemCode) {
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

  const handleExpenses = async (selectedData) => {
    console.log("Selected Data:", selectedData);
    let updatedRowDataCopy = [...rowData];
    let highestSerialNumber = updatedRowDataCopy.reduce(
      (max, row) => Math.max(max, row.serialNumber),
      0
    );

    selectedData.forEach((item) => {
      const existingItemWithSameCode = updatedRowDataCopy.find(
        (row) => row.serialNumber === global && row.itemCode === globalItem
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
    wrapText: true,
    flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleCellValueChanged = (params) => {
    if (params.colDef.field === "reference_type") {

      params.node.setDataValue("reference_code", "");
    }
    const { colDef, rowIndex, newValue } = params;
    const lastRowIndex = rowData.length - 1;
    if (colDef.field === 'billQty') {
      const quantity = parseFloat(newValue);

      if (quantity > 0 && rowIndex === lastRowIndex) {
        const serialNumber = rowData.length + 1;
        const newRowData = {
          serialNumber,
          itemCode: null,
          itemName: null,
          billQty: null,
        };

        setRowData(prevRowData => [...prevRowData, newRowData]);
      }
    }
  };

  const handleSaveButtonClick = async () => {
    if (!expense_date) {
      toast.warning("Missing require field");
      setError(" ");
      return;
    }

    const hasValidData = rowData.some(
      (row) =>
        row?.expense_no?.trim() !== "" ||
        row?.expense_date?.trim() !== ""
    );

    if (!hasValidData) {
      toast.warning("No valid data available to save");
      return;
    }
    setLoading(true);

    try {
      const Header = {
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        expense_date,
        created_by: sessionStorage.getItem("selectedUserCode"),
        Location: sessionStorage.getItem("selectedLocationCode")
      };

      const response = await fetch(`${config.apiBaseUrl}/Expenses_HdrInsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const [{ expense_no }] = searchData;
        setexpense_no(expense_no);
        await ExpensesDetails(expense_no);
        toast.success("Data Inserted Successfully");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const ExpensesDetails = async (expense_no) => {
    try {
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const created_by = sessionStorage.getItem("selectedUserCode");
      const Location = sessionStorage.getItem("selectedLocationCode");

      const validRows = rowData.filter((row) =>
        row.expense_type &&
        row.reference_type &&
        row.reference_code &&
        row.payment_mode &&
        Number(row.amount) > 0 &&
        row.description?.trim() !== ""
      );

      console.log("Valid Rows :", validRows);

      if (validRows.length === 0) {
        toast.warning("No valid detail rows available");
        return;
      }

      for (const row of validRows) {

        const Details = {
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          created_by: sessionStorage.getItem("selectedUserCode"),

          expense_no: expense_no,
          expense_date: expense_date,

          expense_type: row.expense_type || "",
          reference_type: row.reference_type || "",
          reference_code: row.reference_code || "",
          reference_name: row.reference_name || "",

          payment_mode: row.payment_mode || "",

          amount: Number(row.amount) || 0,

          Expens_Sno: Number(row.serialNumber) || 0,

          description: row.description || "",

          is_approved: row.is_approved || 0,
          is_closed: row.is_closed || "",

          keyfield: row.keyfield || "",
          data_deleted: row.data_deleted || "N",

          Expens_Sno: row.serialNumber,
          Location
        };

        console.log("Sending Details :", Details);

        const response = await fetch(`${config.apiBaseUrl}/ExpensesInsert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Detail inserted successfully :", result);
        } else {
          console.error("Insert Failed :", result);
          toast.error(result.message || "Failed to insert expense details");
        }
      }

    } catch (error) {
      console.error("ExpensesDetails Error :", error);
      toast.error("Error inserting expense details : " + error.message);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (!expense_no) {
      setDeleteError(" ");
      toast.warning('Error: Missing required fields');
      return;
    }

    showConfirmationToast(
      "Are you sure you want to delete the data?",
      async () => {
        setLoading(true);
        try {
          const Location = sessionStorage.getItem("selectedLocationCode");
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
            const errorMessage = headerResult !== true ? headerResult : detailResult;
            toast.error(errorMessage);
          }
        } catch (error) {
          console.error("Error executing API calls:", error);
          toast.error('Error occurred: ' + error.message);
        } finally {
          setLoading(false)
        }
      },
      () => {
        toast.info("Data deletion cancelled.");
      }
    );
  };

  const OIHeaderDelete = async () => {
    console.log(expense_date);
    try {
      const response = await fetch(`${config.apiBaseUrl}/Expenses_HdrDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expense_no,
          expense_date,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          Location: sessionStorage.getItem("selectedLocationCode")

        }),

      });
      console.log("Detail dellete successfully :", expense_date);
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

    // GET SELECTED ROW
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select a row");
      return;
    }

    // FIRST SELECTED ROW
    const selectedRow = selectedRows[0];

    try {

      const response = await fetch(`${config.apiBaseUrl}/ExpensesDelete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          expense_no,

          // ADD THIS
          Expens_Sno: selectedRow.serialNumber,

          company_code: sessionStorage.getItem("selectedCompanyCode"),

          Location_Code: sessionStorage.getItem("selectedLocationCode")

        }),
      });

      if (response.ok) {

        toast.success("Deleted Successfully");

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
  const handleAddRow = () => {
    const serialNumber = rowData.length + 1;
    const newRow = { serialNumber, itemCode: "", itemName: "", purchaseQty: 0 };
    setRowData([...rowData, newRow]);
  };

  const handleRemoveRow = () => {
    if (rowData.length > 0) {
      const updatedRowData = rowData.slice(0, -1);
      if (updatedRowData.length === 0) {
        setRowData([
          { serialNumber: 1, itemCode: "", itemName: "", purchaseQty: "" },
        ]);
      } else {
        setRowData(updatedRowData);
      }
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
      handleExpensesEnter(expense_no);
    }
  };

  const handleExpensesEnter = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getallExpensesEnter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_no: code, company_code: sessionStorage.getItem("selectedCompanyCode") }),
      });
      if (response.ok) {
        setSaveButtonVisible(false);
        setShowAsterisk(true);
        const searchData = await response.json();
        if (searchData.Header && searchData.Header.length > 0) {
          const item = searchData.Header[0];
          setexpense_date(formatDate(item.expense_date));
          setexpense_no(item.expense_no);
        } else {
          console.log("Header Data is empty or not found");
          setexpense_date("");
          setexpense_no("");
        }

        if (searchData.Details && searchData.Details.length > 0) {
          const updatedRowData = searchData.Details.map((item, index) => {
            return {
              serialNumber: index + 1,
              expense_type: item.expense_type,
              reference_type: item.reference_type,
              reference_code: item.reference_code,
              reference_name: item.reference_name,
              payment_mode: item.payment_mode,
              amount: item.amount,
              description: item.description,
              is_approved: item.is_approved,
            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Detail Data is empty or not found");
          setRowData([
            {
              serialNumber: 1,
              expense_type: "",
              reference_type: "",
              reference_code: "",
              payment_mode: "",
              amount: "",
              description: "",
              is_approved: "",
            },
          ]);
        }

        console.log("data fetched successfully");
      } else if (response.status === 404) {
        toast.warning("Data not found");

        setexpense_date("");
        setexpense_no("");
        setRowData([
          {
            serialNumber: 1,
            expense_type: "",
            reference_type: "",
            reference_code: "",
            payment_mode: "",
            amount: "",
            description: "",
            is_approved: "",
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
  const [global, setGlobal] = useState(null);
  const [globalItem, setGlobalItem] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };

  const handleOpeningBalance = () => {
    setOpen(true);
  };

  const handleOI = async (data) => {
    if (data && data.length > 0) {
      setSaveButtonVisible(false);
      setShowAsterisk(true);
      const [{ expense_no, expense_date }] = data;

      setexpense_no(expense_no);
      setexpense_date(formatDate(expense_date));

      await OpeningBalanceDetail(expense_no);
    } else {
      console.log("Data not fetched...!");
    }
  };

  const OpeningBalanceDetail = async (transactionNo) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/getallExpensesDetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_no: transactionNo, company_code: sessionStorage.getItem("selectedCompanyCode") }),
        }
      );

      if (response.ok) {
        const searchData = await response.json();
        const newRowData = [];
        searchData.forEach((item, index) => {
          const {
            expense_type,
            reference_type,
            reference_code,
            reference_name,
            payment_mode,
            amount,
            description,
            is_approved
          } = item;
          newRowData.push({
            serialNumber: index + 1,
            expense_type: expense_type,
            reference_type: reference_type,
            reference_code: reference_code,
            reference_name: reference_name,
            payment_mode: payment_mode,
            amount: amount,
            description: description,
            is_approved: is_approved
          });
        });
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
    window.location.reload();
  };

  const handleExcelDownload = () => {


    if (rowData.length === 0 ||
      !expense_no ||
      !expense_date
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data Available',
        text: 'There is no data to export.',
      });
      return;
    }

    // const headerData = [{
    //   "company code": sessionStorage.getItem('selectedCompanyCode'),
    //   "Expenses No": expense_no,
    //   "Expenses Date": expense_date
    // }];

    const transformedData = transformRowData(rowData);
    const rowDataSheet = XLSX.utils.json_to_sheet(transformedData);
    // const headerSheet = XLSX.utils.json_to_sheet(headerData);

    const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, headerSheet, "Header Data");
    XLSX.utils.book_append_sheet(workbook, rowDataSheet, "Expenses Details");

    XLSX.writeFile(workbook, "Expenses.xlsx");
  };

  const transformRowData = (data) => {
    return data.map(row => ({
      "S.No": row.serialNumber,
      "Expense Type": row.expense_type,
      "Reference Type": row.reference_type,
      "Reference Code": row.reference_code,
      "Reference Name": row.reference_name,
      "Payment Mode": row.payment_mode,
      "Amount": row.amount,
      "Description": row.description,
      "Is Approved": row.is_approved,

    }));
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div className=" d-flex justify-content-between">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut me-5">
                Expenses
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              {saveButtonVisible &&
                ["add", "all permission"].some((permission) => openingItemPermission.includes(permission)) && (
                  <savebutton className="purbut" title="Save" onClick={handleSaveButtonClick}>
                    <i class="fa-regular fa-floppy-disk"></i>
                  </savebutton>
                )}
              <printbutton className="purbut" title='excel' onClick={handleExcelDownload}>
                <i class="fa-solid fa-file-excel"></i>
              </printbutton>
              {["delete", "all permission"].some((permission) => openingItemPermission.includes(permission)) && (
                  <delbutton className="purbut" title="Delete" onClick={handleDeleteButtonClick}>
                    <i class="fa-solid fa-trash"></i>
                  </delbutton>
                )}
              <printbutton className="purbut" title="Reload" onClick={handleReload}>
                <i class="fa-solid fa-arrow-rotate-right"></i>
              </printbutton>
            </div>
            <div class="mobileview">
              <div class="d-flex justify-content-between">
                <div className="d-flex justify-content-start">
                  <h1 align="left" className="h1">
                    Expenses
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
                        {["add", "all permission"].some((permission) => openingItemPermission.includes(permission)) && (
                            <icon class="icon" onClick={handleSaveButtonClick}>
                              <i class="fa-regular fa-floppy-disk"></i>
                            </icon>
                          )}
                      </li>
                    )}
                    <li class="iconbutton  d-flex justify-content-center text-danger">
                      {["delete", "all permission"].some((permission) => openingItemPermission.includes(permission)) && (
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
                <label for="rolname" className={`${deleteError && !expense_no ? "red" : ""}`}>
                  Expenses No{showAsterisk && <span className="text-danger">*</span>}
                </label>
                <div class="d-flex justify-content-end">
                  <input
                    id="transactionNO"
                    className="exp-input-field form-control justify-content-start"
                    type="text"
                    placeholder=""
                    required
                    title="Please fill the Expenses No here"
                    value={expense_no}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                    onChange={(e) => setexpense_no(e.target.value)}
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
                <label for="rolname" className={`${error && !expense_date ? "red" : ""}`}>
                  Expenses Date{!showAsterisk && <span className="text-danger">*</span>}
                </label>
                <input
                  id="transactionDate"
                  className="exp-input-field form-control"
                  type="date"
                  value={expense_date}
                  onChange={(e) => setexpense_date(e.target.value)}
                  //   readOnly 
                  title="Please select the Expenses Date"
                />
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-content-end mb-2"
            style={{ marginRight: "50px" }}
          >
            <icon type="button" class="popups-btn" title='Add row' onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} />
            </icon>
            <icon type="button" class="popups-btn" title='Remove row' onClick={handleRemoveRow}>
              <FontAwesomeIcon icon={faMinus} />
            </icon>
          </div>
          <div class="ag-theme-alpine" style={{ height: 545, width: "100%" }}>
            <AgGridReact
              ref={gridRef}
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
            <ExpensesPopup open={open} handleClose={handleClose} handleOb={handleOI}/>
            <PurchaseItemPopup open={open1} handleClose={handleClose} handleExpenses={handleExpenses}/>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              Created By: {additionalData.created_by}
            </p>
            <p className="col-md-">
              Created Date: {additionalData.created_date}
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">
              modified By: {additionalData.modified_by}
            </p>
            <p className="col-md-6">
              modified Date: {additionalData.modified_date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpeningbalanceGrid;
import React, { useState, useRef, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
const config = require("../Apiconfig");

function VendorPayment({}) {
  const [rowData, setRowData] = useState([]);
  const [customerDrop, setCustomerDrop] = useState([]);
  const [typeDrop, setTypeDrop] = useState([]);
  const [customer, setCustomer] = useState("");
  const [type, setType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [gridApi, setGridApi] = useState(null);

  const [vendorDrop, setVendorDrop] = useState([]);
  const [vendor, setVendor] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [paymenttypedrop, setPaymenttypeDrop] = useState([]);

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const purchasePermission = permissions
    .filter((permission) => permission.screen_type === "PendingVendor")
    .map((permission) => permission.permission_type.toLowerCase());

  useEffect(() => {
    const fetchVendorCode = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/vendorcode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const updatedData = [
            {
              vendor_code: "All",
              vendor_name: "All",
            },
            ...data,
          ];

          setVendorDrop(updatedData);
        } else {
          setVendorDrop([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVendorCode();
  }, []);

  const filteredOptionVendor = vendorDrop.map((option) => ({
    value: option.vendor_code,
    label: `${option.vendor_code} - ${option.vendor_name}`,
  }));

  const handleChangeVendor = (selectedVendor) => {
    setSelectedVendor(selectedVendor);

    setVendor(selectedVendor ? selectedVendor.value : "");
  };

  useEffect(() => {
    const companyCode = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/PendingVendor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })
      .then((data) => data.json())
      .then((val) => {
        setTypeDrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name,
          };
          setSelectedType(firstOption);
          setType(firstOption.value);
        }
      });
  }, []);

  const handleChangeType = (selectedType) => {
    setSelectedType(selectedType);
    setType(selectedType ? selectedType.value : "");
  };

  const filteredOptionType = Array.isArray(typeDrop)
    ? typeDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
      }))
    : [];

  const filteredOptionPaymentType = paymenttypedrop.map((option) => ({
    value: option.attributedetails_code,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getExpensePaymentType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((data) => {
        const PaytypeOption = data.map(
          (option) => option.attributedetails_name,
        );
        setPaymenttypeDrop(PaytypeOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const saveVendorPayment = async () => {
    const allRowsData = [];

    gridApi.forEachNode((node) => {
      allRowsData.push(node.data);
    });

    const filteredRows = allRowsData.filter(
      (row) => Number(row.receivedAmount) > 0,
    );

    if (filteredRows.length === 0) {
      toast.warning("Please enter received amount");
      return;
    }

    const Vendor_PaymentData = filteredRows.map((row) => ({
      vendor_code: row.vendor_code,
      TransactionNo: row.TransactionNo,
      TransactionDate: row.TransactionDate,
      TransactionType: row.TransactionType,
      Site_ID: row.Site_ID,
      PONo: row.PONo,
      PO_date: row.PO_date,
      PO_amt: Number(row.PO_amt || 0),
      // existing paid amount + received amount
      paid_amt: Number(row.paid_amt || 0) + Number(row.receivedAmount || 0),
      // balance calculation
      bal_amt: Number(row.bal_amt || 0) - Number(row.receivedAmount || 0),
      pending:
        Number(row.bal_amt || 0) - Number(row.receivedAmount || 0) === 0
          ? "Completed"
          : "Pending",
      keyfield: row.keyfield,
      Remarks: row.Remarks || "",
      TypeofPay: row.TypeofPay || "",
      Data_deleted: "N",
      company_code: sessionStorage.getItem("selectedCompanyCode"),
      created_by: sessionStorage.getItem("user_name"),
      created_date: new Date(),
      modified_by: "",
      modified_date: null,
    }));

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/Vendor_PaymentLoopInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Vendor_PaymentData,
          }),
        },
      );

      if (response.ok) {
        toast.success("Vendor Payment Inserted Successfully", {
          onClose: () => {
            fetchQuotationData();
          },
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Insert Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error : " + error.message);
    }
  };

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      maxWidth: 80,
    },

    {
      headerName: "Transaction No",
      field: "TransactionNo",
      editable: false,
      filter: true,
    },

    {
      headerName: "Transaction Date",
      field: "TransactionDate",
      editable: false,
      filter: true,
    },

    {
      headerName: "Transaction Type",
      field: "TransactionType",
      editable: false,
      filter: true,
    },

    {
      headerName: "Vendor Code",
      field: "vendor_code",
      editable: false,
      filter: true,
    },

    {
      headerName: "Site ID",
      field: "Site_ID",
      editable: false,
      filter: true,
    },

    {
      headerName: "PO No",
      field: "PONo",
      editable: false,
      filter: true,
    },

    {
      headerName: "PO Date",
      field: "PO_date",
      editable: false,
      filter: true,
    },

    {
      headerName: "Item Details",
      field: "HeaderDescription",
      editable: false,
      filter: true,
    },

    {
      headerName: "PO Amount",
      field: "PO_amt",
      editable: false,
      filter: true,
    },

    {
      headerName: "Paid Amount",
      field: "paid_amt",
      editable: false,
      filter: true,
    },
    // {
    //   headerName: "Paid Amount",
    //   field: "paid_amt",

    //   editable: (params) => {
    //     return params.data.TransactionType === "Advance";
    //   },

    //   filter: true,
    // },

    {
      headerName: "Balance Amount",
      field: "bal_amt",
      editable: false,
      filter: true,
    },
    {
      headerName: type === "Advance" ? "Advance Amount" : "Received Amount",
      field: "receivedAmount",
      editable: true,
      filter: true,
    },
    // {
    //   headerName: "Received Amount",
    //   field: "receivedAmount",
    //   editable: true,
    //   filter: true,
    // },
    {
      headerName: "Pending",
      field: "pending",
      editable: false,
      filter: true,
    },

    {
      headerName: "Remarks",
      field: "Remarks",
      editable: true,
      filter: true,
    },

    {
      headerName: "Type Of Pay",
      field: "TypeofPay",
      editable: true,
      filter: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: paymenttypedrop,
      },
    },

    {
      headerName: "company_code",
      field: "company_code",
      hide: true,
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true,
    },
  ];

  useEffect(() => {
    if (type) {
      fetchQuotationData();
    }
  }, [vendor, transactionDate, type]);
  //   const fetchQuotationData = async () => {
  //     try {
  //       const body = {
  //         PO_date: transactionDate,

  //         company_code: sessionStorage.getItem("selectedCompanyCode"),

  //         vendor_code: vendor,

  //         TransactionType: type,
  //       };

  //       const response = await fetch(
  //         `${config.apiBaseUrl}/getPendingVendorPayment`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(body),
  //         },
  //       );

  //       if (response.ok) {
  //         const searchData = await response.json();
  //         const newRows = searchData.map((matchedItem) => ({
  //           TransactionNo: matchedItem.TransactionNo,

  //           TransactionDate: formatDate(matchedItem.TransactionDate),

  //           TransactionType: matchedItem.TransactionType,

  //           vendor_code: matchedItem.vendor_code,

  //           Site_ID: matchedItem.Site_ID,

  //           PONo: matchedItem.PONo,

  //           PO_date: formatDate(matchedItem.PO_date),

  //           PO_amt: matchedItem.PO_amt,

  //           paid_amt: matchedItem.paid_amt,

  //           bal_amt: matchedItem.bal_amt,

  //           pending: matchedItem.pending,

  //           HeaderDescription: matchedItem.HeaderDescription,

  //           Remarks: matchedItem.Remarks,

  //           TypeofPay: matchedItem.TypeofPay,

  //           receivedAmount: 0,

  //           keyfield: matchedItem.keyfield,
  //         }));
  //         setRowData(newRows);
  //         console.log(searchData);
  //       } else if (response.status === 404) {
  //         console.log("Data Not found");
  //         toast.warning("Data Not found");
  //         setRowData([]);
  //       } else {
  //         const errorResponse = await response.json();
  //         toast.warning(errorResponse.message || "Failed to insert sales data");
  //         console.error(errorResponse.details || errorResponse.message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching search data:", error);
  //     }
  //   };

  const fetchQuotationData = async () => {
    try {
      // ADVANCE MODE
      if (type === "Advance") {
        if (!vendor) {
          setRowData([]);
          return;
        }

        const currentDate = new Date().toISOString().split("T")[0];

        const advanceRow = [
          {
            TransactionNo: "Advance",

            TransactionDate: currentDate,

            TransactionType: "Advance",

            vendor_code: vendor,

            Site_ID: "",

            PONo: "",

            PO_date: "",

            HeaderDescription: "Advance Payment",

            PO_amt: 0,

            paid_amt: 0,

            bal_amt: 0,

            pending: "Completed",

            Remarks: "",

            TypeofPay: "",

            receivedAmount: 0,

            keyfield: "",
          },
        ];

        setRowData(advanceRow);

        return;
      }

      // NORMAL FLOW
      const body = {
        PO_date: transactionDate,

        company_code: sessionStorage.getItem("selectedCompanyCode"),

        vendor_code: vendor,

        TransactionType: type,
      };

      const response = await fetch(
        `${config.apiBaseUrl}/getPendingVendorPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const searchData = await response.json();

        const newRows = searchData.map((matchedItem) => ({
          TransactionNo: matchedItem.TransactionNo,

          TransactionDate: formatDate(matchedItem.TransactionDate),

          TransactionType: matchedItem.TransactionType,

          vendor_code: matchedItem.vendor_code,

          Site_ID: matchedItem.Site_ID,

          PONo: matchedItem.PONo,

          PO_date: formatDate(matchedItem.PO_date),

          PO_amt: matchedItem.PO_amt,

          paid_amt: matchedItem.paid_amt,

          bal_amt: matchedItem.bal_amt,

          pending: matchedItem.pending,

          HeaderDescription: matchedItem.HeaderDescription,

          Remarks: matchedItem.Remarks,

          TypeofPay: matchedItem.TypeofPay,

          receivedAmount: 0,

          keyfield: matchedItem.keyfield,
        }));

        setRowData(newRows);
      } else if (response.status === 404) {
        toast.warning("Data Not found");

        setRowData([]);
      } else {
        const errorResponse = await response.json();

        toast.warning(errorResponse.message || "Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  //   const updateSelectedRows = async () => {
  //     const allRowsData = [];
  //     gridApi.forEachNode((node) => allRowsData.push(node.data));

  //     // const filteredRows = allRowsData.filter((row) => row.receivedAmount > 0);
  //     const filteredRows = allRowsData.filter((row) => {

  //       if (row.TransactionType === "Advance") {
  //         return Number(row.paid_amt) > 0;
  //       }

  //       return Number(row.receivedAmount) > 0;
  //     });

  //     if (filteredRows.length === 0) {
  //       toast.warning(
  //         "No valid rows found with Received Amount greater than zero to update",
  //       );
  //       return;
  //     }

  //     try {
  //       const company_code = sessionStorage.getItem("selectedCompanyCode");
  //       const response = await fetch(`${config.apiBaseUrl}/updateVendorPayment`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "company_code": company_code,
  //         },
  //         body: JSON.stringify({ editedData: filteredRows }),
  //       });

  //       if (response.ok) {
  //         toast.success("Data updated successfully", {
  //           onClose: () => fetchQuotationData(),
  //         });
  //       } else {
  //         const errorResponse = await response.json();
  //         toast.warning(errorResponse.message || "Failed to insert sales data");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting rows:", error);
  //       toast.error("Error Deleting Data: " + error.message);
  //     }
  //   };

  const updateSelectedRows = async () => {
    const allRowsData = [];

    gridApi.forEachNode((node) => allRowsData.push(node.data));

    const filteredRows = allRowsData.filter((row) => {
      if (row.TransactionType === "Advance") {
        return Number(row.receivedAmount) > 0;
      }

      return Number(row.receivedAmount) > 0;
    });

    if (filteredRows.length === 0) {
      toast.warning("No valid rows found with amount greater than zero");

      return;
    }

    try {
      // SPLIT ADVANCE & NORMAL ROWS
      const advanceRows = filteredRows.filter(
        (row) => row.TransactionType === "Advance",
      );

      const normalRows = filteredRows.filter(
        (row) => row.TransactionType !== "Advance",
      );

      // ====================================================
      // ADVANCE INSERT
      // ====================================================

      if (advanceRows.length > 0) {
        const AdvanceInsertData = advanceRows.map((row) => ({
          vendor_code: row.vendor_code,

          TransactionNo: "Advance",

          TransactionDate: row.TransactionDate,

          TransactionType: "Advance",

          Site_ID: "",

          PONo: "Advance",

          PO_date: row.TransactionDate,

          PO_amt: 0,

          // paid_amt: Number(row.paid_amt || 0),
          paid_amt: Number(row.receivedAmount || 0),
          
          bal_amt: 0,

          pending: "Completed",

          keyfield: `${row.TransactionDate}/${row.vendor_code}/ADVANCE`,

          Remarks: row.Remarks || "",

          TypeofPay: row.TypeofPay || "",

          Data_deleted: "No",

          company_code: sessionStorage.getItem("selectedCompanyCode"),

          created_by: sessionStorage.getItem("selectedUserCode"),

          created_date: new Date(),

          modified_by: "",

          modified_date: null,
        }));

        const advanceResponse = await fetch(
          `${config.apiBaseUrl}/Vendor_PaymentLoopInsert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Vendor_PaymentData: AdvanceInsertData,
            }),
          },
        );

        if (!advanceResponse.ok) {
          const errorData = await advanceResponse.json();

          toast.error(errorData.message || "Advance Insert Failed");

          return;
        }
      }

      // ====================================================
      // NORMAL UPDATE
      // ====================================================

      if (normalRows.length > 0) {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(
          `${config.apiBaseUrl}/updateVendorPayment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              company_code: company_code,
            },
            body: JSON.stringify({
              editedData: normalRows,
              advanceRows,
            }),
          },
        );

        if (!response.ok) {
          const errorResponse = await response.json();

          toast.warning(errorResponse.message || "Update Failed");

          return;
        }
      }

      toast.success("Data processed successfully", {
        onClose: () => fetchQuotationData(),
      });
    } catch (error) {
      console.error(error);

      toast.error("Error : " + error.message);
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div class="container-fluid Topnav-screen">
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
        <div className="d-flex justify-content-between">
          <div className=" justify-content-start">
            <h1 align="left" className="purbut me-5">
              Vendor Payment
            </h1>
          </div>
          <div class="d-flex justify-content-end mb-2 me-3 ">
            {["add", "all permission"].some((permission) =>
              purchasePermission.includes(permission),
            ) && (
              <savebutton
                className="purbut"
                title="save"
                onClick={updateSelectedRows}
              >
                <i class="fa-regular fa-floppy-disk"></i>
              </savebutton>
            )}
          </div>
          <div className="mobileview">
            <div class=" d-flex justify-content-between ">
              <div className="" style={{ textAlign: "left" }}>
                <h1 className="h1">Pending Customer</h1>
              </div>
              <div className=" ">
                <div class="dropdown mt-2 me-3">
                  <button
                    class="btn btn-primary dropdown-toggle p-1 ms-3"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="fa-solid fa-list"></i>
                  </button>
                  <ul class="dropdown-menu menu">
                    <li class="iconbutton  d-flex justify-content-center text-success ">
                      {["update", "all permission"].some((permission) =>
                        purchasePermission.includes(permission),
                      ) && (
                        <icon class="icon">
                          <i class="fa-regular fa-floppy-disk"></i>
                        </icon>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded  pb-4">
        <div class=" mt-4">
          <div className="row ms-3 ">
            <div className="col-md-2  form-group">
              <div class="exp-form-floating">
                <label for="rid" class="exp-form-labels">
                  Vendor Code
                </label>
                <div title="select a vendor code">
                  <Select
                    id="status"
                    value={selectedVendor}
                    onChange={handleChangeVendor}
                    options={filteredOptionVendor}
                    className="exp-input-field"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div className="col-md-2 form-group mb-2 ">
              <div className="exp-form-floating">
                <label class="exp-form-labels">Transaction Date</label>
                <input
                  name="transactionDate"
                  id="billDate"
                  className="exp-input-field form-control"
                  type="date"
                  placeholder=""
                  required
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="col-md-2  form-group">
              <div class="exp-form-floating">
                <label for="rid" class="exp-form-labels">
                  Transaction Type
                </label>
                <div title="select a transaction type"></div>
                <Select
                  id="status"
                  value={selectedType}
                  onChange={handleChangeType}
                  options={filteredOptionType}
                  className="exp-input-field"
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <div
            align="right"
            class="d-flex justify-content-end mb-2 me-6"
            style={{ marginRight: "90px" }}
          ></div>
          <div
            className="ag-theme-alpine"
            style={{ height: 437, width: "100%" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              defaultColDef={{ editable: true, resizable: true }}
              onGridReady={onGridReady}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default VendorPayment;

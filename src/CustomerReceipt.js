import React, { useState, useRef, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from 'ag-grid-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
const config = require('./Apiconfig');

function AssetsReturn({ }) {
    const [rowData, setRowData] = useState([]);
    const [customerDrop, setCustomerDrop] = useState([]);
    const [typeDrop, setTypeDrop] = useState([]);
    const [customer, setCustomer] = useState('');
    const [type, setType] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [gridApi, setGridApi] = useState(null);

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const purchasePermission = permissions
        .filter(permission => permission.screen_type === 'PendingCustomer')
        .map(permission => permission.permission_type.toLowerCase());

    // Added for errors
    const handleAddRow = () => {
        const serialNumber = rowData.length + 1;
        const newRow = { serialNumber, itemCode: "", itemName: "", purchaseQty: 0 };
        setRowData([...rowData, newRow]);
    };
    const [PaymentTypeDrop, setPaymentTypeDrop] = useState([]);

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


    useEffect(() => {
        const fetchCustomerCode = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/getCustomerCodeDrop`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    const updatedData = [{ customer_code: "All", customer_name: "All" }, ...data];
                    setCustomerDrop(updatedData);
                } else {
                    console.warn("No data found");
                    setCustomerDrop([]);
                }
            } catch (error) {
                console.error("Error fetching item codes:", error);
            }
        };

        fetchCustomerCode();
    }, []);

    const filteredOptionCustomer = customerDrop.map((option) => ({
        value: option.customer_code,
        label: `${option.customer_code} - ${option.customer_name}`,
    }));

    const handleChangeCustomer = (selectedCustomer) => {
        setSelectedCustomer(selectedCustomer);

        const selectedValue = selectedCustomer ? selectedCustomer.value : '';
        setCustomer(selectedValue);

        // FOR ADVANCE TYPE
        if (type?.toLowerCase() === "advance") {

            const customerData = customerDrop.find(
                (item) => item.customer_code === selectedValue
            );

            setRowData([
                {
                    serialNumber: 1,
                    transactionNo: "Advance",
                    transactionDate: transactionDate,
                    code: customerData?.customer_code || "",
                    name: customerData?.customer_name || "",
                    HeaderDescription: "-",
                    totalAmount: 0,
                    paidAmount: 0,
                    balanceAmount: 0,
                    receivedAmount: "",
                    TypeofPay: "",
                    Remarks: "",
                    keyfield: ""
                }
            ]);
        }
    };

    useEffect(() => {
        const companyCode = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/CustRecTransDrop`, {
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
        setType(selectedType ? selectedType.value : '');
    };

    const filteredOptionType = Array.isArray(typeDrop)
        ? typeDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const columnDefs = [
        {
            headerName: 'S.No',
            field: 'serialNumber',
            maxWidth: 80,
            sortable: false,
            valueGetter: (params) => {
                return params.node ? params.node.rowIndex + 1 : '';
            },
        },
        {
            headerName: 'Transaction No',
            field: 'transactionNo',
            editable: true,
            //minWidth: 300,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Transaction Date',
            field: 'transactionDate',
            editable: true,
            //maxWidth: 200,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Customer Code',
            field: 'code',
            editable: true,
            //minWidth: 300,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Customer Name',
            field: 'name',
            editable: true,
            //minWidth: 300,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Item Details',
            field: 'HeaderDescription',
            editable: true,
            //minWidth: 300,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Bill Amount',
            field: 'totalAmount',
            editable: true,
            //minWidth: 180,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Received Amount',
            field: 'paidAmount',
            editable: true,
            //minWidth: 180,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Balance Amount',
            field: 'balanceAmount',
            editable: true,
            //minWidth: 180,
            filter: true,
            sortable: false,
            editable: false
        },
        {
            headerName: 'Received Now',
            field: 'receivedAmount',
            editable: true,
            //minWidth: 180,
            filter: true,
            sortable: false
        },
        {
            headerName: 'Pay Type',
            field: 'TypeofPay',
            editable: true,
            cellStyle: { textAlign: "left" },
            // minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: PaymentTypeDrop,
            },
        },
        {
            headerName: 'Remarks',
            field: 'Remarks',
            editable: true,
            //minWidth: 180,
            filter: true,
            sortable: false
        },
        {
            headerName: 'Keyfield',
            field: 'keyfield',
            editable: false,
            hide: true,
            //minWidth: 180,
            filter: true,
            sortable: false
        },
    ];

    useEffect(() => {

        // NORMAL TYPES
        if (type && type.toLowerCase() !== "advance") {
            fetchQuotationData();
        }

        // ADVANCE TYPE
        else if (type?.toLowerCase() === "advance" && rowData.length === 0) {

            setRowData([
                {
                    serialNumber: 1,
                    transactionNo: "",
                    transactionDate: "",
                    code: "",
                    name: "",
                    HeaderDescription: "",
                    totalAmount: "",
                    paidAmount: "",
                    balanceAmount: "",
                    receivedAmount: "",
                    TypeofPay: "",
                    Remarks: "",
                    keyfield: ""
                }
            ]);
        }

    }, [customer, transactionDate, type]);

    const fetchQuotationData = async () => {
        try {
            const body = {
                bill_date: transactionDate,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                customer_code: customer,
                type: type
            };

            const response = await fetch(`${config.apiBaseUrl}/getCustomerReceipt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const searchData = await response.json();
                const newRows = searchData.map((matchedItem) => ({
                    bill_no: matchedItem.bill_no,
                    bill_date: formatDate(matchedItem.bill_date),

                    transactionNo: matchedItem.bill_no,
                    transactionDate: formatDate(matchedItem.bill_date),
                    totalAmount: matchedItem.bill_amt,
                    balanceAmount: matchedItem.bal_amt,
                    paidAmount: matchedItem.paid_amt,
                    customer_name: matchedItem.customer_name,
                    customer_code: matchedItem.customer_code,

                    name: matchedItem.customer_name,
                    code: matchedItem.customer_code,
                    Remarks: matchedItem.Remarks,
                    TypeofPay: matchedItem.TypeofPay,
                    HeaderDescription: matchedItem.HeaderDescription,
                    receivedAmount: 0,
                    keyfield: matchedItem.keyfield
                }));
                setRowData(newRows);
                console.log(searchData);
            } else if (response.status === 404) {
                console.log("Data Not found");
                toast.warning("Data Not found");
                setRowData([])
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    const updateSelectedRows = async () => {

        const allRowsData = [];

        gridApi.forEachNode((node) => allRowsData.push(node.data));

        const filteredRows = allRowsData.filter((row) => {

            if (row.TransactionType === "Advance") {
                return Number(row.paid_amt) > 0;
            }

            return Number(row.receivedAmount) > 0;
        });

        if (filteredRows.length === 0) {

            toast.warning(
                "No valid rows found with amount greater than zero"
            );

            return;
        }

        try {

            // ============================================
            // SPLIT ADVANCE & NORMAL ROWS
            // ============================================

            const advanceRows = filteredRows.filter(
                (row) => row.transactionNo === "Advance"
            );

            const normalRows = filteredRows.filter(
                (row) => row.transactionNo !== "Advance"
            );

            // ============================================
            // ADVANCE INSERT
            // ============================================

            if (advanceRows.length > 0) {

                const AdvanceInsertData = advanceRows.map((row) => ({

                    customer_code: row.code,

                    customer_name: row.name,

                    bill_no: "Advance",

                    bill_date: row.transactionDate,

                    bill_amt: 0,

                    paid_amt: Number(row.receivedAmount || 0),

                    bal_amt: 0,

                    pending: "Completed",

                    keyfield:
                        `${row.transactionDate}/${row.code}/ADVANCE`,

                    Remarks: row.Remarks || "",

                    TypeofPay: row.TypeofPay || "",

                    Data_deleted: "No",

                    created_by:
                        sessionStorage.getItem("selectedUserCode")
                }));

                const advanceResponse = await fetch(
                    `${config.apiBaseUrl}/Customer_ReceiptLoopInsert`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Vendor_PaymentData: AdvanceInsertData,
                        }),
                    }
                );

                if (!advanceResponse.ok) {

                    const errorData = await advanceResponse.json();

                    toast.error(
                        errorData.message || "Advance Insert Failed"
                    );

                    return;
                }
            }

            // ============================================
            // NORMAL UPDATE
            // ============================================

            if (normalRows.length > 0) {

                const company_code =
                    sessionStorage.getItem("selectedCompanyCode");

                const response = await fetch(
                    `${config.apiBaseUrl}/updateCustomerReceipt`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            company_code: company_code,
                        },
                        body: JSON.stringify({
                            editedData: normalRows,
                            advanceRows
                        }),
                    }
                );

                if (!response.ok) {

                    const errorResponse = await response.json();

                    toast.warning(
                        errorResponse.message || "Update Failed"
                    );

                    return;
                }
            }

            toast.success("Data processed successfully", {
                onClose: () => fetchQuotationData(),
            });

        } catch (error) {

            console.error(error);

            toast.error(
                "Error : " + error.message
            );
        }
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    return (
        <div class="container-fluid Topnav-screen">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
                <div className="d-flex justify-content-between">
                    <div className=" justify-content-start">
                        <h1 align="left" className="purbut me-5">Customer Receipt</h1>
                    </div>
                    <div class="d-flex justify-content-end mb-2 me-3 ">
                        {["add", "all permission"].some((permission) => purchasePermission.includes(permission)) && (
                            <savebutton className="purbut" title="save" onClick={updateSelectedRows}>
                                <i class="fa-regular fa-floppy-disk"></i>
                            </savebutton>
                        )}
                    </div>
                    <div className="mobileview">
                        <div class=" d-flex justify-content-between ">
                            <div className="" style={{ textAlign: "left" }}>
                                <h1 className="h1">Customer Receipt</h1>
                            </div>
                            <div className=" ">
                                <div class="dropdown mt-2 me-3" >
                                    <button class="btn btn-primary dropdown-toggle p-1 ms-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-list"></i>
                                    </button>
                                    <ul class="dropdown-menu menu">
                                        <li class="iconbutton  d-flex justify-content-center text-success ">
                                            {['update', 'all permission'].some(permission => purchasePermission.includes(permission)) && (
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
                                    onChange={(e) => {

                                        const selectedDate = e.target.value;

                                        setTransactionDate(selectedDate);

                                        // FOR ADVANCE TYPE
                                        if (type?.toLowerCase() === "advance") {

                                            setRowData((prevRows) =>
                                                prevRows.map((row) => ({
                                                    ...row,
                                                    transactionDate: selectedDate
                                                }))
                                            );
                                        }
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="col-md-2  form-group">
                            <div class="exp-form-floating">
                                <label for="rid" class="exp-form-labels">Transaction Type</label>
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
                        <div className="col-md-2  form-group">
                            <div class="exp-form-floating">
                                <label for="rid" class="exp-form-labels">Customer Code</label>
                                <div title="select a customer code">
                                    <Select
                                        id="status"
                                        value={selectedCustomer}
                                        onChange={handleChangeCustomer}
                                        options={filteredOptionCustomer}
                                        className="exp-input-field"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div align="right" class="d-flex justify-content-end mb-2 me-6" style={{ marginRight: "90px" }}>

                    </div>
                    {type?.toLowerCase() === "advance" && (
                        <div
                            class="d-flex justify-content-end mb-2"
                            style={{ marginRight: "50px" }}
                        >
                            <icon
                                type="button"
                                class="popups-btn"
                                title="Add row"
                                onClick={handleAddRow}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </icon>

                            <icon
                                type="button"
                                class="popups-btn"
                                title="Less row"
                                onClick={handleRemoveRow}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </icon>
                        </div>
                    )}
                    <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
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
export default AssetsReturn;

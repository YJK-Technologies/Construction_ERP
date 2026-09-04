import { useState, useEffect } from "react";
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-enterprise";
import 'ag-grid-autocomplete-editor/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import LoadingScreen from './Loading';
import Select from 'react-select';

const config = require('./Apiconfig');

// Test


const columnDefs = [
    {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        headerName: "Expenses No",
        field: "expense_no",
        cellStyle: { textAlign: "center" },
        editable: false,
    },
    {
        headerName: "Expenses Date",
        field: "expense_date",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Expense Type",
        field: "expense_type",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Reference Type",
        field: "reference_type",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Reference Code",
        field: "reference_code",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Reference Name",
        field: "reference_name",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Payment Mode",
        field: "payment_mode",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Amount",
        field: "amount",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Description",
        field: "description",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Is Approved",
        field: "is_approved",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
    {
        headerName: "Is Closed",
        field: "is_closed",
        editable: false,
        cellStyle: { textAlign: "center" },
    },
];

const defaultColDef = {
    resizable: true,
    sortable: true,
    editable: true,
};

export default function OIPopup({ open, handleClose, handleOb }) {

    const [rowData, setRowData] = useState([]);
    const [transaction_no, settransaction_no] = useState("");
    const [transaction_date, settransaction_date] = useState("");
    const [Item_code, setItem_code] = useState("");
    const [Item_name, setItem_name] = useState("");
    const [loading, setLoading] = useState(false);
    const [expense_date, setexpense_date] = useState("");
    const [showAsterisk, setShowAsterisk] = useState(false);
    const [error, setError] = useState("");

    const [expense_no, setexpense_no] = useState("");
    // const [expense_date, setexpense_date] = useState("");
    const [expense_type, setexpense_type] = useState("");
    const [reference_type, setreference_type] = useState("");
    const [reference_code, setreference_code] = useState("");
    const [reference_name, setreference_name] = useState("");
    const [payment_mode, setpayment_mode] = useState("");
    const [amount, setamount] = useState("");
    const [description, setdescription] = useState("");
    const [is_approved, setis_approved] = useState("");
    const [Start_Date, setStart_Date] = useState("");
    const [End_Date, setEnd_Date] = useState("");

    const [ExpenseTypeDrop, setExpenseTypeDrop] = useState([]);
    const [ReferenceTypeDrop, setReferenceTypeDrop] = useState([]);
    const [PaymentTypeDrop, setPaymentTypeDrop] = useState([]);
    const [IsApprovedDrop, setIsApprovedDrop] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customer, setCustomer] = useState('');
    const [customerDrop, setCustomerDrop] = useState([]);

    const [Selectedis_approved, setSelectedis_approved] = useState('');
    const [Selectedexpense_type, setSelectedexpense_type] = useState('');
    const [Selectedreference_type, setSelectedreference_type] = useState('');
    const [Selectedpayment_mode, setSelectedpayment_mode] = useState('');

    const handleSearchExpenses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/ExpensesSC`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    Location_Code: sessionStorage.getItem("selectedLocationCode"),
                    expense_no, expense_date, expense_type, reference_type, reference_code, reference_name,
                    payment_mode, amount, description, is_approved, Start_Date, End_Date
                }) // Send company_no and company_name as search criteria
            });
            if (response.ok) {
                const searchData = await response.json();

                if (
                    searchData.length > 0 &&
                    searchData[0].ErrorMessage
                ) {
                    toast.warning(searchData[0].ErrorMessage);
                    setRowData([]);
                    return;
                }

                setRowData(searchData);
                console.log("data fetched successfully");
            } else if (response.status === 404) {
                toast.warning("Data Not Found")
                    .then(() => {
                        setRowData([]);
                        clearInputs([])
                    });
                console.log("Data not found"); // Log the message for 404 Not Found
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

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
                setExpenseTypeDrop(data);
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
                setReferenceTypeDrop(data);
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
                setPaymentTypeDrop(data);
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
            .then((data) => setIsApprovedDrop(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleChangeis_approved = (selectedis_approved) => {
        setSelectedis_approved(selectedis_approved);
        setis_approved(selectedis_approved ? selectedis_approved.value : '');
    };

    const handleChangeexpense_type = (selectedexpense_type) => {
        setSelectedexpense_type(selectedexpense_type);
        setexpense_type(selectedexpense_type ? selectedexpense_type.value : '');
    };

    const handleChangereference_type = (selectedreference_type) => {
        setSelectedreference_type(selectedreference_type);
        setreference_type(selectedreference_type ? selectedreference_type.value : '');
    };

    const handleChangepayment_mode = (selectedpayment_mode) => {
        setSelectedpayment_mode(selectedpayment_mode);
        setpayment_mode(selectedpayment_mode ? selectedpayment_mode.value : '');
    };

    const filteredOptionis_approved = Array.isArray(IsApprovedDrop)
        ? IsApprovedDrop.map((option) => ({
            value: option.attributedetails_code,
            label: option.attributedetails_code,
        }))
        : [];

    const filteredOptionexpense_type = Array.isArray(ExpenseTypeDrop)
        ? ExpenseTypeDrop.map((option) => ({
            value: option.attributedetails_code,
            label: option.attributedetails_code,
        }))
        : [];

    const filteredOptionreference_type = Array.isArray(ReferenceTypeDrop)
        ? ReferenceTypeDrop.map((option) => ({
            value: option.attributedetails_code,
            label: option.attributedetails_code,
        }))
        : [];

    const filteredOptionpayment_mode = Array.isArray(PaymentTypeDrop)
        ? PaymentTypeDrop.map((option) => ({
            value: option.attributedetails_code,
            label: option.attributedetails_code,
        }))
        : [];


    const handleReload = () => {
        clearInputs([])
        setRowData([])
    };

    const clearInputs = () => {
        setexpense_no("");
        setexpense_date("");
        setreference_type("");
        setreference_code("");
        setreference_name("");
        setpayment_mode("");
        setamount("");
        setdescription("");
        setis_approved("");
        setStart_Date("");
        setEnd_Date("");
        setSelectedis_approved("");
        setSelectedexpense_type("");
        setSelectedreference_type("");
        setSelectedpayment_mode("");
    };
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelected = (event) => {
        setSelectedRows(event.api.getSelectedRows());
    };

    const handleConfirm = () => {
        const selectedData = selectedRows.map(row => ({
            expense_no: row.expense_no,
            expense_date: row.expense_date,
            expense_type: row.expense_type,
            reference_type: row.reference_type,
            reference_code: row.reference_code,
            reference_name: row.reference_name,
            payment_mode: row.payment_mode,
            amount: row.amount,
            description: row.description,
            is_approved: row.is_approved,
            is_closed: row.is_closed
        }));
        handleOb(selectedData);
        handleClose();
        clearInputs([]);
        setRowData([]);
        setSelectedRows([]);
    }

    return (
        <div>
            {open && (
                <fieldset>
                    <div>
                        <div className="purbut">
                            {loading && <LoadingScreen />}
                            <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                                    <div className="modal-content">
                                        <div class="row justify-content-center">
                                            <div class="col-md-12 text-center">
                                                <div className="p-0 bg-body-tertiary">
                                                    <div className="purbut mb-0 d-flex justify-content-between" >
                                                        <h1 align="left" className="purbut">Expenses Help</h1>
                                                        <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                                                            <i class="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                    <div class="d-flex justify-content-between">
                                                        <div className="d-flex justify-content-start">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row ms-3 me-3">
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemCode"
                                                            className="exp-input-field form-control"
                                                            placeholder="Expenses No"
                                                            value={expense_no}
                                                            title='Please enter the Expenses No'
                                                            onChange={(e) => setexpense_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <input
                                                                id="transactionDate"
                                                                className="exp-input-field form-control"
                                                                type="date"
                                                                value={Start_Date}
                                                                onChange={(e) => setStart_Date(e.target.value)}
                                                                //   readOnly 
                                                                title="Please select the Expenses From Date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <input
                                                                id="transactionDate"
                                                                className="exp-input-field form-control"
                                                                type="date"
                                                                value={End_Date}
                                                                onChange={(e) => setEnd_Date(e.target.value)}
                                                                //   readOnly 
                                                                title="Please select the Expenses To Date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Expense Type">
                                                                <Select
                                                                    type="text"
                                                                    id="ShortName"
                                                                    className="exp-input-field"
                                                                    placeholder="Expense Type"
                                                                    isClearable
                                                                    value={Selectedexpense_type}
                                                                    options={filteredOptionexpense_type}
                                                                    onChange={handleChangeexpense_type}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Reference Type">
                                                                <Select
                                                                    type="text"
                                                                    id="OurBrand"
                                                                    className="exp-input-field"
                                                                    placeholder="Reference Type"
                                                                    isClearable
                                                                    value={Selectedreference_type}
                                                                    onChange={handleChangereference_type}
                                                                    options={filteredOptionreference_type}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Reference Code"
                                                            title='Please enter the Reference Code'
                                                            value={reference_code}
                                                            onChange={(e) => setreference_code(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Reference Code"
                                                            title='Please enter the Reference Code'
                                                            value={reference_name}
                                                            onChange={(e) => setreference_name(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Payment Mode">
                                                                <Select
                                                                    type="text"
                                                                    id="OurBrand"
                                                                    className="exp-input-field"
                                                                    placeholder="Payment Mode"
                                                                    isClearable
                                                                    value={Selectedpayment_mode}
                                                                    onChange={handleChangepayment_mode}
                                                                    options={filteredOptionpayment_mode}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Amount"
                                                            title='Please enter the Amount'
                                                            value={amount}
                                                            onChange={(e) => setamount(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Description"
                                                            title='Please enter the Description'
                                                            value={description}
                                                            onChange={(e) => setdescription(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Is Approved">
                                                                <Select
                                                                    id="status"
                                                                    value={Selectedis_approved}
                                                                    isClearable
                                                                    onChange={handleChangeis_approved}
                                                                    options={filteredOptionis_approved}
                                                                    className="exp-input-field"
                                                                    placeholder="Is Approved"
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 mt-2 d-flex justify-content-end">
                                                        <icon className="icon popups-btn" title='search' onClick={handleSearchExpenses}>
                                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                        </icon>
                                                        <icon className="icon popups-btn" title='Reload' onClick={handleReload}>
                                                            <i class="fa-solid fa-arrow-rotate-right"></i>
                                                        </icon>
                                                        <icon className="icon popups-btn" title='Confirm' onClick={handleConfirm}>
                                                            <FontAwesomeIcon icon="fa-solid fa-check" />
                                                        </icon>
                                                    </div>
                                                </div>
                                                <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                                                    <AgGridReact
                                                        rowData={rowData}
                                                        columnDefs={columnDefs}
                                                        defaultColDef={defaultColDef}
                                                        rowSelection="multiple"
                                                        pagination
                                                        onSelectionChanged={handleRowSelected}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mobileview">
                            {loading && <LoadingScreen />}
                            <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                                    <div className="modal-content">
                                        <div class="row justify-content-center">
                                            <div class="col-md-12 text-center">
                                                <div className="mb-0 d-flex justify-content-between">
                                                    <div className="mb-0 d-flex justify-content-start me-4">
                                                        <h1 className="h1">Expenses Help</h1>
                                                    </div>
                                                    <div className="mb-0 d-flex justify-content-end" >
                                                        <button onClick={handleClose} className="closebtn2" required title="Close">
                                                            <i class="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-between">
                                                    <div className="d-flex justify-content-start">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row ms-3 me-3">
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="ItemCode"
                                                            className="exp-input-field form-control"
                                                            placeholder="Expenses No"
                                                            value={expense_no}
                                                            title='Please enter the Expenses No'
                                                            onChange={(e) => setexpense_no(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <input
                                                                id="transactionDate"
                                                                className="exp-input-field form-control"
                                                                type="date"
                                                                value={Start_Date}
                                                                onChange={(e) => setStart_Date(e.target.value)}
                                                                //   readOnly 
                                                                title="Please select the Expenses From Date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <input
                                                                id="transactionDate"
                                                                className="exp-input-field form-control"
                                                                type="date"
                                                                value={End_Date}
                                                                onChange={(e) => setEnd_Date(e.target.value)}
                                                                //   readOnly 
                                                                title="Please select the Expenses To Date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Expense Type">
                                                                <Select
                                                                    type="text"
                                                                    id="ShortName"
                                                                    className="exp-input-field"
                                                                    placeholder="Expense Type"
                                                                    isClearable
                                                                    value={Selectedexpense_type}
                                                                    options={filteredOptionexpense_type}
                                                                    onChange={handleChangeexpense_type}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Reference Type">
                                                                <Select
                                                                    type="text"
                                                                    id="OurBrand"
                                                                    className="exp-input-field"
                                                                    placeholder="Reference Type"
                                                                    isClearable
                                                                    value={Selectedreference_type}
                                                                    onChange={handleChangereference_type}
                                                                    options={filteredOptionreference_type}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Reference Code"
                                                            title='Please enter the Reference Code'
                                                            value={reference_code}
                                                            onChange={(e) => setreference_code(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Reference Code"
                                                            title='Please enter the Reference Code'
                                                            value={reference_name}
                                                            onChange={(e) => setreference_name(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Payment Mode">
                                                                <Select
                                                                    type="text"
                                                                    id="OurBrand"
                                                                    className="exp-input-field"
                                                                    placeholder="Payment Mode"
                                                                    isClearable
                                                                    value={Selectedpayment_mode}
                                                                    onChange={handleChangepayment_mode}
                                                                    options={filteredOptionpayment_mode}
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Amount"
                                                            title='Please enter the Amount'
                                                            value={amount}
                                                            onChange={(e) => setamount(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <input
                                                            type="text"
                                                            id="OurBrand"
                                                            className="exp-input-field form-control"
                                                            placeholder="Description"
                                                            title='Please enter the Description'
                                                            value={description}
                                                            onChange={(e) => setdescription(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchExpenses()}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <div className="col-md-3 mb-2">
                                                        <div class="exp-form-floating">
                                                            <div title="Please select the Is Approved">
                                                                <Select
                                                                    id="status"
                                                                    value={Selectedis_approved}
                                                                    isClearable
                                                                    onChange={handleChangeis_approved}
                                                                    options={filteredOptionis_approved}
                                                                    className="exp-input-field"
                                                                    placeholder="Is Approved"
                                                                    styles={{menu: (provided) => ({ ...provided, zIndex: 9999 })}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 mt-2 d-flex justify-content-end">
                                                        <button className="" onClick={handleSearchExpenses}>
                                                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                        </button>
                                                        <button className="" onClick={handleReload}>
                                                            <i class="fa-solid fa-arrow-rotate-right"></i>
                                                        </button>
                                                        <button className="" onClick={handleConfirm}>
                                                            <FontAwesomeIcon icon="fa-solid fa-check" />
                                                        </button>
                                                    </div>
                                                    <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                                                        <AgGridReact
                                                            rowData={rowData}
                                                            columnDefs={columnDefs}
                                                            defaultColDef={defaultColDef}
                                                            rowSelection="multiple"
                                                            pagination
                                                            onSelectionChanged={handleRowSelected}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../ItemDash.css';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import config from '../Apiconfig';
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from '../Loading';
import LZString from "lz-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SalesCustomerPopup from '../SalesVendorPopup';
import PurchaseVendorPopup from '../ExpensesVendorPopUp';
import SitePopUp from '../SitePopUp';
// import ExpensesPrint from "../InventoryPrintTemplates/ExpensesTrackingPrint.js";


const ExpensesTracking = () => {

    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [editedData, setEditedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [periodDrop, setPeriodDrop] = useState([]);
    const [taxDrop, setTaxDrop] = useState([]);
    const [partyDrop, setPartyDrop] = useState([]);
    const [period, setPeriod] = useState(null);
    const [tax, setTax] = useState(null);
    const [party, setParty] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [start_Date, setStart_Date] = useState('');
    const [end_Date, setEnd_Date] = useState('');
    const companyName = sessionStorage.getItem('selectedCompanyName');
    const [loading, setLoading] = useState(false);

    const [SiteID, setSiteID] = useState("");
    const [customer, setCustomer] = useState("");
    const [vendor, setVendor] = useState("");
    const [referenceCode, setReferenceCode] = useState("");
    const [referenceType, setReferenceType] = useState("");
    const [expenseType, setExpenseType] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [amountFrom, setAmountFrom] = useState("");
    const [amountTo, setAmountTo] = useState("");

    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [customerCode, setCustomerCode] = useState("");
    const [customerName, setCustomerName] = useState("");

    const [transactionNo, setTransactionNo] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhoneNo, setCustomerPhoneNo] = useState("");

    const [expense_no, setexpense_no] = useState("");
    const [expense_date, setexpense_date] = useState("");
    const [reference_name, setreference_name] = useState("");

    const [issuedId, setIssuedId] = useState('');
    const [deleteError, setDeleteError] = useState("");

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const issuedPermission = permissions
        .filter(permission => permission.screen_type === 'UnplannedIssued')
        .map(permission => permission.permission_type.toLowerCase());
    const companyPermissions = permissions
        .filter(permission => permission.screen_type === 'IEanalysis')
        .map(permission => permission.permission_type.toLowerCase());

    // For pop up
    const handleClose = () => {
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
    };

    const handleShowModal1 = () => {
        setOpen3(true);
    };
    const handleShowModal2 = () => {
        setOpen1(true);
    };
    const handleShowModal3 = () => {
        setOpen2(true);
    };

    const handleCustomer = async (data) => {
        console.log(data)
        if (data && data.length > 0) {
            const [{ CustomerCode, CustomerName }] = data;
            setCustomer(CustomerCode);
            //   setCustomerName(CustomerName)
        } else {
            console.error('Data is empty or undefined');
        }
    };

    const handleVendorCode = async (data) => {
        if (data && data.length > 0) {
            const [{ VendorCode, VendorName }] = data;
            setVendor(VendorCode);
            // setVendorName(VendorName);
        } else {
            console.error('Data is empty or undefined');
        }
    };

    const handleSiteCode = async (data) => {
        if (data && data.length > 0) {
            const [{ SiteID, SiteName }] = data;
            setSiteID(SiteID);
        } else {
            console.error('Data is empty or undefined');
        }
    };

    const PrintHeaderData = async (expense_no) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/ExpensesTrackingPrint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ expense_no: expense_no, company_code: sessionStorage.getItem("selectedCompanyCode") })
            });

            if (response.ok) {
                const searchData = await response.json();
                return searchData;
            } else if (response.status === 404) {
                console.log("Data not found");
            } else {
                console.log("Bad request");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    const PrintDetailData = async (expense_no) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/ExpensesTrackingPrint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ expense_no: expense_no, company_code: sessionStorage.getItem("selectedCompanyCode") })
            });

            if (response.ok) {
                const searchData = await response.json();
                return searchData;
            } else if (response.status === 404) {
                console.log("Data not found");
            } else {
                console.log("Bad request");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };


    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDateRange`)
            .then((data) => data.json())
            .then((val) => {
                setPeriodDrop(val);

                if (val.length > 0) {
                    const firstOption = {
                        value: val[4].Sno,
                        label: val[4].DateRangeDescription,
                    };
                    setSelectedPeriod(firstOption);
                    setPeriod(firstOption.value);
                }
            });
    }, []);

    const fetchExpensesData = async () => {
        setLoading(true);
        try {
            const body = {
                mode: period.toString(),
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                Location_Code: sessionStorage.getItem("selectedLocationCode"),
                SiteID: SiteID,
                customer: customer,
                vendor: vendor,
                expense_no: expense_no,
                expense_date: expense_date || null,
                expense_type: expenseType,
                reference_type: referenceType,
                reference_code: referenceCode,
                reference_name: reference_name,
                payment_mode: paymentMode,
                amountFrom: amountFrom,
                amountTo: amountTo,
                StartDate: selectedPeriod?.label === "Custom Date" ? startDate : undefined,
                EndDate: selectedPeriod?.label === "Custom Date" ? endDate : undefined,
            };

            const response = await fetch(`${config.apiBaseUrl}/getExpensesReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const fetchedData = await response.json();
                if (fetchedData.length > 0) {
                    const firstItem = fetchedData[0];
                    setStart_Date(formatDate(firstItem.DateRange_Start) || "");
                    setEnd_Date(formatDate(firstItem.DateRange_End) || "");
                }

                const newRows = fetchedData.map((matchedItem) => ({
                    Entry_date: formatDate(matchedItem.Entry_date),
                    expense_no: matchedItem.expense_no,
                    expense_date: formatDate(matchedItem.expense_date),
                    expense_type: matchedItem.expense_type,
                    reference_type: matchedItem.reference_type,
                    reference_code: matchedItem.reference_code,
                    reference_name: matchedItem.reference_name,
                    amount: matchedItem.amount,
                    payment_mode: matchedItem.payment_mode,
                    //   customer_country: matchedItem.customer_country,
                    //   customer_mobile_no: matchedItem.customer_mobile_no,
                    //   contact_person: matchedItem.contact_person,
                    //   purchase_amount: matchedItem.purchase_amount,
                    //   tax_amount: matchedItem.tax_amount,
                    //   rounded_off: matchedItem.rounded_off,
                    //   total_amount: matchedItem.total_amount,
                }));

                const totalAmount = newRows.reduce(
                    (sum, row) => sum + (Number(row.amount) || 0),
                    0
                );

                const totalRow = {
                    Entry_date: "",
                    expense_date: "",
                    expense_no: "",
                    expense_type: "",
                    reference_type: "",
                    reference_code: "",
                    reference_name: "",
                    payment_mode: "Total",
                    amount: totalAmount,
                };

                setRowData([...newRows, totalRow]);
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
        } finally {
            setLoading(false);
        }
    };

    const filteredOptionPeriod = Array.isArray(periodDrop)
        ? periodDrop.map((option) => ({
            value: option.Sno,
            label: option.DateRangeDescription,
        }))
        : [];

    const handleChangePeriod = (selectedPeriod) => {
        setSelectedPeriod(selectedPeriod);
        setPeriod(selectedPeriod ? selectedPeriod.value : '');
    };

    const fetchGSTReport = async () => {
        try {
            const response = await fetch(
                `${config.apiBaseUrl}/getGSTReport`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        company_code: sessionStorage.getItem("selectedCompanyCode"),
                    }),
                }
            );

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("GST Report Error:", error);
        }
    };

    useEffect(() => {
        fetchGSTReport();
    }, []);


    const filteredOptionTax = Array.isArray(taxDrop)
        ? taxDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const handleChangeTax = (selectedTax) => {
        setSelectedTax(selectedTax);
        setTax(selectedTax ? selectedTax.value : "");

        const updatedPartyOptions = partyDrop.filter(
            (option) => option.attributedetails_name === selectedTax?.value
        );
        if (updatedPartyOptions.length > 0) {
            const firstPartyOption = {
                value: updatedPartyOptions[0].descriptions,
                label: updatedPartyOptions[0].descriptions,
            };
            setSelectedParty(firstPartyOption);
            setParty(firstPartyOption.value);
        } else {
            setSelectedParty(null);
            setParty("");
        }
    };

    const filteredOptionParty = Array.isArray(partyDrop)
        ? partyDrop.map((option) => ({
            value: option.descriptions,
            label: option.descriptions,
        }))
        : [];

    const handleChangeParty = (selectedParty) => {
        setSelectedParty(selectedParty);
        setParty(selectedParty ? selectedParty.value : "");

        const updatedTaxOptions = taxDrop.filter(
            (option) => option.descriptions === selectedParty?.value
        );
        if (updatedTaxOptions.length > 0) {
            const firstTaxOption = {
                value: updatedTaxOptions[0].attributedetails_name,
                label: updatedTaxOptions[0].attributedetails_name,
            };
            setSelectedTax(firstTaxOption);
            setTax(firstTaxOption.value);
        } else {
            setSelectedTax(null);
            setTax("");
        }
    };

    const reloadGridData = () => {
        window.location.reload();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return "";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const columnDefs = [
        {
            headerName: "S.No",
            width: 90,
            valueGetter: (params) => params.node.rowIndex + 1,
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        {
            headerName: "Expense Date",
            field: "expense_date",
            editable: false,
        },
        {
            headerName: "Expense No",
            field: "expense_no",
            editable: false,
        },
        {
            headerName: "Expense Type",
            field: "expense_type",
            editable: false,
        },
        {
            headerName: "Reference Code",
            field: "reference_code",
            editable: false,
        },
        {
            headerName: "Reference Name",
            field: "reference_name",
            editable: false,
        },
        {
            headerName: "Payment Mode",
            field: "payment_mode",
            editable: false,
        },
        {
            headerName: "Amount",
            field: "amount",
            editable: false,
        },
    ];

    const defaultColDef = {
        resizable: true,
        wrapText: true,
        // flex: 1,
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };

    const generateReport = () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            alert("Please select at least one row to generate a report");
            return;
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;
            return date.toLocaleDateString("en-GB");
        };

        const reportData = selectedRows.map((row) => {
            return {
                "Expense Date": row.expense_date,
                "Expense No": row.expense_no,
                "Expense Type": row.expense_type,
                "Reference Code": row.reference_code,
                "Reference Name": row.reference_name,
                "Payment Mode": row.payment_mode,
                "Amount": row.amount,
            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>Expenses Tracking Report</title>");
        reportWindow.document.write("<style>");
        reportWindow.document.write(`
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            color: maroon;
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
            text-decoration: underline;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        th {
            background-color: maroon;
            color: white;
            font-weight: bold;
        }
        td {
            background-color: #fdd9b5;
        }
        tr:nth-child(even) td {
            background-color: #fff0e1;
        }
        .report-button {
            display: block;
            width: 150px;
            margin: 20px auto;
            padding: 10px;
            background-color: maroon;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            border-radius: 5px;
        }
        .report-button:hover {
            background-color: darkred;
        }
        @media print {
            .report-button {
                display: none;
            }
            body {
                margin: 0;
                padding: 0;
            }
        }
      `);
        reportWindow.document.write("</style></head><body>");
        reportWindow.document.write("<h1><u>Expenses Tracking Report</u></h1>");

        reportWindow.document.write("<table><thead><tr>");
        Object.keys(reportData[0]).forEach((key) => {
            reportWindow.document.write(`<th>${key}</th>`);
        });
        reportWindow.document.write("</tr></thead><tbody>");

        reportData.forEach((row) => {
            reportWindow.document.write("<tr>");
            Object.values(row).forEach((value) => {
                reportWindow.document.write(`<td>${value}</td>`);
            });
            reportWindow.document.write("</tr>");
        });

        reportWindow.document.write("</tbody></table>");

        reportWindow.document.write(
            '<button class="report-button" onclick="window.print()">Print</button>'
        );
        reportWindow.document.write("</body></html>");
        reportWindow.document.close();
    };

    const generateReportPDF = async () => {

    const printableRows = rowData.filter(
        row => row.expense_no !== ""
    );

    if (printableRows.length === 0) {
        toast.warning("No rows available");
        return;
    }

    const totalAmount = printableRows.reduce(
        (sum, row) => sum + (Number(row.amount) || 0),
        0
    );

    const printData = {
        companyName,
        start_Date,
        end_Date,
        totalAmount,
        rows: printableRows,
    };

    sessionStorage.setItem(
        "ExpensesTrackingData",
        JSON.stringify(printData)
    );

    window.open("/ExpensesTrackingPrint", "_blank");
};

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);

    };

    const onCellValueChanged = (params) => {
        const updatedRowData = [...rowData];
        const rowIndex = updatedRowData.findIndex(
            (row) => row.company_no === params.data.company_no
        );
        if (rowIndex !== -1) {
            updatedRowData[rowIndex][params.colDef.field] = params.newValue;
            setRowData(updatedRowData);

            setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
        }
    };

    useEffect(() => {
        if (selectedPeriod?.label === "Custom Date") {
            if (startDate && endDate) {
                fetchGstReport();
            }
        }
        else if (period && party) {
            fetchGstReport();
        }
    }, []);

    const fetchGstReport = async () => {
        setLoading(true);
        try {
            if (selectedPeriod === "Custom Date" && (!startDate || !endDate)) {
                return;
            }

            const body = {
                Mode: period.toString(),
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Party: party,
                StartDate: selectedPeriod?.label === "Custom Date" ? startDate : undefined,
                EndDate: selectedPeriod?.label === "Custom Date" ? endDate : undefined,
            };

            const response = await fetch(`${config.apiBaseUrl}/getGstReportAnalysis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const fetchedData = await response.json();
                if (fetchedData.length > 0) {
                    const firstItem = fetchedData[0];
                    setStart_Date(formatDate(firstItem.DateRange_Start) || "");
                    setEnd_Date(formatDate(firstItem.DateRange_End) || "");
                }

                const newRows = fetchedData.map((matchedItem) => ({
                    Date: formatDate(matchedItem.Date),
                    BillNo: matchedItem.BillNo,
                    PartyName: matchedItem.PartyName,
                    GSTNo: matchedItem.GSTNo,
                    Percentage: matchedItem.Percentage.toString(),
                    CGST: matchedItem.CGST,
                    SGST: matchedItem.SGST,
                    IGST: matchedItem.IGST,
                    BillRate: matchedItem.BillRate,
                }));

                const totalCGST = newRows.reduce((sum, row) => sum + row.CGST, 0);
                const totalSGST = newRows.reduce((sum, row) => sum + row.SGST, 0);
                const totalIGST = newRows.reduce((sum, row) => sum + row.IGST, 0);
                const totalBillRate = newRows.reduce((sum, row) => sum + row.BillRate, 0);

                // Add the total row
                const totalRow = {
                    Date: "",
                    BillNo: "",
                    PartyName: "",
                    GSTNo: "",
                    Percentage: "Total",
                    CGST: totalCGST,
                    SGST: totalSGST,
                    IGST: totalIGST,
                    BillRate: totalBillRate,
                };

                setRowData([...newRows, totalRow]); // Add total row to grid data
            } else if (response.status === 404) {
                console.log("Data Not Found");
                toast.warning("Data Not Found");
                setRowData([]);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomDatestart = (e) => {
        e.preventDefault();
        setStartDate(e.target.value);
    };

    const handleCustomDateend = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
    };

    const transformRowData = (data) => {
        return data.map(row => ({
            "Expense Date": row.expense_date,
            "Expense No": row.expense_no,
            "Expense Type": row.expense_type,
            "Reference Code": row.reference_code,
            "Reference Name": row.reference_name,
            "Payment Mode": row.payment_mode,
            "Amount": row.amount,
        }));
    };

    const handleExportToExcel = () => {
        if (rowData.length === 0) {
            toast.warning('There is no data to export.');
            return;
        }

        const headerData = [
            ['Expenses Tracking Report'],
            [`Company Name: ${companyName}`],
            [`Date Range: ${start_Date} to ${end_Date}`],
            []
        ];

        const transformedData = transformRowData(rowData);

        const worksheet = XLSX.utils.aoa_to_sheet(headerData);

        XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses Tracking Report');
        XLSX.writeFile(workbook, 'Expenses_Tracking_Report.xlsx');
    };


    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div>
                <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2">
                    <div className="d-flex justify-content-between ">
                        <h1 className='purbut mt-3'>Expenses Tracking</h1>
                        <div className="mobileview">
                            <div className="d-flex justify-content-between ">
                                <div className="d-flex justify-content-start ">
                                    <h1 className='h1'>Expenses Tracking</h1>
                                </div>
                                <div className="d-flex justify-content-end mt-1 ms-5">
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-list"></i>
                                        </button>
                                        <ul className="dropdown-menu ">
                                            {['all permission', 'view'].some(permission => issuedPermission.includes(permission)) && (
                                                <printbutton className="purbut" title="print" onClick={generateReportPDF}>
                                                    <i class="fa-solid fa-file-pdf"></i>
                                                </printbutton>
                                            )}
                                            <li>
                                                <icon class="iconbutton d-flex justify-content-center" onClick={generateReport} required title="Generate Report">
                                                    <i className="fa-solid fa-print"></i>
                                                </icon>
                                            </li>
                                            <li>
                                                <icon class="iconbutton d-flex justify-content-center" onClick={handleExportToExcel}>
                                                    <i class="fa-solid fa-file-excel"></i>
                                                </icon>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="purbut">
                            <div className="d-flex justify-content-end me-5">
                                {['all permission', 'view'].some(permission => issuedPermission.includes(permission)) && (
                                    <printbutton className="purbut" title="print" onClick={generateReportPDF}>
                                        <i class="fa-solid fa-file-pdf"></i>
                                    </printbutton>
                                )}
                                <button className="btn btn-dark mt-3 mb-3 rounded-3" onClick={generateReport} required title="Generate Report">
                                    <i className="fa-solid fa-print"></i>
                                </button>
                                <button class="btn btn-dark mt-3 mb-3 rounded-3" onClick={handleExportToExcel} title='Excel'>
                                    <i class="fa-solid fa-file-excel"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
                <div className="row ms-4 mt-3 mb-3 me-4">

                    <div className="col-md-3 form-group mb-2">
                        <div className="exp-form-floating">
                            <label for="city" class="">Select Period</label>
                            <Select
                                id="status"
                                value={selectedPeriod}
                                onChange={handleChangePeriod}
                                options={filteredOptionPeriod}
                                className="border-secondary"
                                placeholder=""
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Site ID</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Site ID'
                                    value={SiteID}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setSiteID(e.target.value)}
                                />
                                <div className='position-absolute mt-1 me-2'>
                                    <span className="icon searchIcon"
                                        onClick={handleShowModal1}>
                                        <i class="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Customer</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Customer'
                                    value={customer}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setCustomer(e.target.value)}
                                />
                                <div className='position-absolute mt-1 me-2'>
                                    <span className="icon searchIcon"
                                        onClick={handleShowModal2}>
                                        <i class="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Vendor</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Vendor'
                                    value={vendor}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setVendor(e.target.value)}
                                />
                                <div className='position-absolute mt-1 me-2'>
                                    <span className="icon searchIcon"
                                        onClick={handleShowModal3}>
                                        <i class="fa fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Reference Code</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Customer'
                                    value={referenceCode}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setReferenceCode(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Reference Type</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Reference Type'
                                    value={referenceType}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setReferenceType(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Expense Type</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Expense Type'
                                    value={expenseType}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setExpenseType(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Payment Mode</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Payment Mode'
                                    value={paymentMode}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Amount From</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Amount From'
                                    value={amountFrom}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setAmountFrom(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <label className="">Amount To</label>
                        <div className="exp-form-floating">
                            <div className="d-flex justify-content-end">
                                <input
                                    id="wcode"
                                    className="exp-input-field form-control justify-content-start"
                                    placeholder=""
                                    title='Please Enter the Amount To'
                                    value={amountTo}
                                    //   onKeyDown={(e) => e.key === "Enter" && fetchGstReport()}
                                    onChange={(e) => setAmountTo(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-1">
                        <div class="exp-form-floating">
                            <div class=" d-flex justify-content-center mt-4">
                                <icon className="popups-btn fs-6 p-3" onClick={fetchExpensesData} required title="Search">
                                    <i className="fas fa-search"></i>
                                </icon>
                                <icon className="popups-btn fs-6 p-3" required title="Refresh">
                                    <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                                </icon>
                            </div>
                        </div>
                    </div>

                </div>

                {/* <p >Result Set</p> */}
                <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        onCellValueChanged={onCellValueChanged}
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        paginationAutoPageSize={true}
                        rowSelection="multiple"
                    />
                </div>

                <div>
                    <SalesCustomerPopup open={open1} handleClose={handleClose} handleVendor={handleCustomer} />
                    <PurchaseVendorPopup open={open2} handleClose={handleClose} handleVendorCode={handleVendorCode} />
                    <SitePopUp open={open3} handleClose={handleClose} handleSiteCode={handleSiteCode} />
                </div>

            </div>
        </div>
    );
}

export default ExpensesTracking;
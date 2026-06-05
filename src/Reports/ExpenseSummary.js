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
    import SitePopUp from '../SitePopUp';

    const ExpensesSummary = () => {

        const [columnDefs, setColumnDefs] = useState([]);
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

        const [siteID, setSiteID] = useState("");
        const [open3, setOpen3] = React.useState(false);

        const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
        const companyPermissions = permissions
            .filter(permission => permission.screen_type === 'IEanalysis')
            .map(permission => permission.permission_type.toLowerCase());

        const issuedPermission = permissions
            .filter(permission => permission.screen_type === 'UnplannedIssued')
            .map(permission => permission.permission_type.toLowerCase());


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

        const handleShowModal1 = () => {
            setOpen3(true);
        };

        const handleClose = () => {
            setOpen3(false);
        };

        const handleSiteCode = async (data) => {
            if (data && data.length > 0) {
                const [{ SiteID, SiteName }] = data;
                setSiteID(SiteID);
            } else {
                console.error('Data is empty or undefined');
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

        const fetchGSTReport = () => {
            fetch(`${config.apiBaseUrl}/getGSTReport`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                }),
            }).then((data) => data.json())
                .then((val) => {
                    setTaxDrop(val);

                    setPartyDrop(val);

                    if (val.length > 0) {
                        const firstTaxOption = {
                            value: val[0].attributedetails_name,
                            label: val[0].attributedetails_name,
                        };
                        const firstPartyOption = {
                            value: val[0].descriptions,
                            label: val[0].descriptions,
                        };

                        setSelectedTax(firstTaxOption);
                        setTax(firstTaxOption.value);
                        setSelectedParty(firstPartyOption);
                        setParty(firstPartyOption.value);
                    }
                });
        };

        useEffect(() => {
            fetchExpensesSummary();
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

        const formatDate = (isoDateString) => {
            const date = new Date(isoDateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        };


        // const columnDefs = [
        //     {
        //         headerCheckboxSelection: true,
        //         checkboxSelection: true,
        //         headerName: "S.No",
        //         field: "Sno",
        //         editable: false,
        //     },
        //     {
        //         headerName: "Site ID",
        //         field: "site_id",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Site Name",
        //         field: "site_name",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Coolie Expense",
        //         field: "coolie_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Material Expense",
        //         field: "material_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Salary Expense",
        //         field: "salary_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Daily Expense",
        //         field: "other_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Other Expense",
        //         field: "other_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Employee Expense",
        //         field: "other_expense",
        //         editable: true,
        //     },
        //     {
        //         headerName: "Total Expense",
        //         field: "total_expense",
        //         editable: true,
        //     },
        // ];

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

            const reportData = selectedRows.map((row, index) => {
    const dynamicRow = {};

    columnDefs.forEach((col) => {
        const field = col.field;

        // S.No column
        if (col.headerName === "S.No") {
            dynamicRow["S.No"] =
                row.site_name === "Total" ? "" : index + 1;
        }
        // Other columns
        else if (field) {
            dynamicRow[col.headerName] =
                row[field] ?? "";
        }
    });

    return dynamicRow;
});

            const reportWindow = window.open("", "_blank");
            reportWindow.document.write("<html><head><title>Expense SUmmary</title>");
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
            reportWindow.document.write("<h1><u>Expenses Summary</u></h1>");

            reportWindow.document.write("<table><thead><tr>");
            columnDefs.forEach((col) => {
    reportWindow.document.write(
        `<th>${col.headerName}</th>`
    );
});
            reportWindow.document.write("</tr></thead><tbody>");

            reportData.forEach((row) => {
    reportWindow.document.write("<tr>");

    columnDefs.forEach((col) => {
        reportWindow.document.write(
            `<td>${row[col.headerName] ?? ""}</td>`
        );
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
                    fetchExpensesSummary();
                }
            }
            else if (period && party) {
                fetchExpensesSummary();
            }
        }, []);

        const generateReportPDF = async () => {

    if (!rowData || rowData.length === 0) {
        toast.warning("No rows available");
        return;
    }

    const printData = {
        companyName,
        start_Date,
        end_Date,
        columns: columnDefs.map(col => ({
    headerName: col.headerName,
    field: col.field || "Sno"
})),
        rows: rowData
    };

    sessionStorage.setItem(
        "ExpensesSummaryPDF",
        JSON.stringify(printData)
    );

    window.open("/ExpensesSummaryPrint", "_blank");
};

        const fetchExpensesSummary = async () => {
            setLoading(true);
            try {
                if (selectedPeriod === "Custom Date" && (!startDate || !endDate)) {
                    return;
                }

                const body = {
                    Mode: period.toString(),
                    company_code: sessionStorage.getItem("selectedCompanyCode"),
                    Location_Code: sessionStorage.getItem("selectedLocationCode"),
                    SiteID: siteID,
                    StartDate: selectedPeriod?.label === "Custom Date" ? startDate : undefined,
                    EndDate: selectedPeriod?.label === "Custom Date" ? endDate : undefined,
                };

                const response = await fetch(`${config.apiBaseUrl}/getExpensesSummarySiteWise`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                if (response.ok) {
                    const fetchedData = await response.json();
                    const visibleColumns = fetchedData.columns.filter(
    col => col !== "DateRange_Start" &&
           col !== "DateRange_End"
);
                    console.log("Full Response:", fetchedData);
                    console.log("Fetched Data:", fetchedData);
                    console.log("Is Array:", Array.isArray(fetchedData));
                    if (fetchedData.data && fetchedData.data.length > 0) {

        const visibleColumns = fetchedData.columns.filter(
    col => col !== "DateRange_Start" && col !== "DateRange_End"
);

const dynamicColumns = [
    {
    headerName: "S.No",
    width: 100,
    sortable: false,
    filter: false,
    resizable: true,
    checkboxSelection: true,
            headerCheckboxSelection: true,
    valueGetter: (params) => {
        if (params.data?.site_name === "Total") {
            return "";
        }
        return params.node.rowIndex + 1;
    }
},
    ...visibleColumns.map((col) => ({
        headerName: col
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase()),
        field: col,
        sortable: true,
        filter: true,
        resizable: true,
    }))
];

setColumnDefs(dynamicColumns);
    }
                    if (fetchedData.data && fetchedData.data.length > 0) {
        const firstItem = fetchedData.data[0];

        setStart_Date(
            firstItem.DateRange_Start
                ? formatDate(firstItem.DateRange_Start)
                : ""
        );

        setEnd_Date(
            firstItem.DateRange_End
                ? formatDate(firstItem.DateRange_End)
                : ""
        );
    }

                    const dataRows = fetchedData.data || [];
                    const cleanedRows = dataRows.map((row) => {
    const {
        DateRange_Start,
        DateRange_End,
        ...rest
    } = row;

    return {
        ...rest
    };
});

if (cleanedRows.length > 0) {

    const columns = visibleColumns;

    const totalColumn = columns[columns.length - 1];
    const labelColumn = columns[columns.length - 2];

    const grandTotal = cleanedRows.reduce(
        (sum, row) => sum + (Number(row[totalColumn]) || 0),
        0
    );

    const totalRow = {};

totalRow["Sno"] = "";

columns.forEach(col => {
    totalRow[col] = null;
});

totalRow["site_name"] = "Total";
totalRow[totalColumn] = grandTotal;

setRowData([...cleanedRows, totalRow]);

} else {
    setRowData([]);
}
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
                "Date": row.Date,
                "Bill No": row.BillNo,
                "Party Name": row.PartyName,
                "GST No": row.GSTNo,
                "Percentage %": row.Percentage,
                "CGST": row.CGST,
                "SGST": row.SGST,
                "IGST": row.IGST,
                "Bill Rate": row.BillRate,
            }));
        };

        const handleExportToExcel = () => {
    if (!rowData || rowData.length === 0) {
        toast.warning("There is no data to export.");
        return;
    }

    const headerData = [
        ["Expense Summary - Site Wise"],
        [`Company Name: ${companyName}`],
        [`Date Range: ${start_Date} to ${end_Date}`],
        []
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(
        worksheet,
        rowData,
        {
            origin: "A5"
        }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Expense Summary"
    );

    XLSX.writeFile(
        workbook,
        "Expense_Summary.xlsx"
    );
};

        return (
            <div className="container-fluid Topnav-screen">
                {loading && <LoadingScreen />}
                <ToastContainer position="top-right" className="toast-design" theme="colored" />
                <div>
                    <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2">
                        <div className="d-flex justify-content-between ">
                            <h1 className='purbut mt-3'>Expense Summary – Site Wise</h1>
                            <div className="mobileview">
                                <div className="d-flex justify-content-between ">
                                    <div className="d-flex justify-content-start ">
                                        <h1 className='h1'>Expense Summary – Site Wise</h1>
                                    </div>
                                    <div className="d-flex justify-content-end mt-1 ms-5">
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa-solid fa-list"></i>
                                            </button>
                                            <ul className="dropdown-menu ">
                                                
                                                <li>
                                                    <icon class="iconbutton d-flex justify-content-center" onClick={generateReportPDF} required title="Generate Report">
                                                        <i class="fa-solid fa-file-pdf"></i>
                                                    </icon>
                                                </li>
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
                                        <printbutton className="btn btn-dark mt-3 mb-3 rounded-3" title="print" onClick={generateReportPDF}>
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
                            <label className="">Site ID</label>
                            <div className="exp-form-floating">
                                <div className="d-flex justify-content-end">
                                    <input
                                        id="wcode"
                                        className="exp-input-field form-control justify-content-start"
                                        placeholder=""
                                        title='Please Enter the Site ID'
                                        value={siteID}
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

                        <div className="col-md-1">
                            <div class="exp-form-floating">
                                <div class=" d-flex justify-content-center mt-4">
                                    <icon className="popups-btn fs-6 p-3" onClick={fetchExpensesSummary} required title="Search">
                                        <i className="fas fa-search"></i>
                                    </icon>
                                    <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh">
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
                            pagination={true}
                            paginationAutoPageSize={true}
                            rowSelection="multiple"
                        />
                    </div>

                    <div>
                                        
                                        <SitePopUp open={open3} handleClose={handleClose} handleSiteCode={handleSiteCode} />
                                    </div>

                </div>
            </div>
        );
    }

    export default ExpensesSummary;
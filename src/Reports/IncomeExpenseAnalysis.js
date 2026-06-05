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
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import SitePopUp from '../SitePopUp';
import CustomerPopup from '../SalesVendorPopup';

const IncomeExpenseAnalysis = () => {

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const companyName = sessionStorage.getItem('selectedCompanyName');
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState("");
  const [siteID, setSiteID] = useState("");

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const companyPermissions = permissions
    .filter(permission => permission.screen_type === 'IEanalysis')
    .map(permission => permission.permission_type.toLowerCase());

  const handleCustomer = async (data) => {
    console.log(data)
    if (data && data.length > 0) {
      const [{ CustomerCode, CustomerName }] = data;
      setCustomer(CustomerCode);
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

  const handleShowCustomer = () => {
    setOpen1(true);
  };

  const handleShowSite = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "S.No",
      field: "Sno",
      editable: false,
    },
    {
      headerName: "Customer Code",
      field: "customer_code",
      editable: false,
    },
    {
      headerName: "Customer Name",
      field: "customer_name",
      editable: false,
    },
    {
      headerName: "Site ID",
      field: "site_id",
      editable: false,
    },
    {
      headerName: "Site Name",
      field: "site_name",
      editable: false,
    },
    {
      headerName: "Total Income",
      field: "Total_Income",
      editable: false,
    },
    {
      headerName: "Total Expense",
      field: "Total_Expense",
      editable: false,
    },
    {
      headerName: "Net Profit",
      field: "Net_Profit",
      editable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: false,
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

    const reportData = selectedRows.map((row, index) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');
      return {
        "S.No": index + 1,
        "Customer Code": formatValue(row.customer_code),
        "Customer Name": formatValue(row.customer_name),
        "Site ID": formatValue(row.site_id),
        "Site Name": formatValue(row.site_name),
        "Total Income": formatValue(row.Total_Income),
        "Total Expense": formatValue(row.Total_Expense),
        "Net Profit": formatValue(row.Net_Profit),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Income & Expense Analysis Report</title>");
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
    reportWindow.document.write("<h1><u>Income & Expense Analysis Report</u></h1>");

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

  const fetchExpenseReport = async () => {
    setLoading(true);
    try {

      const body = {
        site_id: siteID,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        customer_code: customer,
      };

      const response = await fetch(`${config.apiBaseUrl}/IncomeExpenseAnalysisReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem, index) => ({
          Sno: index + 1,
          customer_code: matchedItem.customer_code,
          customer_name: matchedItem.customer_name,
          site_id: matchedItem.site_id,
          site_name: matchedItem.site_name,
          Total_Income: matchedItem.Total_Income,
          Total_Expense: matchedItem.Total_Expense,
          Net_Profit: matchedItem.Net_Profit,
        }));

        const totalIncome = newRows.reduce((sum, row) => sum + row.Total_Income, 0);
        const totalExpense = newRows.reduce((sum, row) => sum + row.Total_Expense, 0);
        const totalProfit = newRows.reduce((sum, row) => sum + row.Net_Profit, 0);

        // Add the total row
        const totalRow = {
          Sno: null,
          customer_code: null,
          customer_name: null,
          site_id: null,
          site_name: "Total",
          Total_Income: totalIncome,
          Total_Expense: totalExpense,
          Net_Profit: totalProfit,
        };

        setRowData([...newRows, totalRow]);
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

  const handleExportToPdf = () => {

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("Income & Expense Analysis Report", 14, 15);

    const tableColumn = [
      "S.No",
      "Customer Code",
      "Customer Name",
      "Site ID",
      "Site Name",
      "Total Income",
      "Total Expense",
      "Net Profit"
    ];

    const tableRows = rowData.map((row) => [
      row.Sno,
      row.customer_code,
      row.customer_name,
      row.site_id,
      row.site_name,
      row.Total_Income,
      row.Total_Expense,
      row.Net_Profit
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [52, 73, 94]
      }
    });

    doc.save("IncomeExpenseAnalysis.pdf");
  };

  const transformRowData = (data) => {
    return data.map((row, index) => ({
      "S.No": index + 1,
      "Customer Code": row.customer_code,
      "Customer Name": row.customer_name,
      "Site ID": row.site_id,
      "Site Name": row.site_name,
      "Total Income": row.Total_Income,
      "Total Expense": row.Total_Expense,
      "Net Profit": row.Net_Profit,
    }));
  };

  const handleExportToExcel = () => {
    if (rowData.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Income & Expense Analysis Report'],
      [`Company Name: ${companyName}`],
      []
    ];

    const transformedData = transformRowData(rowData);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Analysis Report');
    XLSX.writeFile(workbook, 'Income_Expense_Analysis_Report.xlsx');
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2">
          <div className="d-flex justify-content-between ">
            <h1 className='purbut mt-3'>Income & Expense Analysis Report</h1>
            <div className="mobileview">
              <div className="d-flex justify-content-between ">
                <div className="d-flex justify-content-start ">
                  <h1 className='h1'>Income & Expense Analysis Report</h1>
                </div>
                <div className="d-flex justify-content-end mt-1 ms-5">
                  <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="fa-solid fa-list"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <icon class="iconbutton d-flex justify-content-center" onClick={handleExportToPdf}>
                          <i className="fa-solid fa-file-pdf"></i>
                        </icon>
                      </li>
                      <li>
                        <icon class="iconbutton d-flex justify-content-center" onClick={generateReport}>
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
                <button className="btn btn-dark mt-3 mb-3 rounded-3" title="Pdf" onClick={handleExportToPdf}>
                  <i class="fa-solid fa-file-pdf"></i>
                </button>
                <button className="btn btn-dark mt-3 mb-3 rounded-3" onClick={generateReport} required title="Generate Report" >
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
            <label className="">Customer</label>
            <div className="exp-form-floating">
              <div className="d-flex justify-content-end">
                <input
                  id="wcode"
                  className="exp-input-field form-control justify-content-start"
                  placeholder=""
                  title='Please Enter the Customer'
                  value={customer}
                  onKeyDown={(e) => e.key === "Enter" && fetchExpenseReport()}
                  onChange={(e) => setCustomer(e.target.value)}
                />
                <div className='position-absolute mt-1 me-2'>
                  <span className="icon searchIcon" onClick={handleShowCustomer}>
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
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
                  value={siteID}
                  onKeyDown={(e) => e.key === "Enter" && fetchExpenseReport()}
                  onChange={(e) => setSiteID(e.target.value)}
                />
                <div className='position-absolute mt-1 me-2'>
                  <span className="icon searchIcon" onClick={handleShowSite}>
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-1">
            <div class="exp-form-floating">
              <div class=" d-flex justify-content-center mt-4">
                <icon className="popups-btn fs-6 p-3" required title="Search" onClick={fetchExpenseReport}>
                  <i className="fas fa-search"></i>
                </icon>
                <icon className="popups-btn fs-6 p-3" onClick={reloadGridData} required title="Refresh">
                  <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                </icon>
              </div>
            </div>
          </div>

        </div>

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
          <CustomerPopup open={open1} handleClose={handleClose} handleVendor={handleCustomer} />
          <SitePopUp open={open2} handleClose={handleClose} handleSiteCode={handleSiteCode} />
        </div>

      </div>
    </div>
  );
}

export default IncomeExpenseAnalysis;
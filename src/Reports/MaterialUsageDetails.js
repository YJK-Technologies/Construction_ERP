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
import ItemPopup from '../PurchaseItemPopup';
import SitePopUp from '../SitePopUp';

const MaterialUsageDetails = () => {

  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const companyName = sessionStorage.getItem('selectedCompanyName');
  const [loading, setLoading] = useState(false);

  const [siteID, setSiteID] = useState("");
  const [material, setMaterial] = useState("");

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const companyPermissions = permissions
    .filter(permission => permission.screen_type === 'MaterialUsage')
    .map(permission => permission.permission_type.toLowerCase());

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleShowSite = () => {
    setOpen1(true);
  };

  const handleShowItem = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
  };

  const handleSiteCode = async (data) => {
    if (data && data.length > 0) {
      const [{ SiteID, SiteName }] = data;
      setSiteID(SiteID);
    } else {
      console.error('Data is empty or undefined');
    }
  };

  const handleItem = async (data) => {
    if (data && data.length > 0) {
      const [{ itemCode, itemName }] = data;
      setMaterial(itemCode);
    } else {
      console.error('Data is empty or undefined');
    }
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
      headerName: "Material Code",
      field: "material_code",
      editable: false,
    },
    {
      headerName: "Material Name",
      field: "material_name",
      editable: false,
    },
    {
      headerName: "Issued Qty",
      field: "issued_qty",
      editable: false,
    },
    {
      headerName: "Return Qty",
      field: "return_qty",
      editable: false,
    },
    {
      headerName: "Balance Qty",
      field: "balance_qty",
      editable: false,
    },
    {
      headerName: "Rate",
      field: "rate",
      editable: false,
    },
    {
      headerName: "Amount",
      field: "total_cost",
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
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row, index) => {
      const formatValue = (val) => (val !== undefined && val !== null ? val : '');
      return {
        "S.No": index + 1,
        "Site ID": formatValue(row.site_id),
        "Site Name": formatValue(row.site_name),
        "Material Code": formatValue(row.material_code),
        "Material Name": formatValue(row.material_name),
        "Issued Qty": formatValue(row.issued_qty),
        "Return Qty": formatValue(row.return_qty),
        "Balance Qty": formatValue(row.balance_qty),
        "Rate": formatValue(row.rate),
        "Amount": formatValue(row.total_cost),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Material Usage Details – Site Wise Report</title>");
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
    reportWindow.document.write("<h1><u>Material Usage Details – Site Wise Report</u></h1>");

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

  const fetchMaterialReport = async () => {
    setLoading(true);
    try {

      const body = {
        material_code: material,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        site_id: siteID,
      };

      const response = await fetch(`${config.apiBaseUrl}/SiteMaterialBalanceReport`, {
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
          site_id: matchedItem.site_id,
          site_name: matchedItem.site_name,
          material_code: matchedItem.material_code,
          material_name: matchedItem.material_name,
          issued_qty: matchedItem.issued_qty,
          return_qty: matchedItem.return_qty,
          balance_qty: matchedItem.balance_qty,
          rate: matchedItem.rate,
          total_cost: matchedItem.total_cost,
        }));
        
        const totalIssued = newRows.reduce((sum, row) => sum + row.issued_qty, 0);
        const totalReturn = newRows.reduce((sum, row) => sum + row.return_qty, 0);
        const totalBalance = newRows.reduce((sum, row) => sum + row.balance_qty, 0);
        const totalRate = newRows.reduce((sum, row) => sum + row.rate, 0);
        const totalCost = newRows.reduce((sum, row) => sum + row.total_cost, 0);

        const totalRow = {
          Sno: null,
          site_id: null,
          site_name: null,
          material_code: null,
          material_name: "Total",
          issued_qty: totalIssued,
          return_qty: totalReturn,
          balance_qty: totalBalance,
          rate: totalRate,
          total_cost: totalCost,
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

  const transformRowData = (data) => {
    return data.map((row, index) => ({
      "S.No": index + 1,
      "Site ID": row.site_id,
      "Site Name": row.site_name,
      "Material Name": row.material_name,
      "Issued Qty": row.issued_qty,
      "Return Qty": row.return_qty,
      "Balance Qty": row.balance_qty,
      "Rate": row.rate,
      "Amount": row.total_cost,
    }));
  };

  const handleExportToExcel = () => {
    if (rowData.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Material Usage Details – Site Wise Report'],
      [`Company Name: ${companyName}`],
      []
    ];

    const transformedData = transformRowData(rowData);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Material Usage Details');
    XLSX.writeFile(workbook, 'Material_Usage_Details_Report.xlsx');
  };

  const handleExportToPdf = () => {

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("Material Usage Details – Site Wise Report", 14, 15);

    const tableColumn = [
      "S.No",
      "Site ID",
      "Site Name",
      "Material Code",
      "Material Name",
      "Issued Qty",
      "Return Qty",
      "Balance Qty",
      "Rate",
      "Amount"
    ];

    const tableRows = rowData.map((row) => [
      row.Sno,
      row.site_id,
      row.site_name,
      row.material_code,
      row.material_name,
      row.issued_qty,
      row.return_qty,
      row.balance_qty,
      row.rate,
      row.total_cost,
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

    doc.save("MaterialUsageDetailsReport.pdf");
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2">
          <div className="d-flex justify-content-between ">
            <h1 className='purbut mt-3'>Material Usage Details – Site Wise Report</h1>
            <div className="mobileview">
              <div className="d-flex justify-content-between ">
                <div className="d-flex justify-content-start ">
                  <h1 className='h1'>Material Usage Details – Site Wise Report</h1>
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
                <button className="btn btn-dark mt-3 mb-3 rounded-3" onClick={generateReport}>
                  <i className="fa-solid fa-print"></i>
                </button>
                <button class="btn btn-dark mt-3 mb-3 rounded-3" onClick={handleExportToExcel}>
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
                  onKeyDown={(e) => e.key === "Enter" && fetchMaterialReport()}
                  onChange={(e) => setSiteID(e.target.value)}
                />
                <div className='position-absolute mt-1 me-2' onClick={handleShowSite}>
                  <span className="icon searchIcon">
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 form-group mb-2">
            <label className="">Material</label>
            <div className="exp-form-floating">
              <div className="d-flex justify-content-end">
                <input
                  id="wcode"
                  className="exp-input-field form-control justify-content-start"
                  placeholder=""
                  title='Please Enter the Material'
                  value={material}
                  onKeyDown={(e) => e.key === "Enter" && fetchMaterialReport()}
                  onChange={(e) => setMaterial(e.target.value)}
                />
                <div className='position-absolute mt-1 me-2'>
                  <span className="icon searchIcon" onClick={handleShowItem}>
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-1">
            <div class="exp-form-floating">
              <div class=" d-flex justify-content-center mt-4">
                <icon className="popups-btn fs-6 p-3" required title="Search" onClick={fetchMaterialReport}>
                  <i className="fas fa-search"></i>
                </icon>
                <icon className="popups-btn fs-6 p-3" required title="Refresh" onClick={reloadGridData}>
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
          <SitePopUp open={open1} handleClose={handleClose} handleSiteCode={handleSiteCode} />
          <ItemPopup open={open2} handleClose={handleClose} handleItem={handleItem} />
        </div>

      </div>
    </div>
  );
}

export default MaterialUsageDetails;
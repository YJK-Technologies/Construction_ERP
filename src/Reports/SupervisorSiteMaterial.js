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
import VendorPopup from '../ExpensesVendorPopUp';
import ItemPopup from '../PurchaseItemPopup';

const SupervisorSiteMaterial = () => {

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

  const [customerCode, setCustomerCode] = useState("");
  const [siteID, setSiteID] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [material, setMaterial] = useState("");

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const companyPermissions = permissions
    .filter(permission => permission.screen_type === 'SSmaterial')
    .map(permission => permission.permission_type.toLowerCase());

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
  };

  const handleShowCustomer = () => {
    setOpen1(true);
  };

  const handleShowSite = () => {
    setOpen2(true);
  };

  const handleShowVendor = () => {
    setOpen3(true);
  };

  const handleShowItem = () => {
    setOpen4(true);
  };

  const handleCustomer = async (data) => {
    if (data && data.length > 0) {
      const [{ CustomerCode, CustomerName }] = data;
      setCustomerCode(CustomerCode);
    } else {
      console.error('Data is empty or undefined');
    }
  };

  const handleVendorCode = async (data) => {
    if (data && data.length > 0) {
      const [{ VendorCode, VendorName }] = data;
      setVendorCode(VendorCode);
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

  const handleItem = async (data) => {
    if (data && data.length > 0) {
      const [{ itemCode, itemName }] = data;
      setMaterial(itemCode);
    } else {
      console.error('Data is empty or undefined');
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

  useEffect(() => {
    fetchSupervisorReport();
  }, []);

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
      editable: true,
    },
    {
      headerName: "Customer Name",
      field: "customer_name",
      editable: true,
    },
    {
      headerName: "Site ID",
      field: "site_id",
      editable: true,
    },
    {
      headerName: "Site Name",
      field: "site_name",
      editable: true,
    },
    {
      headerName: "Vendor Code",
      field: "vendor_code",
      editable: true,
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      editable: true,
    },
    {
      headerName: "Material Code",
      field: "material_code",
      editable: true,
    },
    {
      headerName: "Material Name",
      field: "material_name",
      editable: true,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      editable: true,
    },
    {
      headerName: "Rate",
      field: "rate",
      editable: true,
    },
    {
      headerName: "Total Amount",
      field: "total_amount",
      editable: true,
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
      toast.warning("Please select at least one row to generate a report");
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
        "Vendor Code": formatValue(row.vendor_code),
        "Vendor Name": formatValue(row.vendor_name),
        "Material Code": formatValue(row.material_code),
        "Material Name": formatValue(row.material_name),
        "Quantity": formatValue(row.quantity),
        "Rate": formatValue(row.rate),
        "Total Amount": formatValue(row.total_amount),
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Supervisor & Site Material Report</title>");
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
    reportWindow.document.write("<h1><u>Supervisor & Site Material Report</u></h1>");

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

  const fetchSupervisorReport = async () => {
    setLoading(true);
    try {
      const body = {
        customer_code: customerCode,
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        location_code: sessionStorage.getItem("selectedLocationCode"),
        vendor_code: vendorCode,
        site_id: siteID,
        material: material,
      };

      const response = await fetch(`${config.apiBaseUrl}/SupervisorSiteMaterialReport`, {
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
          vendor_code: matchedItem.vendor_code,
          vendor_name: matchedItem.vendor_name,
          material_code: matchedItem.material_code,
          material_name: matchedItem.material_name,
          quantity: matchedItem.quantity,
          rate: matchedItem.rate,
          total_amount: matchedItem.total_amount,
        }));

        const totalQuantity = newRows.reduce((sum, row) => sum + row.quantity, 0);
        const totalRate = newRows.reduce((sum, row) => sum + row.rate, 0);
        const totalAmount = newRows.reduce((sum, row) => sum + row.total_amount, 0);

        // Add the total row
        const totalRow = {
          Sno: null,
          customer_code: null,
          customer_name: null,
          site_id: null,
          site_name: null,
          vendor_code: null,
          vendor_name: null,
          material_code: null,
          material_name: "Total",
          quantity: totalQuantity,
          rate: totalRate,
          total_amount: totalAmount,
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

  const handleCustomDatestart = (e) => {
    e.preventDefault();
    setStartDate(e.target.value);
  };

  const handleCustomDateend = (e) => {
    e.preventDefault();
    setEndDate(e.target.value);
  };

  const transformRowData = (data) => {
    return data.map((row, index) => ({
      "S.No": index + 1,
      "Customer Code": row.customer_code,
      "Customer Name": row.customer_name,
      "Site ID": row.site_id,
      "Site Name": row.site_name,
      "Vendor Code": row.vendor_code,
      "Vendor Name": row.vendor_name,
      "Material Code": row.material_code,
      "Material Name": row.material_name,
      "Quantity": row.quantity,
      "Rate": row.rate,
      "Total Amount": row.total_amount,
    }));
  };

  const handleExportToExcel = () => {
    if (rowData.length === 0) {
      toast.warning('There is no data to export.');
      return;
    }

    const headerData = [
      ['Supervisor & Site Material Report'],
      [`Company Name: ${companyName}`],
      []
    ];

    const transformedData = transformRowData(rowData);

    const worksheet = XLSX.utils.aoa_to_sheet(headerData);

    XLSX.utils.sheet_add_json(worksheet, transformedData, { origin: 'A5' });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Site Material Report');
    XLSX.writeFile(workbook, 'Supervisor_Site_Material_Report.xlsx');
  };

  const handleExportToPdf = () => {

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text("Supervisor & Site Material Report", 14, 15);

    const tableColumn = [
      "S.No",
      "Customer Code",
      "Customer Name",
      "Site ID",
      "Site Name",
      "Vendor Code",
      "Vendor Name",
      "Material Code",
      "Material Name",
      "Quantity",
      "Rate",
      "Total Amount"
    ];

    const tableRows = rowData.map((row) => [
      row.Sno,
      row.customer_code,
      row.customer_name,
      row.site_id,
      row.site_name,
      row.vendor_code,
      row.vendor_name,
      row.material_code,
      row.material_name,
      row.quantity,
      row.rate,
      row.total_amount
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

    doc.save("SupervisorSiteMaterialReport.pdf");
  };

  return (
    <div className="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div>
        <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2">
          <div className="d-flex justify-content-between ">
            <h1 className='purbut mt-3'>Supervisor & Site Material Report</h1>
            <div className="mobileview">
              <div className="d-flex justify-content-between ">
                <div className="d-flex justify-content-start ">
                  <h1 className='h1'>Supervisor & Site Material Report</h1>
                </div>
                <div className="d-flex justify-content-end mt-1 ms-5">
                  <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="fa-solid fa-list"></i>
                    </button>
                    <ul className="dropdown-menu ">
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
            <label className="">Customer Code</label>
            <div className="exp-form-floating">
              <div className="d-flex justify-content-end">
                <input
                  id="wcode"
                  className="exp-input-field form-control justify-content-start"
                  placeholder=""
                  title='Please Enter the Customer Code'
                  value={customerCode}
                  onKeyDown={(e) => e.key === "Enter" && fetchSupervisorReport()}
                  onChange={(e) => setCustomerCode(e.target.value)}
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
                  onKeyDown={(e) => e.key === "Enter" && fetchSupervisorReport()}
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
            <label className="">Vendor Code</label>
            <div className="exp-form-floating">
              <div className="d-flex justify-content-end">
                <input
                  id="wcode"
                  className="exp-input-field form-control justify-content-start"
                  placeholder=""
                  title='Please Enter the Vendor Code'
                  value={vendorCode}
                  onKeyDown={(e) => e.key === "Enter" && fetchSupervisorReport()}
                  onChange={(e) => setVendorCode(e.target.value)}
                />
                <div className='position-absolute mt-1 me-2'>
                  <span className="icon searchIcon" onClick={handleShowVendor}>
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
                  onKeyDown={(e) => e.key === "Enter" && fetchSupervisorReport()}
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
                <icon className="popups-btn fs-6 p-3" onClick={fetchSupervisorReport} required title="Search">
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
          <VendorPopup open={open3} handleClose={handleClose} handleVendorCode={handleVendorCode} />
          <ItemPopup open={open4} handleClose={handleClose} handleItem={handleItem} />
        </div>

      </div>
    </div>
  );
}

export default SupervisorSiteMaterial;
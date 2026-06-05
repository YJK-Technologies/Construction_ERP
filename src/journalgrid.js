
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
import "./mobile.css"
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as XLSX from 'xlsx';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import JournalPopup from "./JournalPopup";
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function JournalGrid() {
  const currentDate = new Date().toISOString().split('T')[0];
  const [rowData, setRowData] = useState([{
    transaction_type: '', original_accountcode: '', contra_accountCode: '',
    journal_amount: 0, Item_SNo: 1, narration1: '', narration2: '', narration3: '', narration4: ''
  }]);
  const navigate = useNavigate();
  const [transaction_date, settransaction_date] = useState(currentDate);
  const [journal_no, setjournal_no] = useState("");
  const [error, setError] = useState(false);
  const [Transdrop, setTransdrop] = useState([]);
  const [additionalData, setAdditionalData] = useState({
    modified_by: '',
    created_by: '',
    modified_date: '',
    created_date: ''
  });

  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const [updateButtonVisible, setUpdateButtonVisible] = useState(false);
  const [showExcelButton, setShowExcelButton] = useState(false);
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const Location_Code = sessionStorage.getItem("selectedLocationCode");

  //code added by Harish purpose of set user permisssion
  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const journalPermission = permissions
    .filter(permission => permission.screen_type === 'Journal')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    const companyCode = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_code: companyCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const Transaction = data.map(option => option.attributedetails_name);
        setTransdrop(Transaction);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const reloadGridData = () => {
    window.location.reload();
  };

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let startYear, endYear;
    if (currentMonth >= 4) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const financialYearStartDate = new Date(startYear, 3, 1).toISOString().split('T')[0]; // April 1
    const financialYearEndDate = new Date(endYear, 2, 31).toISOString().split('T')[0]; // March 31

    setFinancialYearStart(financialYearStartDate);
    setFinancialYearEnd(financialYearEndDate);
  }, []);

  const handleDelete = (params) => {
    const serialNumberToDelete = params.data.Item_SNo;
    let updatedRowData = rowData.filter(row => row.Item_SNo !== serialNumberToDelete);

    updatedRowData = updatedRowData.map((row, index) => ({
      ...row,
      Item_SNo: index + 1
    }));
    setRowData(updatedRowData);

    if (updatedRowData.length === 0) {
      const newRow = {
        transaction_type: '',
        original_accountcode: '',
        contra_accountCode: '',
        journal_amount: 0,
        narration1: '',
        narration2: '',
        narration3: '',
        narration4: '',
        Item_SNo: 1

      };
      setRowData([newRow]);
    }
  };

  function qtyValueSetter(params) {
    const newValue = parseFloat(params.newValue);
    if (isNaN(newValue) || newValue < 0) {
      toast.warning("Amount cannot be negative!");
      return false;
    }
    params.data.journal_amount = newValue;
    return true;
  }

  const columnDefs = [
    {
      headerName: "S.NO",
      field: "Item_SNo",
      editable: true,
      maxWidth: 80,
      minWidth: 80,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: '',
      field: 'delete',
      editable: false,
      maxWidth: 25,
      tooltipValueGetter: (p) => "Delete",
      onCellClicked: handleDelete,
      cellRenderer: function (params) {
        return <FontAwesomeIcon icon="fa-solid fa-trash" style={{ cursor: 'pointer', marginRight: "12px" }} />
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      sortable: false
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      editable: true,
      cellStyle: { textAlign: "left" },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Transdrop,
      },
    },
    {
      headerName: "Original Account Code",
      field: "original_accountcode",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 25,
      },
    },
    {
      headerName: "Contra Account Code",
      field: "contra_accountCode",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 25,
      },
    },
    {
      headerName: "Journal Amount",
      field: "journal_amount",
      editable: true,
      valueSetter: qtyValueSetter,
      cellStyle: { textAlign: "left" },
    },
    {
      headerName: "Narration1",
      field: "narration1",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 255,
      },
    },
    {
      headerName: "Narration2",
      field: "narration2",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 255,
      },
    },
    {
      headerName: "Narration3",
      field: "narration3",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 255,
      },
    },
    {
      headerName: "Narration4",
      field: "narration4",
      editable: true,
      cellStyle: {
        textAlign: "left",
      },
      cellEditorParams: {
        maxLength: 255,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: false,
  };

  const handleSaveButtonClick = async () => {
    if (!transaction_date) {
      setError(true);
      toast.warning("Missing required fields");
      return;
    }

    const enteredRows = rowData.filter(row =>
      row.transaction_type ||
      row.original_accountcode ||
      row.contra_accountCode ||
      row.narration1 ||
      Number(row.journal_amount) > 0
    );

    if (enteredRows.length === 0) {
      toast.warning("Please enter at least one Journal Detail row.");
      return;
    }

    const invalidRows = enteredRows.filter(row =>
      !row.transaction_type ||
      !row.original_accountcode ||
      !row.contra_accountCode ||
      !row.narration1 ||
      !row.journal_amount ||
      Number(row.journal_amount) <= 0
    );

    if (invalidRows.length > 0) {
      toast.warning(
        "Please fill Transaction Type, Original Account Code, Contra Account Code, Journal Amount and Narration1 for all entered rows."
      );
      return;
    }

    setError(false);

    try {
      const Header = {
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        transaction_date,
        created_by: sessionStorage.getItem("selectedUserCode"),
        Location_Code,
      };

      const response = await fetch(`${config.apiBaseUrl}/AddJournalHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });

      if (response.ok) {
        const searchData = await response.json();

        const [{ journal_no }] = searchData;

        setjournal_no(journal_no);

        // Save only validated rows
        await JournalDetails(journal_no, enteredRows);

        toast.success("Journal Data Inserted Successfully");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
    }
  };

  const JournalDetails = async (journal_no, validRows) => {
    try {
      for (const row of validRows) {
        const Details = {
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          created_by: sessionStorage.getItem("selectedUserCode"),
          journal_no,
          transaction_date,
          transaction_type: row.transaction_type,
          original_accountcode: row.original_accountcode,
          contra_accountCode: row.contra_accountCode,
          journal_amount: row.journal_amount,
          Item_SNo: row.Item_SNo,
          narration1: row.narration1,
          narration2: row.narration2,
          narration3: row.narration3,
          narration4: row.narration4,
          Location_Code,
        };

        const response = await fetch(
          `${config.apiBaseUrl}/AddJournalDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Details),
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          toast.error(errorResponse.message);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message);
      return false;
    }
  };

  const handleDeleteButtonClick = async () => {
    if (!journal_no) {
      setError(true);
      toast.warning("Error: Missing required fields");
      return;
    }
    setError(false);

    try {

      const detailResult = await journaldetdata();

      if (!detailResult.success) {
        toast.warning(detailResult.message);
        return;
      }

      const headerResult = await journalhdrdata();

      if (!headerResult.success) {
        toast.warning(headerResult.message);
        return;
      }

      toast.success("Successfully Deleted");

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const journalhdrdata = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/JournaDeleteHdr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          journal_no,
          Location_Code
        })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      }

      return { success: false, message: data.message };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const journaldetdata = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/JournalDeletedet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          journal_no,
          Location_Code
        })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      }

      return { success: false, message: data.message };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const transformRowData = (data) => {
    return data.map(row => ({
      "Transaction": row.transaction_type,
      "Original Accountcode": row.original_accountcode,
      "Contra AccountCode ": row.contra_accountCode,
      "Journal Amount": row.journal_amount.toString(),
      "Item S.No": row.Item_SNo,
      "Narration 1 ": row.narration1,
      "Narration 2": row.narration2,
      "Narration 3": row.narration3,
      "Narration 4": row.narration4,

    }));
  };

  const handleExcelDownload = () => {
    if (rowData.length === 0 || !journal_no || !transaction_date) {
      toast.warning("There is no data to export.");
      return;
    }

    const headerData = [{
      "company code": sessionStorage.getItem('selectedCompanyCode'),
      "Journal No": journal_no,
      "Transaction Date": transaction_date,
    }];

    const transformedData = transformRowData(rowData);
    const rowDataSheet = XLSX.utils.json_to_sheet(transformedData);
    const headerSheet = XLSX.utils.json_to_sheet(headerData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, headerSheet, "Header Data");
    XLSX.utils.book_append_sheet(workbook, rowDataSheet, "journal  Details");

    XLSX.writeFile(workbook, "Journal .xlsx");
  };

  const generateReport = async () => {
    try {
      const headerData = await PrintHeaderData();
      const detailData = await PrintDetailData();

      if (headerData && detailData) {
        console.log("All API calls completed successfully");

        sessionStorage.setItem('JheaderData', JSON.stringify(headerData));
        sessionStorage.setItem('JdetailData', JSON.stringify(detailData));

        window.open('/JournalPrint', '_blank');
      } else {
        console.log("Failed to fetch some data");
        toast.warning("Trasaction ID Does Not Exits");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const PrintHeaderData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/JournalHdrPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), journal_no: journal_no })
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

  const PrintDetailData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/JournalDetPrint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode'), journal_no: journal_no })
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
  }

  const handleAddRow = () => {
    const Item_SNo = rowData.length + 1;
    const newRow = { Item_SNo, item_code: '', qty: 0 };
    setRowData([...rowData, newRow]);
  };

  const handleRemoveRow = () => {
    if (rowData.length > 0) {
      const updatedRowData = rowData.slice(0, -1);
      if (updatedRowData.length === 0) {
        setRowData([{ Item_SNo: '', item_code: '', qty: 0 }]);
      } else {
        setRowData(updatedRowData);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleadjustmentbtn = () => {
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlejournal = async (data) => {
    setShowExcelButton(true)
    setSaveButtonVisible(false);
    setUpdateButtonVisible(true);
    if (data && data.length > 0) {
      const [{ JournalNo, Transactiondate }] = data;

      const No = document.getElementById('JournalNo');
      if (No) {
        No.value = JournalNo;
        setjournal_no(JournalNo);
      } else {
        console.error('Journal  element not found');
      }

      const Date = document.getElementById('TransactionDate');
      if (Date) {
        Date.value = Transactiondate;
        settransaction_date(formatDate(Transactiondate));
      } else {
        console.error('transactionDate element not found');
      }

      await Journaldetails(JournalNo);

    } else {
      console.log("Data not fetched...!");
    }
  };

  const Journaldetails = async (JournalNo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getJournalDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ journal_no: JournalNo })
      });

      if (response.ok) {
        const searchData = await response.json();
        const newRowData = [];
        searchData.forEach(item => {
          const { transaction_type, original_accountcode, Item_SNo, narration1, narration4, narration3, narration2, contra_accountCode, journal_amount, } = item;
          newRowData.push({
            Item_SNo: Item_SNo,
            transaction_type: transaction_type,
            original_accountcode: original_accountcode,
            contra_accountCode: contra_accountCode,
            journal_amount: journal_amount,
            narration1: narration1,
            narration2: narration2,
            narration3: narration3,
            narration4: narration4,

          });
        });
        setRowData(newRowData)
      } else if (response.status === 404) {
        console.log("Data not found");
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleUpdateButtonClick = async () => {
    if (!journal_no || !transaction_date) {
      return;
    }

    if (rowData.length === 0) {
      toast.error("No details found to save.");
      return;
    }

    try {

      const [detailResult] = await Promise.all([
        handleDeleteUpdateDetail()
      ]);

      if (!detailResult) {
        throw new Error('Detail deletion failed');
      }

      await Promise.all([
        updateJournalDetails()
      ]);

      toast.success("Journal Data Updated Successfully");

      console.log('Update successful');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDeleteUpdateDetail = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/JournalDeletedet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ journal_no })
      });
      if (response.ok) {
        return true
      } else {
        console.log("Failed to fetch some data");
      }
    } catch (error) {
      console.error("Error executing API calls:", error);
    }
  };

  const updateJournalDetails = async () => {
    try {
      for (const row of rowData) {
        const Details = {
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          created_by: sessionStorage.getItem('selectedUserCode'),
          transaction_date,
          journal_no,
          transaction_type: row.transaction_type,
          original_accountcode: row.original_accountcode,
          contra_accountCode: row.contra_accountCode,
          journal_amount: row.journal_amount,
          Item_SNo: row.Item_SNo,
          narration1: row.narration1,
          narration2: row.narration2,
          narration3: row.narration3,
          narration4: row.narration4
        };

        const response = await fetch(`${config.apiBaseUrl}/AddJournalDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Details),
        });

        if (response.ok) {
          console.log("Journal  Data inserted successfully");
        } else {
          const errorResponse = await response.json();
          console.error(errorResponse.message);
          toast.warning(errorResponse.message);
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlejournaldata(journal_no)
    }
  };

  const handlejournaldata = async (code) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getJournaldata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ journal_no: code })
      });
      if (response.ok) {
        setSaveButtonVisible(false);
        setShowExcelButton(true);
        setUpdateButtonVisible(true);
        const searchData = await response.json();
        if (searchData.Header && searchData.Header.length > 0) {
          const item = searchData.Header[0];
          settransaction_date(formatDate(item.transaction_date));

        } else {
          console.log("Header Data is empty or not found");
          settransaction_date('');
          setjournal_no('');
        }

        if (searchData.Detail && searchData.Detail.length > 0) {
          const updatedRowData = searchData.Detail.map(item => {

            return {
              transaction_type: item.transaction_type,
              original_accountcode: item.original_accountcode,
              contra_accountCode: item.contra_accountCode,
              journal_amount: item.journal_amount,
              Item_SNo: item.Item_SNo,
              narration1: item.narration1,
              narration2: item.narration2,
              narration3: item.narration3,
              narration4: item.narration4

            };
          });

          setRowData(updatedRowData);
        } else {
          console.log("Detail Data is empty or not found");
          setRowData([{ Item_SNo: 1, item_code: '', qty: 0 }]);
        }

        console.log("data fetched successfully")
      } else if (response.status === 404) {
        toast.warning('Data not found');
        settransaction_date('');
        setjournal_no('');
        setRowData([{
          transaction_type: '', original_accountcode: '', contra_accountCode: '',
          journal_amount: 0, Item_SNo: 1, narration1: '', narration2: '', narration3: '', narration4: ''
        }]);
      } else {
        console.log("Bad request");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  //CODE ITEM CODE TO ADD NEW ROW FUNCTION
  const handleCellValueChanged = (params) => {
    const { colDef, rowIndex, newValue } = params;
    const lastRowIndex = rowData.length - 1;

    if (colDef.field === 'journal_amount') {
      const quantity = parseFloat(newValue);

      if (quantity > 0 && rowIndex === lastRowIndex) {
        const Item_SNo = rowData.length + 1;
        const newRowData = {
          Item_SNo,
          transaction_type: null,
          original_accountcode: null,
          contra_accountCode: null,
          journal_amount: 0,
          narration1: null,
          narration2: null,
          narration3: null,
          narration4: null,
        };

        setRowData(prevRowData => [...prevRowData, newRowData]);
      }
    }
  };


  return (
    <div className="container-fluid Topnav-screen">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div align="right">

        <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
          <div class="d-flex justify-content-between" >
            <div className="d-flex justify-content-start ">
              <h1 align="left" class="purbut" >Journal</h1>
            </div>
            <div className="d-flex justify-content-end me-3" >
              {saveButtonVisible && ['add', 'all permission'].some(permission => journalPermission.includes(permission)) && (
                <savebutton className="purbut" onClick={handleSaveButtonClick}
                  required title="save"> <i class="fa-regular fa-floppy-disk"></i> </savebutton>
              )}
              {['delete', 'all permission'].some(permission => journalPermission.includes(permission)) && (
                <delbutton onClick={handleDeleteButtonClick} required title="Delete">
                  <i class="fa-solid fa-trash"></i>
                </delbutton>
              )}
              <printbutton className="purbut" title='excel' onClick={handleExcelDownload}>
                <i class="fa-solid fa-file-excel"></i>
              </printbutton>

              {['all permission', 'view'].some(permission => journalPermission.includes(permission)) && (
                <printbutton class="print" className="purbut" onClick={generateReport} required title="Generate Report" >
                  <i class="fa-solid fa-file-pdf"></i></printbutton>
              )}
            </div>
          </div>
          <div className="mobileview">
            <div class="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <h1 align="left" className="h1">Journal</h1>
              </div>
              <div class="dropdown mt-2 me-5 ms-5" >
                <button
                  class="btn btn-primary dropdown-toggle p-1 show"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-list"></i>
                </button>

                <ul class="dropdown-menu" href="#" id="navbarDropdownLbl" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <li class="iconbutton d-flex justify-content-center text-success">
                    {['add', 'all permission'].some(permission => journalPermission.includes(permission)) && (
                      <icon class="icon" onClick={handleSaveButtonClick}>
                        <i class="fa-regular fa-floppy-disk"></i>
                      </icon>
                    )}
                  </li>
                  <li class="iconbutton  d-flex justify-content-center">
                    {['all permission', 'view'].some(permission => journalPermission.includes(permission)) && (
                      <icon
                        class="icon" onClick={handleDeleteButtonClick}> <i class="fa-solid fa-trash"></i>
                      </icon>
                    )}
                  </li>
                  <li class=" iconbutton d-flex justify-content-center">
                    {["all permission", "view"].some((permission) =>
                      journalPermission.includes(permission)
                    ) && (
                        <icon class="icon" onClick={generateReport}>
                          <i class="fa-solid fa-file-excel"></i>
                        </icon>
                      )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
        <div className="row ms-3 mb-3">

          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="rolname" class="exp-form-labels">
                Journal No
              </label>
              <div class="d-flex justify-content-end">
                <input
                  id="JournalNo"
                  className="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please fill the journal number here"
                  value={journal_no}
                  maxLength={25}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setjournal_no(e.target.value)}
                />
                <div className='position-absolute mt-2 me-2'>
                  <span
                    style={hovered ? { cursor: "pointer", borderRadius: "50%", backgroundColor: "#f0f0f0", padding: "10px" } : { cursor: "pointer", borderRadius: "50%", padding: "10px" }}
                    onClick={handleadjustmentbtn}>
                    <i class="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 form-group ">
            <div class="exp-form-floating">
              <label for="" className={`${error && !transaction_date ? 'red' : ''}`}>
                Transaction Date<span className="text-danger">*</span>
              </label>
              <input
                id="TransactionDate"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required title="Please fill the transaction date here"
                min={financialYearStart}
                max={financialYearEnd}
                value={transaction_date}
                onChange={(e) => settransaction_date(e.target.value)}
                maxLength={50}
              />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end me-5 mb-2" style={{ marginBlock: "", marginTop: "10px" }} >

          <div align="" class="d-flex justify-content-end" >
            <icon
              type="button"
              class="popups-btn"
              onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} />
            </icon>
            <icon
              type="button"
              class="popups-btn"
              onClick={handleRemoveRow}>
              <FontAwesomeIcon icon={faMinus} />
            </icon>
          </div>
        </div>

        <div class="ag-theme-alpine" style={{ height: 430, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ editable: true, resizable: true }}
            onCellValueChanged={handleCellValueChanged}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>


      </div>
      <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
        <div className="row ms-2">
          <div className="d-flex justify-content-start">
            <p className="col-md-6">Created_by: {additionalData.created_by}</p>
            <p className="col-md-">Created_date: {additionalData.created_date}</p>

          </div>
          <div className="d-flex justify-content-start">
            <p className="col-md-6">modified_by: {additionalData.modified_by} </p>
            <p className="col-md-6">modified_date:  {additionalData.modified_date}</p>
          </div>
        </div>
        <div>
          <JournalPopup open={open} handleClose={handleClose} handlejournal={handlejournal} />
        </div>
      </div>
    </div>
  );
}

export default JournalGrid;
import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import LoadingScreen from './Loading';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';


function StdAccInput({ }) {
  const navigate = useNavigate();
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [transactiondrop, setTransactiondrop] = useState([]);
  const [TransactionType, setTransactionType] = useState("");
  const [selectedLockType, setSelectedLockType] = useState("");
  const [Lockdrop, setLockdrop] = useState([]);
  const [LockType, setLockType] = useState([]);
  const [keyfield, setKeyfield] = useState('');
  const [loading, setLoading] = useState(false);
  const [base_accgroup_code, setbase_accgroup_code] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('base');
  const [selectBaseacc, setselectedbaseacc] = useState('');
  const StartYear = useRef(null)
  const EndYear = useRef(null)
  const transactionType = useRef(null)
  const lockType = useRef(null)
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const config = require('./Apiconfig');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setStartYear("");
    setEndYear("");
    setSelectedTransaction("");
    setTransactionType("");
    setSelectedLockType("");
    setLockType("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow) {
      if (selectedRow.start_year) {
        const formattedStartYear = new Date(selectedRow.start_year).toISOString().split("T")[0];
        setStartYear(formattedStartYear);
      } else {
        setStartYear("");
      }

      if (selectedRow.end_year) {
        const formattedEndYear = new Date(selectedRow.end_year).toISOString().split("T")[0];
        setEndYear(formattedEndYear);
      } else {
        setEndYear("");
      }

      setTransactionType(selectedRow.transaction_type || "");
      setLockType(selectedRow.locked || "");
      setKeyfield(selectedRow.keyfield || "");
      setSelectedTransaction({
        label: selectedRow.transaction_type,
        value: selectedRow.transaction_type,
      });
      setSelectedLockType({
        label: selectedRow.locked,
        value: selectedRow.locked,
      });
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow]);

  const getFinancialYearDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; 
    console.log(currentMonth)
    let startYear, endYear;

    if (currentMonth < 4) {
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      startYear = currentYear;
      endYear = currentYear + 1;
    }

    const FirstDate = `${startYear}-04-01`;
    const LastDate = `${endYear}-03-31`;

    return { FirstDate, LastDate };
  };

  const { FirstDate, LastDate } = getFinancialYearDates();


  const handleChangeTransaction = (selectedTransaction) => {
    setSelectedTransaction(selectedTransaction);
    setTransactionType(selectedTransaction ? selectedTransaction.value : '');
  };

  const filteredOptionTransaction = transactiondrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/Transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTransactiondrop(val));
  }, []);

  const handleChangeLockType = (selectedLockType) => {
    setSelectedLockType(selectedLockType);
    setLockType(selectedLockType ? selectedLockType.value : '');
  };

  const filteredOptionLockType = Lockdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getLockType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setLockdrop(val));
  }, []);

  const handleInsert = async () => {
    if (
      !startYear ||
      !endYear ||
      !TransactionType ||
      !LockType
    ) {
      setError(true);
      toast.warning("Error: Missing required fields");
      return;
    }
    const start = new Date(startYear);
    const end = new Date(endYear);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.warning("Please enter valid date values for Start Year and End Year.");
      return;
    }

    if (start > end) {
      toast.warning("Start Year cannot be greater than End Year.");
      return;
    }

    setError(false);
    setLoading(true);
    try {

      const response = await fetch(`${config.apiBaseUrl}/AddFinacnialyearlockscreen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          start_year: startYear,
          end_year: endYear,
          transaction_type: TransactionType,
          locked: LockType,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message)
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message)
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !startYear ||
      !endYear ||
      !TransactionType ||
      !LockType
    ) {
      setError(true);
      toast.warning("Error: Missing required fields");
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/UpdateFinacnialyearlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          start_year: startYear,
          end_year: endYear,
          transaction_type: TransactionType,
          locked: LockType,
          modified_by: sessionStorage.getItem("selectedUserCode"),
          keyfield
        }),
      });
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/FinancialYearAccess");
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e); 
        setHasValueChanged(false); 
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); 
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false); 
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="">
        <div class="">
          <div className="shadow-lg p-0 bg-body-tertiary rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <div className="d-flex justify-content-start">
                <h1 align="left" class="fs-3">{mode === "update" ? 'Update Financial Year Access' : 'Add Financial Year Access'}</h1>
              </div>
              <div className="d-flex justify-content-end">
                <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="shadow-lg p-3 mt-2 pt-4 pb-4 bg-body-tertiary rounded">
            <div className="row ">
              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <label htmlFor="party_code" className={`${error && !startYear ? 'red' : ''}`}>
                    Start Year<span className="text-danger">*</span>
                  </label>
                  <input
                    id="stdcode"
                    class="exp-input-field form-control"
                    type="Date"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    ref={StartYear}
                    onKeyDown={(e) => handleKeyDown(e, EndYear, StartYear)}
                  />
                </div>
              </div>

              <div className="col-md-3 form-group ">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div> <label htmlFor="party_code" className={`${error && !endYear ? 'red' : ''}`}>
                      End Year
                    </label></div>
                    <div> <span className="text-danger">*</span></div>
                  </div><input
                    id="stdname"
                    class="exp-input-field form-control"
                    type="Date"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    ref={EndYear}
                    onKeyDown={(e) => handleKeyDown(e, transactionType, EndYear)}
                  />
                </div>
              </div>

              <div className="col-md-3 form-group ">
                <label htmlFor="party_code" className={`${error && !TransactionType ? 'red' : ''}`}>
                  Transactions Type<span className="text-danger">*</span>
                </label>
                <div title="Select the Transactions Type">
                  <Select
                    id="taxtransaction"
                    type="text"
                    className="exp-input-field"
                    value={selectedTransaction}
                    onChange={handleChangeTransaction}
                    options={filteredOptionTransaction}
                    ref={transactionType}
                    onKeyDown={(e) => handleKeyDown(e, lockType, transactionType)}
                  />
                </div>
              </div>

              <div className="col-md-3 form-group ">
                <div class="exp-form-floating"> <label htmlFor="party_code" className={`${error && !LockType ? 'red' : ''}`}>
                  Locked<span className="text-danger">*</span>
                </label>
                  <div title="Select the Locked Status">
                    <Select
                      className="exp-input-field"
                      value={selectedLockType}
                      onChange={handleChangeLockType}
                      options={filteredOptionLockType}
                      ref={lockType}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (mode === "create") {
                            handleInsert();
                          } else {
                            handleUpdate();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div class="col-md-3 form-group d-flex justify-content-start mb-4">
                {mode === "create" ? (
                  <button onClick={handleInsert} className="mt-4" title="Save">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                ) : (
                  <button className="mt-4" title="Update" onClick={handleUpdate} >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
export default StdAccInput;
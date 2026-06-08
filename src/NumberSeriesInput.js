import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { useLocation } from "react-router-dom";
const config = require('./Apiconfig');

function NumberSeriesInput({ }) {
  const [Screen_Type, setScreen_Type] = useState("");
  const [screentypedrop, setscreentypedrop] = useState([]);
  const [Start_Year, setStart_Year] = useState("");
  const [End_Year, setEnd_Year] = useState("");
  const [Start_No, setStart_No] = useState(1);
  const [Running_No, setRunning_No] = useState(0);
  const [End_No, setEnd_No] = useState(10000);
  const [comtext, secomtext] = useState("");
  const [selectedscreentype, setselectedscreentype] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [booleandrop, setBooleandrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedBoolean, setselectedBoolean] = useState('');
  const [status, setStatus] = useState("");
  const [number_prefix, setNumber_prefix] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const startyear = useRef(null);
  const screentype = useRef(null);
  const endyear = useRef(null);
  const strtno = useRef(null);
  const runno = useRef(null);
  const endno = useRef(null);
  const text = useRef(null);
  const Status = useRef(null);
  const numpre = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [isUpdated, setIsUpdated] = useState(false);

  const modified_by = sessionStorage.getItem("selectedUserCode");

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setStart_Year("");
    setEnd_Year("");
    setStart_No("");
    setRunning_No("");
    setEnd_No("");
    setScreen_Type("");
    setStatus("");
    setNumber_prefix("");
    secomtext("");
    setselectedscreentype("");
    setselectedStatus("");
    setselectedBoolean("");
  }

  useEffect(() => {
    if (mode === "update" && selectedRow) {
      setStart_Year(selectedRow.Start_Year || "");
      setEnd_Year(selectedRow.End_Year || "");
      setStart_No(selectedRow.Start_No || "");
      setRunning_No(selectedRow.Running_No || "0");
      setEnd_No(selectedRow.End_No || "");
      secomtext(selectedRow.comtext || "");
      setScreen_Type(selectedRow.Screen_Type || "");
      setStatus(selectedRow.Status || "");
      setNumber_prefix(selectedRow.number_prefix || "");
      setselectedscreentype({
        label: selectedRow.Screen_Type,
        value: selectedRow.Screen_Type,
      });
      setselectedStatus({
        label: selectedRow.Status,
        value: selectedRow.status,
      });
      setselectedBoolean({
        label: selectedRow.number_prefix,
        value: selectedRow.number_prefix,
      });
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow]);


  const handleUpdate = async () => {
    if (
      !Screen_Type ||
      !Start_Year ||
      !End_Year ||
      !Start_No ||
      !Running_No ||
      !End_No ||
      !comtext ||
      !status
    ) {
      setError(true);
      toast.warning("Missing Required Fields");
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/NumberSeriesUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Screen_Type: selectedscreentype.value,
          Start_Year: Start_Year,
          End_Year: End_Year,
          Running_No: Running_No,
          Start_No: Start_No,
          End_No: End_No,
          text: comtext,
          number_prefix: number_prefix,
          Status: status,
          modified_by,
        }),
      });
      if (response.ok) {
        toast.success("Data updated successfully", {
          // onClose: () => clearInputFields()
        });
      }
      else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/screentype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setscreentypedrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getboolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setBooleandrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionscreentype = Array.isArray(screentypedrop)
    ? screentypedrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredOptionStatus = Array.isArray(statusdrop)
    ? statusdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredOptionBoolean = Array.isArray(booleandrop)
    ? booleandrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    let financialYearStartDate, financialYearEndDate;
    if (currentMonth < 3) {
      financialYearStartDate = `${currentYear - 1}-04-01`;
      financialYearEndDate = `${currentYear}-03-31`;
    } else {
      financialYearStartDate = `${currentYear}-04-01`;
      financialYearEndDate = `${currentYear + 1}-03-31`;
    }
    setStart_Year(financialYearStartDate);
    setEnd_Year(financialYearEndDate);
  }, []);

  const handleChangescreentype = (selectedscreentype) => {
    setselectedscreentype(selectedscreentype);
    setScreen_Type(selectedscreentype ? selectedscreentype.value : '');
  };

  const handleChangeStatus = (selectedStatus) => {
    setselectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeBoolean = (selectedBoolean) => {
    setselectedBoolean(selectedBoolean);
    setNumber_prefix(selectedBoolean ? selectedBoolean.value : '');
  };

  const handleInsert = async () => {
    if (
      !Screen_Type ||
      !Start_Year ||
      !End_Year ||
      !Start_No ||
      !Running_No ||
      !End_No ||
      !comtext ||
      !status
    ) {
      setError(true);
      toast.warning("Missing Required Fields");
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addNumberseries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          Screen_Type,
          Start_Year,
          End_Year,
          Start_No,
          Running_No,
          End_No,
          comtext,
          number_prefix,
          status,
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
    navigate("/NumberSeries");
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
      <div className="">
        <div class="">
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut" >{mode === "update" ? 'Update Number Series ' : 'Add Number Series'} </h1>
              <h1 align="left" class="fs-4 mobileview" >{mode === "update" ? 'Update Number Series ' : 'Add Number Series'} </h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div class="pt-2 mb-4">
            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !Screen_Type ? 'text-danger' : ''}`}>
                      Screen Type<span className="text-danger">*</span>
                    </label>
                    <div title="Select the Screen Type">
                      <Select
                        id="status"
                        isClearable
                        value={selectedscreentype}
                        onChange={handleChangescreentype}
                        options={filteredOptionscreentype}
                        className="exp-input-field "
                        placeholder=""
                        required title="Please select a screen type"
                        ref={screentype}
                        readOnly={mode === "update"}
                        isDisabled={mode === "update"}
                        onKeyDown={(e) => handleKeyDown(e, startyear, screentype)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !Start_Year ? 'text-danger' : ''}`}>
                      Start Year<span className="text-danger">*</span>
                    </label>
                    <input
                      id="acc"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the start year"
                      value={Start_Year}
                      onChange={(e) => setStart_Year
                        (e.target.value)}
                      maxLength={9}
                      ref={startyear}
                      onKeyDown={(e) => handleKeyDown(e, endyear, startyear)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !End_Year ? 'text-danger' : ''}`}>
                      End Year<span className="text-danger">*</span>
                    </label>
                    <input
                      id="acc"
                      class="exp-input-field form-control"
                      type="date"
                      placeholder=""
                      required title="Please enter the end year"
                      value={End_Year}
                      onChange={(e) => setEnd_Year
                        (e.target.value)}
                      maxLength={9}
                      ref={endyear}
                      onKeyDown={(e) => handleKeyDown(e, strtno, endyear)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !Start_No ? 'text-danger' : ''}`}>
                      Start No<span className="text-danger">*</span>
                    </label>
                    <input
                      id="acc"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the start number"
                      value={Start_No}
                      onChange={(e) => setStart_No
                        (e.target.value)}
                      maxLength={9}
                      ref={strtno}
                      onKeyDown={(e) => handleKeyDown(e, runno, strtno)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !Running_No ? 'text-danger' : ''}`}>
                      Running No<span className="text-danger">*</span>
                    </label>
                    <input
                      id="acc"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the running number"
                      value={Running_No}
                      onChange={(e) => setRunning_No
                        (e.target.value)}
                      maxLength={9}
                      ref={runno}
                      onKeyDown={(e) => handleKeyDown(e, endno, runno)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !End_No ? 'text-danger' : ''}`}>
                      End No<span className="text-danger">*</span>
                    </label>
                    <input
                      id="acc"
                      class="exp-input-field form-control"
                      type="number"
                      placeholder=""
                      required title="Please enter the end number"
                      value={End_No}
                      onChange={(e) => setEnd_No
                        (e.target.value)}
                      maxLength={9}
                      ref={endno}
                      onKeyDown={(e) => handleKeyDown(e, text, endno)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group mb-2">
                  <label for="text" className={`${error && !comtext ? 'text-danger' : ''}`}>
                    Text<span className="text-danger">*</span>
                  </label>
                  <div class="exp-form-floating">
                    <input
                      className="exp-input-field form-control"
                      id='party_code'
                      required
                      value={comtext}
                      onChange={(e) => secomtext
                        (e.target.value)}
                      autoComplete="off"
                      type="text"
                      ref={text}
                      onKeyDown={(e) => handleKeyDown(e, Status, text)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`${error && !status ? 'text-danger' : ''}`}>
                      Status<span className="text-danger">*</span>
                    </label>
                    <div title="Select the Status">
                      <Select
                        id="status"
                        isClearable
                        value={selectedStatus}
                        onChange={handleChangeStatus}
                        options={filteredOptionStatus}
                        className="exp-input-field"
                        placeholder=""
                        ref={Status}
                        required title="Please select a status"
                        onKeyDown={(e) => handleKeyDown(e, numpre, Status)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" class="exp-form-labels">
                      Number Prefix
                    </label>
                    <div title="Select the Number Prefix">
                      <Select
                        id="numpref"
                        isClearable
                        value={selectedBoolean}
                        onChange={handleChangeBoolean}
                        options={filteredOptionBoolean}
                        className="exp-input-field"
                        placeholder=""
                        required title="Please select a Number Prefix status"
                        ref={numpre}
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

                <div class="col-md-3 form-group">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-4" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-4" title="Update">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NumberSeriesInput;
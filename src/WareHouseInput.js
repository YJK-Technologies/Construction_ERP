import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { useLocation } from "react-router-dom";
import LoadingScreen from './Loading';
import { setYear } from "date-fns";
const config = require('./Apiconfig');


function WareHouseInput({ }) {
  const [warehouse_code, setWarehouse_Code] = useState("");
  const [warehouse_name, setWarehouse_Name] = useState("");
  const [status, setStatus] = useState("");
  const [location_no, setLocation_No] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [locationnodrop, setLocationdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const StatuS = useRef(null);
  const WarehouseCode = useRef(null);
  const WarehouseName = useRef(null);
  const Status = useRef(null);
  const LocatioN = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const navigate = useNavigate();
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [loading, setLoading] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  console.log(selectedRow);

  const clearInputFields = () => {
    setWarehouse_Code("");
    setWarehouse_Name("");
    setSelectedLocation("");
    setLocation_No("");
    setSelectedStatus("");
    setStatus("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow) {
      setSelectedLocation({
        label: selectedRow.location_no,
        value: selectedRow.location_no,
      });
      setLocation_No(selectedRow.location_no || "");
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setStatus(selectedRow.status || "")
      setWarehouse_Code(selectedRow.warehouse_code || "");
      setWarehouse_Name(selectedRow.warehouse_name || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow]);

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
    fetch(`${config.apiBaseUrl}/locationno`)
      .then((data) => data.json())
      .then((val) => setLocationdrop(val));
  }, []);

  const filteredOptionStatus = Array.isArray(statusdrop)
    ? statusdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const filteredOptionLocation = Array.isArray(locationnodrop)
    ? locationnodrop.map((option) => ({
      value: option.location_no,
      label: option.location_no,
    }))
    : [];

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeLocation = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    setLocation_No(selectedLocation ? selectedLocation.value : '');
  };

  const handleInsert = async () => {
    if (
      !warehouse_code ||
      !warehouse_name ||
      !status ||
      !location_no
    ) {
      setError(true);
      toast.warning("Missing required fields");
      return;
    }

    setError(false)
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddWareHousedata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          warehouse_code,
          warehouse_name,
          status,
          location_no,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.ok) {
        console.log("Data inserted successfully");
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields(),
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
    navigate("/WareHouse");
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

  const handleUpdate = async () => {
    if (
      !warehouse_code ||
      !warehouse_name ||
      !status ||
      !location_no
    ) {
      setError(true);
      toast.warning("Missing required fields");
      return;
    }

    setError(false)
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/WarehouseUpdates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          warehouse_code,
          warehouse_name,
          status: selectedStatus.value,
          location_no: selectedLocation.value,
          created_by,
          modified_by,
        }),
      });
      if (response.ok) {
        console.log("Data Updated successfully");
        toast.success("Data updated successfully", {
          // onClose: () => clearInputFields(),
        });
      } else {
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

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
            <div className="purbut mb-0 d-flex justify-content-between" >
              <h1 align="left" class="fs-4 mobileview " > {mode === "update" ? 'Update  Warehouse ' : ' Add Warehouse'} </h1>
              <h1 align="left" class="purbut" > {mode === "update" ? 'Update  Warehouse ' : ' Add Warehouse'} </h1>
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
                    <label for="state" className={`exp-form-labels ${error && !warehouse_code ? 'text-danger' : ''}`}>
                      Warehouse Code<span className="text-danger">*</span>
                    </label>
                    <input
                      id="whcode"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the warehouse code"
                      value={warehouse_code}
                      maxLength={18}
                      onChange={(e) => setWarehouse_Code(e.target.value)}
                      ref={WarehouseCode}
                      readOnly={mode === "update"}
                      onKeyDown={(e) => handleKeyDown(e, WarehouseName, WarehouseCode)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`exp-form-labels ${error && !warehouse_name ? 'text-danger' : ''}`}>
                      Warehouse Name<span className="text-danger">*</span>
                    </label>
                    <input
                      id="whname"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required title="Please enter the warehouse name"
                      value={warehouse_name}
                      maxLength={250}
                      onChange={(e) => setWarehouse_Name(e.target.value)}
                      ref={WarehouseName}
                      onKeyDown={(e) => handleKeyDown(e, Status, WarehouseName)}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`exp-form-labels ${error && !status ? 'text-danger' : ''}`}>
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
                        onKeyDown={(e) => handleKeyDown(e, LocatioN, Status)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="state" className={`exp-form-labels ${error && !location_no ? 'text-danger' : ''}`}>
                      Location No<span className="text-danger">*</span>
                    </label>
                    <div title="Select the Location No">
                      <Select
                        id="status"
                        isClearable
                        value={selectedLocation}
                        onChange={handleChangeLocation}
                        options={filteredOptionLocation}
                        className="exp-input-field"
                        placeholder=""
                        ref={LocatioN}
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

                <div class="col-md-3 form-group  ">
                  {mode === "create" ? (
                    <button onClick={handleInsert} className="mt-4" title="Save">
                      <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  ) : (
                    <button onClick={handleUpdate} className="mt-4" title="Update">
                      <i class="fa-solid fa-pen-to-square"></i>
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
export default WareHouseInput;

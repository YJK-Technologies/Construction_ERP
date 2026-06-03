import React, { useState, useRef, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './Loading';
const config = require("./Apiconfig");



function DepartmentInput({ }) {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmenntName, setDepartmenntName] = useState("");
  const [error, setError] = useState(false);
  const Location = useRef(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const [key_field, setkey_field] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const created_by = sessionStorage.getItem("selectedUserCode");
  const [loading, setLoading] = useState(false);
  const code = useRef(null);
  const Name = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};

  const clearInputFields = () => {
    setDepartmentCode("");
    setDepartmenntName("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow) {

      setDepartmentCode(selectedRow.dept_id || "");
      setDepartmenntName(selectedRow.dept_name || "");
      setkey_field(selectedRow.key_field || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow]);

  const handleInsert = async () => {
    if (!departmentCode || !departmenntName) {
      setError(true);
      toast.warning("Missing require field");
      return;
    }
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/AddDepartment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          dept_id: departmentCode,
          dept_name: departmenntName,
          created_by: sessionStorage.getItem("selectedUserCode"),
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

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
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
    if (e.key === "Enter" && hasValueChanged) {
      setHasValueChanged(false);
    }
  };

  const handleNavigatesToForm = () => {
    navigate("/Department");
  };

  const handleUpdate = async () => {
    if (!departmentCode || !departmenntName) {
      setError(true);
      toast.warning("Missing require field");
      return;
    }
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/DepartmentUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: departmentCode,
          dept_name: departmenntName,
          key_field,
          created_by,
          modified_by,
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
          <div className="shadow-lg p-0 bg-body-tertiary rounded">
            <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut" >{mode === "update" ? 'Update Department' : 'Add Department '}</h1>
              <h1 align="left" class="mobileview fs-4" >{mode === "update" ? 'Update Department' : 'Add Department '}</h1>
              <button onClick={handleNavigatesToForm} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div class="pt-2 mb-4">

            <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
              <div class="row">
                <div className="col-md-3 form-group mb-4">
                  <div class="exp-form-floating">
                    <label for="rid" className={`exp-form-labels ${error && !departmentCode ? 'text-danger' : ''}`}>
                      Department Code<span className="text-danger">*</span>
                    </label>
                    <input
                      id="departmentCode"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required
                      title="Please enter the attribute header code"
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                      maxLength={100}
                      autoComplete="off"
                      ref={code}
                      onKeyDown={(e) => handleKeyDown(e, Name, code)}
                      readOnly={mode === "update"}
                    />
                  </div>
                </div>

                <div className="col-md-3 form-group">
                  <div class="exp-form-floating">
                    <label for="rid" className={`exp-form-labels ${error && !departmenntName ? 'text-danger' : ''}`}>
                      Department Name<span className="text-danger">*</span>
                    </label>
                    <input
                      id="departmenntName"
                      class="exp-input-field form-control"
                      type="text"
                      placeholder=""
                      required
                      autoComplete="off"
                      title="Please enter the attribute header name"
                      value={departmenntName}
                      maxLength={250}
                      onChange={(e) => setDepartmenntName(e.target.value)}
                      ref={Name}
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

                <div class="col-md-3">
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
export default DepartmentInput;

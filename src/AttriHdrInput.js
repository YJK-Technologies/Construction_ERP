import React, { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./Loading";
import Select from "react-select";

const config = require("./Apiconfig");

function AttriHdrInput({ open, handleClose }) {
  const [open2, setOpen2] = React.useState(false);
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributeheader_name, setAttributeheader_Name] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const clearInputFields = () => {
    setAttributeheader_Code("");
    setAttributeheader_Name("");
    setStatus("");
    setSelectedStatus("");
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionStatus = Array.isArray(statusdrop)
    ? statusdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    }))
    : [];

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !attributeheader_name || !status) {
      setError(true);
      toast.warning("Missing Required Fields");
      return;
    }
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/addattriData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),

          attributeheader_code,
          attributeheader_name,
          status,
          created_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Data inserted successfully!", {
          onClose: () => clearInputFields(),
        });
      } else {
        console.error(result.message);
        toast.warning(result.message || "Failed to delete data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("Error inserting data: " + error.message, {});
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/AddAttributeDetail");
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

  return (
    <div className="">
      {loading && <LoadingScreen />}
      {open && (
        <fieldset>
          <div className="purbut">
            <div
              className="purbut modal popupadj popup mt-5"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="modal-dialog  modal-xl  ps-5 p-1 pe-5"
                role="document"
              >
                <div className="modal-content">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <div className=" bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between">
                          <h1 align="left" className="purbut ">
                            Add Attribute Hdr
                          </h1>
                          <button
                            onClick={handleClose}
                            className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5"
                            required
                            title="Close"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div class="mobileview">
                          <div class="d-flex justify-content-between ">
                            <div className="d-flex justify-content-start mt-3 ">
                              <h1 align="left" className="h1">
                                Add Attribute Hdr
                              </h1>
                            </div>
                            <div className="d-flex justify-content-end mb-4 mt-4 pt-2">
                              <delbutton
                                onClick={handleClose}
                                className="btn btn-danger  "
                                required
                                title="Close"
                              >
                                <i class="fa-solid fa-xmark"></i>
                              </delbutton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !attributeheader_code ? 'text-danger' : ''}`}>
                            Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="ahcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header code"
                            value={attributeheader_code}
                            onChange={(e) =>
                              setAttributeheader_Code(e.target.value)
                            }
                            maxLength={100}
                            ref={code}
                            onKeyDown={(e) => handleKeyDown(e, Name, code)}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !attributeheader_name ? 'text-danger' : ''}`}>
                            Name<span className="text-danger">*</span>
                          </label>
                          <input
                            id="ahname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header name"
                            value={attributeheader_name}
                            maxLength={250}
                            onChange={(e) =>
                              setAttributeheader_Name(e.target.value)
                            }
                            ref={Name}
                            onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !status ? 'text-danger' : ''}`}>
                            Status<span className="text-danger">*</span>
                          </label>
                          <div title="Select the Status">
                            <Select
                              id="status"
                              value={selectedStatus}
                              onChange={handleChangeStatus}
                              options={filteredOptionStatus}
                              isClearable
                              className="exp-input-field"
                              placeholder=""
                              required
                              data-tip="Please select a payment type"
                              ref={Status}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleInsert();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 form-group  ">
                        <button
                          onClick={handleInsert}
                          class="mt-4"
                          required
                          title="Save"
                        >
                          <i class="fa-solid fa-floppy-disk"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
            <div
              className=" modal mt-5"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="modal-dialog  modal-xl ps-4 pe-4 p-1"
                role="document"
              >
                <div className="modal-content">
                  <div class=" ">
                    <div class="col-md-12 text-center">
                      <div class="mb-0 rounded-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start">
                          <h1 className="h1">Add Attribute Hdr</h1>
                        </div>
                        <div className="mb-0 d-flex justify-content-end ">
                          <button
                            onClick={handleClose}
                            className="closebtn2"
                            required
                            title="Close"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start"></div>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !attributeheader_code ? 'text-danger' : ''}`}>
                            Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="ahcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header code"
                            value={attributeheader_code}
                            onChange={(e) =>
                              setAttributeheader_Code(e.target.value)
                            }
                            maxLength={100}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !attributeheader_name ? 'text-danger' : ''}`}>
                            Name<span className="text-danger">*</span>
                          </label>
                          <input
                            id="ahname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header name"
                            value={attributeheader_name}
                            maxLength={250}
                            onChange={(e) =>
                              setAttributeheader_Name(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <label for="rid" className={`exp-form-labels ${error && !status ? 'text-danger' : ''}`}>
                            Status<span className="text-danger">*</span>
                          </label>
                          <Select
                            id="status"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            options={filteredOptionStatus}
                            className="exp-input-field"
                            isClearable
                            placeholder=""
                            required
                            data-tip="Please select a payment type"
                          />
                        </div>
                      </div>
                      <div class="col-md-3 form-group d-flex justify-content-end ">
                        <button
                          onClick={handleInsert}
                          class="mt-4"
                          required
                          title="Save"
                        >
                          <i class="fa-solid fa-floppy-disk"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
export default AttriHdrInput;
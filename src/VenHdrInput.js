import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function VenHdrInput({ open, handleClose }) {
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();
  const [vendor_code, setvendor_code] = useState("");
  const [vendor_name, setvendor_name] = useState("");
  const [status, setstatus] = useState("");
  // const [vendor_logo, setvendor_logo] = useState("");
  const [panno, setpanno] = useState("");
  const [vendor_gst_no, setvendor_gst_no] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const PanNo = useRef(null);
  const GSTNo = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const [vendorTypeDrop, setVendorTypeDrop] = useState([]);
  const [selectedVendorType, setselectedVendorType] = useState("");
  const [vendorType, setVendorType] = useState("");

  const VendorType = useRef(null);

  const clearInputFields = () => {
    setvendor_code("");
    setvendor_name("");
    setstatus("");
    setpanno("");
    setSelectedStatus("");
    setselectedVendorType("");
    setVendorType("");
  };

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
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/getVendorType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setVendorTypeDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionVendorType = vendorTypeDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };

  const handleChangeVendorType = (selectedVendorType) => {
    setselectedVendorType(selectedVendorType);
    setVendorType(selectedVendorType ? selectedVendorType.value : "");
  };


  const handleInsert = async () => {
    if (!vendor_code || !vendor_name || !status || !vendorType) {
      setError(true);
      toast.warning("Missing Required Fields");
      return;
    }
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addVendorHdrData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          vendor_code,
          vendor_name,
          status,
          panno,
          vendor_gst_no,
          vendor_type: vendorType,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.ok) {
        toast.success("Data inserted successfully!", {
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
    navigate("/AddVendorDetails"); // Pass selectedRows as props to the Input component
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
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  return (
    <div>
      {open && (
        <fieldset>
          <div className="purbut">
            {loading && <LoadingScreen />}
            <div className="purbut modal popupadj popup mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl p-3" role="document">
                <div className="modal-content">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between" >
                          <h1 align="left" className="purbut">Add Vendor Hdr</h1>
                          <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div className="d-flex justify-content-start">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="">
                      <div class="row p-4">
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="rid" className={`exp-form-labels ${error && !vendor_code ? 'text-danger' : ''}`}>
                              Vendor Code<span className="text-danger">*</span>
                            </label>
                            <input
                              id="vencode"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the vendor code"
                              value={vendor_code}
                              onChange={(e) => setvendor_code(e.target.value)}
                              maxLength={18}
                              ref={code}
                              onKeyDown={(e) => handleKeyDown(e, Name, code)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group">

                          <div class="exp-form-floating">
                            <label for="rid" className={`exp-form-labels ${error && !vendor_name ? 'text-danger' : ''}`}>
                              Vendor Name<span className="text-danger">*</span>
                            </label>
                            <input
                              id="venname"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the vendor name"
                              value={vendor_name}
                              onChange={(e) => setvendor_name(e.target.value)}
                              maxLength={250}
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
                            <Select
                              id="status"
                              value={selectedStatus}
                              onChange={handleChangeStatus}
                              options={filteredOptionStatus}
                              className="exp-input-field"
                              placeholder=""
                              ref={Status}
                              onKeyDown={(e) => handleKeyDown(e, PanNo, Status)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="panno" class="exp-form-labels">
                              PAN No
                            </label>
                            <input
                              id="panno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Pan number"
                              value={panno}
                              onChange={(e) => setpanno(e.target.value)}
                              maxLength={18}
                              ref={PanNo}
                              onKeyDown={(e) => handleKeyDown(e, GSTNo, PanNo)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3  form-group">
                          <div class="exp-form-floating">
                            <label for="vengstno" class="exp-form-labels">
                              GST No
                            </label>
                            <input
                              id="vengstno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the GST number"
                              value={vendor_gst_no}
                              onChange={(e) => setvendor_gst_no(e.target.value)}
                              maxLength={15}
                              ref={GSTNo}
                              // onKeyDown={(e) => handleKeyDown(e, Status)}
                              onKeyDown={(e) => handleKeyDown(e, VendorType, GSTNo)}
                            />

                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="ventrans" className={`exp-form-labels ${error && !vendorType ? 'text-danger' : ''}`}>
                              Vendor Type<span className="text-danger">*</span>
                            </label>
                            <div title="Select the Office Type ">
                              <Select
                                id="officeType"
                                value={selectedVendorType}
                                onChange={handleChangeVendorType}
                                options={filteredOptionVendorType}
                                className="exp-input-field"
                                placeholder=""
                                ref={VendorType}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleInsert();
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3 form-group  ">
                          <button onClick={handleInsert} class="mt-4" required title="Save"> <i class="fa-solid fa-floppy-disk"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
            <div className="modal modal  mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <div class="mb-0 rounded-0 d-flex justify-content-between">
                        <div className="mb-0 d-flex justify-content-start">
                          <h1 className="h1">Add Vendor Hdr</h1>
                        </div>
                        <div className="mb-0 d-flex justify-content-end ">
                          <button onClick={handleClose} className="closebtn2" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                        </div>
                      </div>
                    </div>
                    <div class="">
                      <div class="row p-4">
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="rid" className={`exp-form-labels ${error && !vendor_code ? 'text-danger' : ''}`}>
                              Vendor Code<span className="text-danger">*</span>
                            </label>
                            <input
                              id="vencode"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the vendor code"
                              value={vendor_code}
                              onChange={(e) => setvendor_code(e.target.value)}
                              maxLength={18}
                            />

                          </div>
                        </div>
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="rid" className={`exp-form-labels ${error && !vendor_name ? 'text-danger' : ''}`}>
                              Vendor Name<span className="text-danger">*</span>
                            </label>
                            <input
                              id="venname"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the vendor name"
                              value={vendor_name}
                              onChange={(e) => setvendor_name(e.target.value)}
                              maxLength={250}
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
                                className="exp-input-field"
                                placeholder=""
                              />
                            </div>
                          </div>  </div>
                        <div className="col-md-3 form-group">
                          <div class="exp-form-floating">
                            <label for="panno" class="exp-form-labels">
                              Pan No
                            </label>
                            <input
                              id="panno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the Pan number"
                              value={panno}
                              onChange={(e) => setpanno(e.target.value)}
                              maxLength={18}
                            />
                          </div>
                        </div>
                        <div className="col-md-3  form-group">
                          <div class="exp-form-floating">
                            <label for="vengstno" class="exp-form-labels">
                              GST No
                            </label>
                            <input
                              id="vengstno"
                              class="exp-input-field form-control"
                              type="text"
                              placeholder=""
                              required title="Please enter the GST number"
                              value={vendor_gst_no}
                              onChange={(e) => setvendor_gst_no(e.target.value)}
                              maxLength={15}
                            />

                          </div>
                        </div>
                        <div className="col-md-3 form-group mb-2">
                          <div class="exp-form-floating">
                            <label for="ventrans" className={`exp-form-labels ${error && !vendorType ? 'text-danger' : ''}`}>
                              Vendor Type<span className="text-danger">*</span>
                            </label>
                            <div title="Select the Vendor Type ">
                              <Select
                                id="officeType"
                                value={selectedVendorType}
                                onChange={handleChangeVendorType}
                                options={filteredOptionVendorType}
                                className="exp-input-field"
                                placeholder=""
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3 form-group d-flex justify-content-end">
                          <button onClick={handleInsert} class="mt-4" required title="Save"> <i class="fa-solid fa-floppy-disk"></i></button>
                        </div>
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
export default VenHdrInput; 
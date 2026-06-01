import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';

const AddAddSiteMasterScreen = () => {

    const location = useLocation();
    const { mode, selectedRow } = location.state || {};
    const navigate = useNavigate();
    const config = require("./Apiconfig");
    const [loading, setLoading] = useState(false);
    const [siteId, setSiteId] = useState('');
    const [siteName, setSiteName] = useState('');
    const [siteLocation, setSiteLocation] = useState('');
    const [customerCodeDrop, setCustomerCodeDrop] = useState([]);
    const [customerCode, setCustomerCode] = useState('');
    const [selectedCustomerCode, setSelectedCustomerCode] = useState('');
    const [projectTypeDrop, setProjectTypeDrop] = useState([]);
    const [projectType, setProjectType] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [siteStatusDrop, setSiteStatusDrop] = useState([]);
    const [siteStatus, setSiteStatus] = useState('');
    const [selectedSiteStatus, setSelectedSiteStatus] = useState('');
    const [statusDrop, setStatusDrop] = useState([]);
    const [status, setStatus] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [remarks, setRemarks] = useState('');
    const [toleranceTypeDrop, setToleranceTypeDrop] = useState([]);
    const [toleranceType, setToleranceType] = useState('');
    const [selectedToleranceType, setSelectedToleranceType] = useState('');
    const [toleranceValues, setToleranceValues] = useState('');
    const [warehouseDrop, setWarehouseDrop] = useState([]);
    const [warehouse, setWarehouse] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [error, setError] = useState(false);
    const [keyfield, setKeyfield] = useState("");

    const clearInputFields = () => {
        setSiteId("");
        setSiteName("");
        setSiteLocation("");
        setCustomerCode("");
        setSelectedCustomerCode("");
        setProjectType("");
        setSelectedProjectType("");
        setStartDate("");
        setEndDate("");
        setSiteStatus("");
        setSelectedSiteStatus("");
        setStatus("");
        setSelectedStatus("");
        setTotalBudget("");
        setRemarks("");
        setToleranceType("");
        setSelectedToleranceType("");
        setToleranceValues("");
        setWarehouse("");
        setSelectedWarehouse("");
        setKeyfield("");
    };

    const formatDate = (date) => {
        if (!date) return "";
        date = date.replace(/\//g, "-");
        const d = new Date(date);
        return !isNaN(d) ? d.toISOString().split("T")[0] : "";
    };

    useEffect(() => {
        if (mode === "update" && selectedRow) {
            setSiteId(selectedRow.site_id || "");
            setSiteName(selectedRow.site_name || "");
            setSiteLocation(selectedRow.site_location || "");
            setSelectedCustomerCode({
                label: selectedRow.client_code,
                value: selectedRow.client_code,
            });
            setCustomerCode(selectedRow.client_code || "");
            setSelectedProjectType({
                label: selectedRow.project_type,
                value: selectedRow.project_type,
            });
            setProjectType(selectedRow.project_type || "");
            setStartDate(selectedRow.start_date || "");
            setEndDate(selectedRow.end_date || "");
            setSelectedSiteStatus({
                label: selectedRow.site_status,
                value: selectedRow.site_status,
            });
            setSiteStatus(selectedRow.site_status || "");
            setSelectedStatus({
                label: selectedRow.status,
                value: selectedRow.status,
            });
            setStatus(selectedRow.status || "");
            setTotalBudget(selectedRow.total_budget || "");
            setSelectedToleranceType({
                label: selectedRow.Tolerance_Type,
                value: selectedRow.Tolerance_Type,
            });
            setToleranceType(selectedRow.Tolerance_Type || "");
            setToleranceValues(selectedRow.Tolerance_values || 0);
            setSelectedWarehouse({
                label: selectedRow.Warehouses,
                value: selectedRow.Warehouses,
            });
            setWarehouse(selectedRow.Warehouses || "");
            setKeyfield(selectedRow.keyfield || "");

        } else if (mode === "create") {
            clearInputFields();
        }
    }, [mode, selectedRow]);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/customercode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setCustomerCodeDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getProjectType`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setProjectTypeDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getSiteStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => {

                setSiteStatusDrop(val);

                const defaultOption = val.find(
                    (option) => option.attributedetails_name === "Running"
                );

                if (defaultOption) {
                    const formattedOption = {
                        value: defaultOption.attributedetails_name,
                        label: defaultOption.attributedetails_name,
                    };

                    setSelectedSiteStatus(formattedOption);
                    setSiteStatus(formattedOption.value);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));

    }, []);

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
            .then((val) => {

                setStatusDrop(val);

                const defaultOption = val.find(
                    (option) => option.attributedetails_name === "Active"
                );

                if (defaultOption) {
                    const formattedOption = {
                        value: defaultOption.attributedetails_name,
                        label: defaultOption.attributedetails_name,
                    };

                    setSelectedStatus(formattedOption);
                    setStatus(formattedOption.value);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));

    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getToleranceType`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setToleranceTypeDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getWarehouseCodeDrop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setWarehouseDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionCustomer = Array.isArray(customerCodeDrop)
        ? customerCodeDrop.map((option) => ({
            value: option.customer_code,
            label: `${option.customer_code} - ${option.customer_name}`,
        }))
        : [];

    const filteredOptionProjectType = Array.isArray(projectTypeDrop)
        ? projectTypeDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionSiteStatus = Array.isArray(siteStatusDrop)
        ? siteStatusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionStatus = Array.isArray(statusDrop)
        ? statusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionToleranceType = Array.isArray(toleranceTypeDrop)
        ? toleranceTypeDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionWarehouse = Array.isArray(warehouseDrop)
        ? warehouseDrop.map((option) => ({
            value: option.warehouse_code,
            label: `${option.warehouse_code} - ${option.warehouse_name}`,
        }))
        : [];

    const handleChangeCustomerCode = (selectedCustomerCode) => {
        setSelectedCustomerCode(selectedCustomerCode);
        setCustomerCode(selectedCustomerCode ? selectedCustomerCode.value : "");
    };

    const handleChangeProjectType = (selectedProjectType) => {
        setSelectedProjectType(selectedProjectType);
        setProjectType(selectedProjectType ? selectedProjectType.value : "");
    };

    const handleChangeSiteStatus = (selectedSiteStatus) => {
        setSelectedSiteStatus(selectedSiteStatus);
        setSiteStatus(selectedSiteStatus ? selectedSiteStatus.value : "");
    };

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    const handleChangeToleranceType = (selectedToleranceType) => {
        setSelectedToleranceType(selectedToleranceType);
        setToleranceType(selectedToleranceType ? selectedToleranceType.value : "");
    };

    const handleChangeSiteWarehouse = (selectedWarehouse) => {
        setSelectedWarehouse(selectedWarehouse);
        setWarehouse(selectedWarehouse ? selectedWarehouse.value : "");
    };

    const handleInsert = async () => {
        if (!siteId || !siteName || !siteStatus || !status) {
            setError(true);
            toast.warning("Missing Required Fields");
            return;
        }

        if (startDate && endDate) {

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                toast.warning("End Date should be greater than or equal to Start Date");
                return;
            }
        }

        setError(false);
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/SiteMasterInsert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    site_id: siteId,
                    site_name: siteName,
                    site_location: siteLocation,
                    client_code: customerCode,
                    project_type: projectType,
                    start_date: startDate ? startDate : null,
                    end_date: endDate ? endDate : null,
                    site_status: siteStatus,
                    total_budget: totalBudget,
                    status: status,
                    Warehouses: warehouse,
                    Tolerance_Type: toleranceType,
                    Tolerance_values: toleranceValues ? toleranceValues : 0,
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
        }
        finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!siteId || !siteName || !siteStatus || !status) {
            setError(true);
            toast.warning("Missing Required Fields");
            return;
        }

        if (startDate && endDate) {

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                toast.warning("End Date should be greater than or equal to Start Date");
                return;
            }
        }

        setError(false);
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/SiteMasterUpdate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    site_id: siteId,
                    site_name: siteName,
                    site_location: siteLocation,
                    client_code: customerCode,
                    project_type: projectType,
                    start_date: startDate ? startDate : null,
                    end_date: endDate ? endDate : null,
                    site_status: siteStatus,
                    total_budget: totalBudget,
                    status: status,
                    Warehouses: warehouse,
                    Tolerance_Type: toleranceType,
                    Tolerance_values: toleranceValues ? toleranceValues : 0,
                    keyfield: keyfield,
                    modified_by: sessionStorage.getItem('selectedUserCode')
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
        }
        finally {
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        navigate("/SiteMaster   ");
    };

    // Total Budget
    const handleTotalBudgetChange = (e) => {
        const value = e.target.value;

        // 14 digits + 2 decimals + positive only
        if (/^\d{0,14}(\.\d{0,2})?$/.test(value)) {
            setTotalBudget(value);
        }
    };

    // Tolerance Value
    const handleToleranceValueChange = (e) => {
        const value = e.target.value;

        // Numeric + positive only
        if (/^\d{0,10}(\.\d{0,2})?$/.test(value)) {
            setToleranceValues(value);
        }
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            {/* HEADER */}
            <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between" >
                    <h1 align="left" class="purbut">{mode === 'update' ? 'Update Site Master' : 'Add Site Master'}</h1>
                    <h1 align="left" class="fs-4 mobileview">{mode === 'update' ? 'Update Site Master' : 'Add Site Master'}</h1>

                    <button onClick={handleNavigate} className="btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            {/* FORM */}
            <div class="pt-2 mb-4">
                <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">

                    <div class="row">
                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className={`exp-form-labels ${error && !siteId ? 'text-danger' : ''}`}>
                                    Site ID<span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    title="Enter Site ID"
                                    className="exp-input-field form-control"
                                    value={siteId}
                                    readOnly={mode === "update"}
                                    onChange={(e) => setSiteId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className={`exp-form-labels ${error && !siteName ? 'text-danger' : ''}`}>
                                    Site Name<span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    title="Enter Site Name"
                                    className="exp-input-field form-control"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Site Location
                                </label>
                                <input
                                    className="form-control"
                                    title="Enter Site Location"
                                    className="exp-input-field form-control"
                                    value={siteLocation}
                                    onChange={(e) => setSiteLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating" title="Select Customer Code">
                                <label className="exp-form-labels">
                                    Customer Code
                                </label>
                                <Select
                                    value={selectedCustomerCode}
                                    isClearable
                                    options={filteredOptionCustomer}
                                    className="exp-input-field"
                                    onChange={handleChangeCustomerCode}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating" title="Select Project Type">
                                <label className="exp-form-labels">
                                    Project Type
                                </label>
                                <Select
                                    value={selectedProjectType}
                                    isClearable
                                    options={filteredOptionProjectType}
                                    className="exp-input-field"
                                    onChange={handleChangeProjectType}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    title="Select Start Date"
                                    className="form-control"
                                    className="exp-input-field form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    title="Select End Date"
                                    className="form-control"
                                    className="exp-input-field form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating" title="Select Site Status">
                                <label className={`exp-form-labels ${error && !siteStatus ? 'text-danger' : ''}`}>
                                    Site Status<span className="text-danger">*</span>
                                </label>
                                <Select
                                    value={selectedSiteStatus}
                                    isClearable
                                    options={filteredOptionSiteStatus}
                                    className="exp-input-field"
                                    onChange={handleChangeSiteStatus}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Total Budget
                                </label>
                                <input
                                    className="form-control"
                                    title="Enter Total Budget"
                                    className="exp-input-field form-control"
                                    value={totalBudget}
                                    onChange={handleTotalBudgetChange}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating" title="Select Tolerance Type">
                                <label className="exp-form-labels">
                                    Tolerance Type
                                </label>
                                <Select
                                    value={selectedToleranceType}
                                    isClearable
                                    options={filteredOptionToleranceType}
                                    className="exp-input-field"
                                    onChange={handleChangeToleranceType}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Tolerance Values
                                </label>
                                <input
                                    className="form-control"
                                    title="Enter Tolerance Values"
                                    className="exp-input-field form-control"
                                    value={toleranceValues}
                                    onChange={handleToleranceValueChange}
                                />
                            </div>
                        </div>

                        {/* <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Warehouse
                                </label>
                                <Select
                                    value={selectedWarehouse}
                                    options={filteredOptionWarehouse}
                                    placeholder="Select Warehouse"
                                    className="exp-input-field"
                                    onChange={handleChangeSiteWarehouse}
                                />
                            </div>
                        </div> */}

                        <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating" title="Select Status">
                                <label className={`exp-form-labels ${error && !status ? 'text-danger' : ''}`}>
                                    Status<span className="text-danger">*</span>
                                </label>
                                <Select
                                    value={selectedStatus}
                                    isClearable
                                    options={filteredOptionStatus}
                                    className="exp-input-field"
                                    onChange={handleChangeStatus}
                                />
                            </div>
                        </div>

                        {/* <div className="col-md-3 form-group mb-2">
                            <div className="exp-form-floating">
                                <label className="exp-form-labels">
                                    Remarks / Notes
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder="Enter Remarks/Notes"
                                    className="exp-input-field form-control"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                        </div> */}

                        <div class="col-md-3 form-group d-flex justify-content-start mb-4">
                            {mode === "create" ? (
                                <button className="mt-4" title="Save" onClick={handleInsert}>
                                    <i class="fa-solid fa-floppy-disk"></i>
                                </button>
                            ) : (
                                <button className="mt-4" title="Update" onClick={handleUpdate}>
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AddAddSiteMasterScreen;
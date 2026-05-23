import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
import LoadingScreen from "./Loading";
import { useNavigate } from "react-router-dom";

const AddSiteMasterScreen = () => {

    const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
    const SiteMasterPermission = permissions
        .filter((permission) => permission.screen_type === "SiteMaster")
        .map((permission) => permission.permission_type.toLowerCase());

    const config = require("./Apiconfig");
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
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

    const [customerCodeDropGrid, setCustomerCodeDropGrid] = useState([]);
    const [projectTypeDropGrid, setProjectTypeDropGrid] = useState([]);
    const [siteStatusDropGrid, setSiteStatusDropGrid] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [toleranceTypeDropGrid, setToleranceTypeDropGrid] = useState([]);
    const [warehouseDropGrid, setWarehouseDropGrid] = useState([]);

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
            .then((val) => setSiteStatusDrop(val))
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
            .then((val) => setStatusDrop(val))
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

    const filteredOptionCustomer = customerCodeDrop.map((option) => ({
        value: option.customer_code,
        label: `${option.customer_code} - ${option.customer_name}`,
    }));

    const filteredOptionProjectType = projectTypeDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionSiteStatus = siteStatusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionToleranceType = toleranceTypeDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionWarehouse = warehouseDrop.map((option) => ({
        value: option.warehouse_code,
        label: `${option.warehouse_code} - ${option.warehouse_name}`,
    }));

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

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/customercode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const customerCode = data.map((option) => option.customer_code);
                setCustomerCodeDropGrid(customerCode);
            })
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
            .then((response) => response.json())
            .then((data) => {
                const projectType = data.map((option) => option.attributedetails_name);
                setProjectTypeDropGrid(projectType);
            })
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
            .then((response) => response.json())
            .then((data) => {
                const siteStatus = data.map((option) => option.attributedetails_name);
                setSiteStatusDropGrid(siteStatus);
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
            .then((response) => response.json())
            .then((data) => {
                const status = data.map((option) => option.attributedetails_name);
                setStatusDropGrid(status);
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
            .then((response) => response.json())
            .then((data) => {
                const toleranceType = data.map((option) => option.attributedetails_name);
                setToleranceTypeDropGrid(toleranceType);
            })
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
            .then((response) => response.json())
            .then((data) => {
                const warehouse = data.map((option) => option.warehouse_code);
                setWarehouseDropGrid(warehouse);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const columnDefs = [
        {
            headerName: "Site ID",
            field: "SiteID"
        },
        {
            headerName: "Site Name",
            field: "SiteName",
        },
        {
            headerName: "Site Location",
            field: "SiteLocation",
        },
        {
            headerName: "Customer Code",
            field: "CustomerCode",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: customerCodeDropGrid,
            },
        },
        {
            headerName: "Project Type",
            field: "ProjectType",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: projectTypeDropGrid,
            },
        },
        {
            headerName: "Start Date",
            field: "StartDate",
        },
        {
            headerName: "End Date",
            field: "EndDate",
        },
        {
            headerName: "Site Status",
            field: "SiteStatus",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: siteStatusDropGrid,
            },
        },
        {
            headerName: "Total Budget",
            field: "TotalBudget",
        },
        {
            headerName: "Remarks / Notes",
            field: "Remarks/Notes",
        },
        {
            headerName: "Tolerance Type",
            field: "ToleranceType",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: toleranceTypeDropGrid,
            },
        },
        {
            headerName: "Tolerance Values",
            field: "ToleranceValues",
        },
        {
            headerName: "Warehouse",
            field: "Warehouse",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: warehouseDropGrid,
            },
        },
        {
            headerName: "Status",
            field: "Status",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
    ];

    const handleNavigate = () => {
        navigate("/AddSiteMaster", { state: { mode: "create" } });
    };

    return (
        <div className="container-fluid Topnav-screen">

            <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">

                <div className=" d-flex justify-content-between  ">
                    <div class="d-flex justify-content-start">
                        <h1 align="left" className="purbut me-5">
                            Site Master
                        </h1>
                    </div>

                    <div className="d-flex justify-content-end purbut me-3">
                        {["add", "all permission"].some((permission) =>
                            SiteMasterPermission.includes(permission),
                        ) && (
                                <addbutton
                                    className=""
                                    required
                                    title="Add Site Master"
                                    onClick={handleNavigate}
                                >
                                    <i class="fa-solid fa-user-plus"></i>
                                </addbutton>
                            )}
                        {["delete", "all permission"].some((permission) =>
                            SiteMasterPermission.includes(permission),
                        ) && (
                                <delbutton
                                    className="purbut"
                                    required
                                    title="Delete"
                                >
                                    <i class="fa-solid fa-user-minus"></i>
                                </delbutton>
                            )}
                        {["update", "all permission"].some((permission) =>
                            SiteMasterPermission.includes(permission),
                        ) && (
                                <savebutton
                                    className="purbut"
                                    required
                                    title="Update"
                                >
                                    <i class="fa-solid fa-floppy-disk"></i>
                                </savebutton>
                            )}
                        {["all permission", "view"].some((permission) =>
                            SiteMasterPermission.includes(permission),
                        ) && (
                                <printbutton
                                    class="purbut"
                                    required
                                    title="Generate Report"
                                >
                                    <i class="fa-solid fa-print"></i>
                                </printbutton>
                            )}
                    </div>

                    <div class="mobileview">
                        <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                                <h1 align="left" className="h1">
                                    Site Master
                                </h1>
                            </div>

                            <div class="dropdown mt-1 me-5">
                                <button
                                    class="btn btn-primary dropdown-toggle p-1"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i class="fa-solid fa-list"></i>
                                </button>

                                <ul class="dropdown-menu menu">
                                    <li class="iconbutton d-flex justify-content-center text-success">
                                        {["add", "all permission"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon">
                                                    <i class="fa-solid fa-user-plus"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center text-danger">
                                        {["delete", "all permission"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon">
                                                    <i class="fa-solid fa-user-minus"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                                        {["update", "all permission"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon" >
                                                    <i class="fa-solid fa-floppy-disk"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center ">
                                        {["all permission", "view"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon">
                                                    <i class="fa-solid fa-print"></i>
                                                </icon>
                                            )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
                <div className="row ms-4 mb-3 mt-3 me-4">
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Site ID
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter SiteID"
                                className="exp-input-field form-control"
                                value={siteId}
                                onChange={(e) => setSiteId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Site Name
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter SiteName"
                                className="exp-input-field form-control"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Site Location
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter SiteLocation"
                                className="exp-input-field form-control"
                                value={siteLocation}
                                onChange={(e) => setSiteLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Customer Code
                            </label>
                            <Select
                                value={selectedCustomerCode}
                                options={filteredOptionCustomer}
                                placeholder="Select CustomerCode"
                                className="exp-input-field"
                                onChange={handleChangeCustomerCode}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Project Type
                            </label>
                            <Select
                                value={selectedProjectType}
                                options={filteredOptionProjectType}
                                placeholder="Select ProjectType"
                                className="exp-input-field"
                                onChange={handleChangeProjectType}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                className="exp-input-field form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                className="exp-input-field form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Site Status
                            </label>
                            <Select
                                value={selectedSiteStatus}
                                options={filteredOptionSiteStatus}
                                placeholder="Select SiteStatus"
                                className="exp-input-field"
                                onChange={handleChangeSiteStatus}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Total Budget
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter TotalBudget"
                                className="exp-input-field form-control"
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Remarks / Notes
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter Remarks/Notes"
                                className="exp-input-field form-control"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div> */}

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Tolerance Type
                            </label>
                            <Select
                                value={selectedToleranceType}
                                options={filteredOptionToleranceType}
                                placeholder="Select ToleranceType"
                                className="exp-input-field"
                                onChange={handleChangeToleranceType}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Tolerance Values
                            </label>
                            <input
                                className="form-control"
                                placeholder="Enter ToleranceValues"
                                className="exp-input-field form-control"
                                value={toleranceValues}
                                onChange={(e) => setToleranceValues(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
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
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
                                Status
                            </label>
                            <Select
                                value={selectedStatus}
                                options={filteredOptionStatus}
                                placeholder="Select SiteStatus"
                                className="exp-input-field"
                                onChange={handleChangeStatus}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mt-4">
                        <div class="exp-form-floating">
                            <div class=" d-flex  justify-content-center">
                                <div class="">
                                    <icon
                                        className="popups-btn fs-6 p-3"
                                        required
                                        title="Search"
                                    >
                                        <i className="fas fa-search"></i>
                                    </icon>
                                </div>
                                <div>
                                    <icon
                                        className="popups-btn fs-6 p-3"
                                        required
                                        title="Refresh"
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                                    </icon>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="ag-theme-alpine mb-2" style={{ height: 300, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddSiteMasterScreen;
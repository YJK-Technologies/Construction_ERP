import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';


const SiteWarehouseMappingScreen = () => {

    const config = require("./Apiconfig");
    const [rowData, setRowData] = useState([]);
    const [siteIdDrop, setSiteIdDrop] = useState([]);
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [siteId, setSiteId] = useState("");
    const [warehouseCodeDrop, setWarehouseCodeDrop] = useState([]);
    const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
    const [warehouseCode, setWarehouseCode] = useState("");
    const [statusDrop, setStatusDrop] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [status, setStatus] = useState("");
    const [isPrimaryDrop, setIsPrimaryDrop] = useState([]);
    const [selectedIsPrimary, setSelectedIsPrimary] = useState("");
    const [isPrimary, setIsPrimary] = useState("");
    const [remarks, setRemarks] = useState("");
    const [error, setError] = useState(false);

    const [siteIdDropSc, setSiteIdDropSc] = useState([]);
    const [selectedSiteIdSc, setSelectedSiteIdSc] = useState("");
    const [siteIdSc, setSiteIdSc] = useState("");
    const [warehouseCodeDropSc, setWarehouseCodeDropSc] = useState([]);
    const [selectedWarehouseCodeSc, setSelectedWarehouseCodeSc] = useState("");
    const [warehouseCodeSc, setWarehouseCodeSc] = useState("");
    const [statusDropSc, setStatusDropSc] = useState([]);
    const [selectedStatusSc, setSelectedStatusSc] = useState("");
    const [statusSc, setStatusSc] = useState("");
    const [isPrimaryDropSc, setIsPrimaryDropSc] = useState([]);
    const [selectedIsPrimarySc, setSelectedIsPrimarySc] = useState("");
    const [isPrimarySc, setIsPrimarySc] = useState("");
    const [remarksSc, setRemarksSc] = useState("");

    const addClearInputFields = () => {
        setSelectedSiteId("");
        setSiteId("");
        setSelectedWarehouseCode("");
        setWarehouseCode("");
        setSelectedStatus("");
        setStatus("");
        setSelectedIsPrimary("");
        setIsPrimary("");
        setRemarks("");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getSiteMaster`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setSiteIdDrop(val))
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

        fetch(`${config.apiBaseUrl}/getboolean`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setIsPrimaryDrop(val))
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
            .then((val) => setWarehouseCodeDrop(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionSiteId = siteIdDrop.map((option) => ({
        value: option.site_id,
        label: `${option.site_id} - ${option.site_name}`,
    }));

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionPrimary = isPrimaryDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionWarehouseCode = warehouseCodeDrop.map((option) => ({
        value: option.warehouse_code,
        label: `${option.warehouse_code} - ${option.warehouse_name}`,
    }));

    const handleChangeSiteId = (selectedSiteId) => {
        setSelectedSiteId(selectedSiteId);
        setSiteId(selectedSiteId ? selectedSiteId.value : "");
    };

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    const handleChangePrimary = (selectedIsPrimary) => {
        setSelectedIsPrimary(selectedIsPrimary);
        setIsPrimary(selectedIsPrimary ? selectedIsPrimary.value : "");
    };

    const handleChangeWarehouseCode = (selectedWarehouseCode) => {
        setSelectedWarehouseCode(selectedWarehouseCode);
        setWarehouseCode(selectedWarehouseCode ? selectedWarehouseCode.value : "");
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getSiteMaster`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setSiteIdDropSc(val))
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
            .then((val) => setStatusDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getboolean`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((data) => data.json())
            .then((val) => setIsPrimaryDropSc(val))
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
            .then((val) => setWarehouseCodeDropSc(val))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredOptionSiteIdSc = siteIdDropSc.map((option) => ({
        value: option.site_id,
        label: `${option.site_id} - ${option.site_name}`,
    }));

    const filteredOptionStatusSc = statusDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionPrimarySc = isPrimaryDropSc.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionWarehouseCodeSc = warehouseCodeDropSc.map((option) => ({
        value: option.warehouse_code,
        label: `${option.warehouse_code} - ${option.warehouse_name}`,
    }));

    const handleChangeSiteIdSc = (selectedSiteIdSc) => {
        setSelectedSiteIdSc(selectedSiteIdSc);
        setSiteIdSc(selectedSiteIdSc ? selectedSiteIdSc.value : "");
    };

    const handleChangeStatusSc = (selectedStatusSc) => {
        setSelectedStatusSc(selectedStatusSc);
        setStatusSc(selectedStatusSc ? selectedStatusSc.value : "");
    };

    const handleChangePrimarySc = (selectedIsPrimarySc) => {
        setSelectedIsPrimarySc(selectedIsPrimarySc);
        setStatusSc(selectedIsPrimarySc ? selectedIsPrimarySc.value : "");
    };

    const handleChangeWarehouseCodeSc = (selectedWarehouseCodeSc) => {
        setSelectedWarehouseCodeSc(selectedWarehouseCodeSc);
        setIsPrimarySc(selectedWarehouseCodeSc ? selectedWarehouseCodeSc.value : "");
    };

    const columnDefs = [
        {
            headerName: "S.No.",
            valueGetter: "node.rowIndex + 1",
            width: 90,
            pinned: "left"
        },
        {
            headerName: "Actions",
            field: "actions",
            width: 140,
            pinned: "left",
            cellRenderer: (params) => {

                const cellWidth =
                    params.column.getActualWidth();

                const isWideEnough =
                    cellWidth > 20;

                const showIcons =
                    isWideEnough;

                return (
                    <div
                        className="position-relative d-flex align-items-center"
                        style={{
                            minHeight: "100%",
                            justifyContent: "center"
                        }}
                    >

                        {showIcons && (
                            <>

                                <span
                                    className="icon mx-2"
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </span>

                            </>
                        )}

                    </div>
                );
            }
        },
        { headerName: "SiteID", field: "SiteID", flex: 1 },
        { headerName: "WarehouseCode", field: "WarehouseCode", flex: 1 },
        { headerName: "Status", field: "Status", flex: 1 },
        { headerName: "IsPrimary", field: "IsPrimary", flex: 1 },
        { headerName: "Remarks", field: "Remarks", flex: 1 }
    ];

    const handleSave = async () => {
        if (!siteId || !warehouseCode || !status || !isPrimary) {
            setError(true);
            toast.warning("Error: Missing required fields");
            return;
        }

        try {

            const Header = {
                site_id: siteId,
                warehouse_code: warehouseCode,
                remarks: remarks,
                status: status,
                Is_Primary: isPrimary,
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                created_by: sessionStorage.getItem('selectedUserCode')
            };

            const response = await fetch(`${config.apiBaseUrl}/SiteWarehouseMappingInsert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Header),
            });
            if (response.status === 200) {
                console.log("Data inserted successfully");
                toast.success("Data inserted successfully!", {
                    onClose: () => addClearInputFields(),
                });
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            toast.error('Error inserting data: ' + error.message);
        }
    };


    return (
        <div className="container-fluid Topnav-screen">

            <div className="shadow-lg p-0 bg-white rounded">
                <div className="purbut mb-0 d-flex justify-content-between" >
                    <h1 align="left" class="purbut">Site Warehouse Mapping</h1>
                    <div className="col-md-1 mt-3 me-5 purbut">
                        <div class=" d-flex justify-content-end  me-3">
                            <div >
                            </div>
                            <div className="me-1 ">
                                <savebutton required title="save" onClick= {handleSave}>
                                    <i class="fa-regular fa-floppy-disk"></i>
                                </savebutton>
                            </div>
                            <div className="ms-1">
                            </div>
                            <div className="col-md-1">
                                <div className="ms-1">
                                    <reloadbutton className="purbut" title="Reload" style={{ cursor: "pointer" }}>
                                        <i className="fa-solid fa-arrow-rotate-right"></i>
                                    </reloadbutton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADD FORM */}
            <div class="mt-2">
                <div className="shadow-lg p-3 bg-white rounded mb-2">

                    <div className="row g-3">

                        <div className="col-md-3 form-group mb-2">
                            <div class="exp-form-floating">
                                <label className="exp-form-labels">
                                    Site ID<span className="text-danger">*</span>
                                </label>

                                <Select
                                    value={selectedSiteId}
                                    options={filteredOptionSiteId}
                                    placeholder="Select Site ID"
                                    className="exp-input-field"
                                    onChange={handleChangeSiteId}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div class="exp-form-floating">
                                <label className={`exp-form-labels ${error && !warehouseCode ? 'text-danger' : ''}`}>
                                    Warehouse Code<span className="text-danger">*</span>
                                </label>

                                <Select
                                    value={selectedWarehouseCode}
                                    options={filteredOptionWarehouseCode}
                                    placeholder="Select Warehouse Code"
                                    className="exp-input-field"
                                    onChange={handleChangeWarehouseCode}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div class="exp-form-floating">
                                <label className={`exp-form-labels ${error && !status ? 'text-danger' : ''}`}>
                                    Status<span className="text-danger">*</span>
                                </label>

                                <Select
                                    value={selectedStatus}
                                    options={filteredOptionStatus}
                                    placeholder="Select Status"
                                    className="exp-input-field"
                                    onChange={handleChangeStatus}
                                />
                            </div>
                        </div>

                        <div className="col-md-3 form-group mb-2">
                            <div class="exp-form-floating">
                                <label className={`exp-form-labels ${error && !isPrimary ? 'text-danger' : ''}`}>
                                    Is Primary<span className="text-danger">*</span>
                                </label>

                                <Select
                                    value={selectedIsPrimary}
                                    options={filteredOptionPrimary}
                                    placeholder="Select Is Primary"
                                    className="exp-input-field"
                                    onChange={handleChangePrimary}
                                />
                            </div>
                        </div>

                        <div className="col-md-6 form-group mb-2">
                            <div class="exp-form-floating">
                                <label className="exp-form-labels">
                                    Remarks
                                </label>

                                <textarea
                                    placeholder="Enter Remarks"
                                    className="exp-input-field form-control"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SEARCH */}
            <div className="shadow-lg bg-light rounded mb-2">
                <div className="p-3" style={{ width: "150px" }}>
                    <h6 className="">Search Criteria:</h6>
                </div>

                <div class="row ms-2 me-2">

                    <div className="col-md-3">
                        <label className="exp-form-labels">
                            Site ID
                        </label>

                        <Select
                            value={selectedSiteIdSc}
                            options={filteredOptionSiteIdSc}
                            placeholder="Select Site ID"
                            className="exp-input-field"
                            onChange={handleChangeSiteIdSc}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="exp-form-labels">
                            Warehouse Code
                        </label>

                        <Select
                            value={selectedWarehouseCodeSc}
                            options={filteredOptionWarehouseCodeSc}
                            placeholder="Select Warehouse Code"
                            className="exp-input-field"
                            onChange={handleChangeWarehouseCodeSc}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="exp-form-labels">
                            Status
                        </label>

                        <Select
                            value={selectedStatusSc}
                            options={filteredOptionStatusSc}
                            placeholder="Select Status"
                            className="exp-input-field"
                            onChange={handleChangeStatusSc}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="exp-form-labels">
                            Is Primary
                        </label>

                        <Select
                            value={selectedIsPrimarySc}
                            options={filteredOptionPrimarySc}
                            placeholder="Select Is Primary"
                            className="exp-input-field"
                            onChange={handleChangePrimarySc}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="exp-form-labels">
                            Remarks
                        </label>

                        <input
                            className="form-control"
                            placeholder="Enter Remarks"
                            value={remarksSc}
                            onChange={(e) => setRemarksSc(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 d-flex align-items-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                        >
                            <i className="bi bi-search"></i>
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-success"
                        >
                            <i className="bi bi-file-earmark-excel"></i>
                        </button>
                    </div>

                    <div
                        className="ag-theme-alpine mt-2 mb-2"
                        style={{
                            height: 300,
                            width: "100%"
                        }}
                    >
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            paginationAutoPageSize={true}
                            pagination={true}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
};

export default SiteWarehouseMappingScreen;
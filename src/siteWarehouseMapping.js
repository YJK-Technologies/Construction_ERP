import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';
import { showConfirmationToast } from './ToastConfirmation';

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

    const [siteIdDropGrid, setSiteIdDropGrid] = useState([]);
    const [warehouseCodeDropGrid, setWarehouseCodeDropGrid] = useState([]);
    const [statusDropGrid, setStatusDropGrid] = useState([]);
    const [isPrimaryDropGrid, setIsPrimaryDropGrid] = useState([]);

    const [loading, setLoading] = useState(false);

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

    const filteredOptionSiteId = Array.isArray(siteIdDrop)
        ? siteIdDrop.map((option) => ({
            value: option.site_id,
            label: `${option.site_id} - ${option.site_name}`,
        }))
        : [];

    const filteredOptionStatus = Array.isArray(statusDrop)
        ? statusDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionPrimary = Array.isArray(isPrimaryDrop)
        ? isPrimaryDrop.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionWarehouseCode = Array.isArray(warehouseCodeDrop)
        ? warehouseCodeDrop.map((option) => ({
            value: option.warehouse_code,
            label: `${option.warehouse_code} - ${option.warehouse_name}`,
        }))
        : [];

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

    const filteredOptionSiteIdSc = Array.isArray(siteIdDropSc)
        ? siteIdDropSc.map((option) => ({
            value: option.site_id,
            label: `${option.site_id} - ${option.site_name}`,
        }))
        : [];

    const filteredOptionStatusSc = Array.isArray(statusDropSc)
        ? statusDropSc.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionPrimarySc = Array.isArray(isPrimaryDropSc)
        ? isPrimaryDropSc.map((option) => ({
            value: option.attributedetails_name,
            label: option.attributedetails_name,
        }))
        : [];

    const filteredOptionWarehouseCodeSc = Array.isArray(warehouseCodeDropSc)
        ? warehouseCodeDropSc.map((option) => ({
            value: option.warehouse_code,
            label: `${option.warehouse_code} - ${option.warehouse_name}`,
        }))
        : [];

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

    useEffect(() => {
        const company_code = sessionStorage.getItem("selectedCompanyCode");

        fetch(`${config.apiBaseUrl}/getSiteMaster`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const siteId = data.map((option) => option.site_id);
                setSiteIdDropGrid(siteId);
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
                const warehouseCode = data.map((option) => option.warehouse_code);
                setWarehouseCodeDropGrid(warehouseCode);
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

        fetch(`${config.apiBaseUrl}/getboolean`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company_code }),
        })
            .then((response) => response.json())
            .then((data) => {
                const isPrimary = data.map((option) => option.attributedetails_name);
                setIsPrimaryDropGrid(isPrimary);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const columnDefs = [
        {
            headerName: "Actions",
            field: "actions",
            width: 140,
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
                                    onClick={() => saveEditedData(params.data, params.node.data)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>

                                <span
                                    className="icon mx-2"
                                    onClick={() => deleteSelectedRows(params.data)}
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
        {
            headerName: "Site ID",
            field: "site_id",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: siteIdDropGrid,
            },
        },
        {
            headerName: "Warehouse Code",
            field: "warehouse_code",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: warehouseCodeDropGrid,
            },
        },
        {
            headerName: "Status",
            field: "status",
            cellEditor: "agSelectCellEditor",
            editable: true,
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
        {
            headerName: "Is Primary",
            field: "Is_Primary",
            cellEditor: "agSelectCellEditor",
            editable: true,
            cellEditorParams: {
                values: isPrimaryDropGrid,
            },
        },
        {
            headerName: "Remarks",
            field: "remarks",
        }
    ];

    const handleSave = async () => {
        if (!siteId || !warehouseCode || !status || !isPrimary) {
            setError(true);
            toast.warning("Error: Missing required fields");
            return;
        }

        setError(false);
        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/searchSiteWarehouseMapping`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    site_id: siteIdSc,
                    warehouse_code: warehouseCodeSc,
                    status: statusSc,
                    Is_Primary: isPrimarySc,
                    remarks: remarksSc,
                }),
            });

            if (response.ok) {
                const searchData = await response.json();
                setRowData(searchData);
            } else if (response.status === 404) {
                console.log("Data not found");
                setRowData([]);
                toast.warning("Data not found");
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching search data:", error);
            toast.error("Error fetching search data:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const saveEditedData = async (rowData) => {
        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem('selectedCompanyCode');
                    const modified_by = sessionStorage.getItem('selectedUserCode');

                    const siteWarehouseMapping = {
                        SiteWarehouseMappingData: Array.isArray(rowData)
                            ? rowData.map((row) => ({
                                ...row,
                                company_code,
                                modified_by,
                            }))
                            : [
                                {
                                    ...rowData,
                                    company_code,
                                    modified_by,
                                },
                            ],
                    };

                    const response = await fetch(`${config.apiBaseUrl}/SiteWarehouseMappingLoopUpdate `, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(siteWarehouseMapping)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        toast.success("Data updated successfully", {
                            onClose: () => handleSearch(), // Runs handleSearch when toast closes
                        });
                    } else {
                        toast.warning(result.message || "Failed to update data");
                    }
                } catch (error) {
                    console.error("Error deleting rows:", error);
                    toast.error('Error Deleting Data: ' + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Data updated cancelled.");
            }
        );
    };

    const deleteSelectedRows = async (rowData) => {

        const company_code = sessionStorage.getItem('selectedCompanyCode');
        const modified_by = sessionStorage.getItem('selectedUserCode');

        const SiteWarehouseMappingDelete = {
            SiteWarehouseMappingData: Array.isArray(rowData)
                ? rowData.map((row) => ({
                    ...row,
                    company_code,
                    modified_by,
                }))
                : [
                    {
                        ...rowData,
                        company_code,
                        modified_by,
                    },
                ],
        };

        showConfirmationToast(
            "Are you sure you want to delete the data in the selected rows?",
            async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${config.apiBaseUrl}/SiteWarehouseMappingLoopDelete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "company_code": company_code,
                        },
                        body: JSON.stringify(SiteWarehouseMappingDelete),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        toast.success("Data deleted successfully", {
                            onClose: () => handleSearch(), // Runs handleSearch when toast closes
                        });
                    } else {
                        toast.warning(result.message || "Failed to delete data");
                    }
                } catch (error) {
                    console.error("Error deleting rows:", error);
                    toast.error("Error deleting data: " + error.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Data delete cancelled.");
            }
        );
    };

    const searchClearInputFields = () => {
        setSelectedSiteIdSc("");
        setSiteIdSc("");
        setSelectedWarehouseCodeSc("");
        setWarehouseCodeSc("");
        setSelectedStatusSc("");
        setStatusSc("");
        setSelectedIsPrimarySc("");
        setIsPrimarySc("");
        setRemarksSc("");
        setRowData([]);
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-0 bg-white rounded">
                <div className="purbut mb-0 d-flex justify-content-between" >
                    <h1 align="left" class="purbut">Site Warehouse Mapping</h1>
                    <div className="col-md-1 mt-3 me-5 purbut">
                        <div class=" d-flex justify-content-end  me-3">
                            <div >
                            </div>
                            <div className="me-1">
                                <savebutton required title="Save" onClick={handleSave}>
                                    <i class="fa-regular fa-floppy-disk"></i>
                                </savebutton>
                            </div>
                            <div className="ms-1">
                            </div>
                            <div className="col-md-1">
                                <div className="ms-1">
                                    <reloadbutton className="purbut" onClick={addClearInputFields} title="Reload" style={{ cursor: "pointer" }}>
                                        <i className="fa-solid fa-arrow-rotate-right"></i>
                                    </reloadbutton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADD FORM */}
            <div className="shadow-lg p-1 bg-white rounded mt-2 mb-2">

                <div className="row ms-4 mb-3 mt-3 me-4">

                    <div className="col-md-3 form-group mb-2" title="Select Site ID">
                        <div class="exp-form-floating">
                            <label className={`exp-form-labels ${error && !siteId ? 'text-danger' : ''}`}>
                                Site ID<span className="text-danger">*</span>
                            </label>

                            <Select
                                value={selectedSiteId}
                                isClearable
                                options={filteredOptionSiteId}
                                className="exp-input-field"
                                onChange={handleChangeSiteId}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating" title="Select Warehouse Code">
                            <label className={`exp-form-labels ${error && !warehouseCode ? 'text-danger' : ''}`}>
                                Warehouse Code<span className="text-danger">*</span>
                            </label>

                            <Select
                                value={selectedWarehouseCode}
                                isClearable
                                options={filteredOptionWarehouseCode}
                                className="exp-input-field"
                                onChange={handleChangeWarehouseCode}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating" title="Select Status">
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

                    <div className="col-md-3 form-group mb-2" title="Select Is Primary">
                        <div class="exp-form-floating">
                            <label className={`exp-form-labels ${error && !isPrimary ? 'text-danger' : ''}`}>
                                Is Primary<span className="text-danger">*</span>
                            </label>

                            <Select
                                value={selectedIsPrimary}
                                isClearable
                                options={filteredOptionPrimary}
                                className="exp-input-field"
                                onChange={handleChangePrimary}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 form-group mb-2" title="Enter Remarks">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Remarks
                            </label>

                            <textarea
                                className="exp-input-field form-control"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* SEARCH */}
            <div className="shadow-lg bg-light rounded mb-2">
                <div className="p-3" style={{ width: "150px" }}>
                    <h6 className="">Search Criteria:</h6>
                </div>

                <div className="row ms-4 mb-3 me-4">

                    <div className="col-md-3 form-group mb-2" title="Select Site ID">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Site ID
                            </label>

                            <Select
                                value={selectedSiteIdSc}
                                isClearable
                                options={filteredOptionSiteIdSc}
                                className="exp-input-field"
                                onChange={handleChangeSiteIdSc}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2" title="Select Warehouse Code">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Warehouse Code
                            </label>

                            <Select
                                value={selectedWarehouseCodeSc}
                                isClearable
                                options={filteredOptionWarehouseCodeSc}
                                className="exp-input-field"
                                onChange={handleChangeWarehouseCodeSc}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2" title="Select Status">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Status
                            </label>

                            <Select
                                value={selectedStatusSc}
                                isClearable
                                options={filteredOptionStatusSc}
                                className="exp-input-field"
                                onChange={handleChangeStatusSc}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2" title="Select Is Primary">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Is Primary
                            </label>

                            <Select
                                value={selectedIsPrimarySc}
                                isClearable
                                options={filteredOptionPrimarySc}
                                className="exp-input-field"
                                onChange={handleChangePrimarySc}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2" title="Enter Remarks">
                        <div class="exp-form-floating">
                            <label className="exp-form-labels">
                                Remarks
                            </label>

                            <input
                                className="exp-input-field form-control"
                                value={remarksSc}
                                onChange={(e) => setRemarksSc(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 form-group mb-2 mt-4">
                        <div class="exp-form-floating">
                            <div class=" d-flex  justify-content-center">
                                <div class=''>
                                    <icon className="popups-btn fs-6 p-3"
                                        onClick={handleSearch}
                                        required title="Search">
                                        <i className="fas fa-search"></i>
                                    </icon>
                                </div>
                                <div>
                                    <icon className="popups-btn fs-6 p-3"
                                        onClick={searchClearInputFields}
                                        required title="Reload">
                                        <i className="fa-solid fa-arrow-rotate-right" />
                                    </icon>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="ag-theme-alpine mt-2 mb-2"
                        style={{
                            height: 450,
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
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
import { useNavigate, useLocation } from "react-router-dom";
import labels from "./Labels";

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

    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedData, setEditedData] = useState([]);

    const [createdBy, setCreatedBy] = useState("");
    const [modifiedBy, setModifiedBy] = useState("");
    const [createdDate, setCreatedDate] = useState("");
    const [modifiedDate, setModifiedDate] = useState("");

    const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isReloadShortcut =
        (event.ctrlKey && event.key.toLowerCase() === "r") ||
        (event.altKey && event.key.toLowerCase() === "r") ||
        event.key === "F5";

      if (isReloadShortcut) {
        event.preventDefault();
        clearInputFields();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); 

    useEffect(() => {
      // if (location.state?.preservedRowData) {
      //   setRowData(location.state.preservedRowData);
      // }
    
      if (location.state?.preservedInputs) {
        const inputs = location.state.preservedInputs;
        setSiteId(inputs.siteId || "");
        setSiteName(inputs.siteName || "");
        setSiteLocation(inputs.siteLocation || "");
        setCustomerCode(inputs.customerCode || "");
        setProjectType(inputs.projectType || "");
        setStartDate(inputs.startDate || "");
        setEndDate(inputs.endDate || "");
        setSiteStatus(inputs.siteStatus || "");
        setTotalBudget(inputs.totalBudget || "");
        setToleranceType(inputs.toleranceType || "");
        setToleranceValues(inputs.toleranceValues || "");
        setWarehouse(inputs.warehouse || "");
        setStatus(inputs.status || "");
    
        if (inputs.customerCode) {
          setSelectedCustomerCode({
            label: inputs.customerCode,
            value: inputs.customerCode,
          });
        }
        if (inputs.projectType) {
          setSelectedProjectType({
            label: inputs.projectType,
            value: inputs.projectType,
          });
        }
        if (inputs.siteStatus) {
          setSelectedSiteStatus({
            label: inputs.siteStatus,
            value: inputs.siteStatus,
          });
        }
        if (inputs.toleranceType) {
          setSelectedToleranceType({
            label: inputs.toleranceType,
            value: inputs.toleranceType,
          });
        }
        if (inputs.warehouse) {
          setSelectedWarehouse({
            label: inputs.warehouse,
            value: inputs.warehouse,
          });
        }
        if (inputs.status) {
          setSelectedStatus({
            label: inputs.status,
            value: inputs.status,
          });
        }

        if (location.state?.refreshGrid) {
        handleSearch(inputs); 
      }
      }
    }, [location.state]);

  const clearInputFields = () => {
    setSiteId("");
    setSiteName("");
    setSiteLocation("");
    setCustomerCode("");
    setProjectType("");
    setStartDate("");
    setEndDate("");
    setSiteStatus("");
    setTotalBudget("");
    setToleranceType("");
    setToleranceValues("");
    setWarehouse("");
    setStatus("");
    setSelectedStatus("");
    setSelectedCustomerCode("");
    setSelectedProjectType("");
    setSelectedSiteStatus("");
    setSelectedToleranceType("");
    setRowData([]);
  };

    // useEffect(() => {
    //   if (location.state?.preservedRowData) {
    //     setRowData(location.state.preservedRowData);
    //   }
    
    //   if (location.state?.preservedInputs) {
    //     setSiteId(location.state.preservedInputs.siteId || "");
    //     setSiteName(location.state.preservedInputs.siteName || "");
    //     setSiteLocation(location.state.preservedInputs.siteLocation || "");
    //     setCustomerCode(location.state.preservedInputs.customerCode || "");
    //     setProjectType(location.state.preservedInputs.projectType || "");
    //     setStartDate(location.state.preservedInputs.startDate || "");
    //     setEndDate(location.state.preservedInputs.endDate || "");
    //     setSiteStatus(location.state.preservedInputs.siteStatus || "");
    //     setTotalBudget(location.state.preservedInputs.totalBudget || "");
    //     setToleranceType(location.state.preservedInputs.toleranceType || "");
    //     setToleranceValues(location.state.preservedInputs.toleranceValues || "");
    //     setWarehouse(location.state.preservedInputs.warehouse || "");
    //     setStatus(location.state.preservedInputs.status || "");
    
    //     if (location.state.preservedInputs.customerCode) {
    //       setSelectedCustomerCode({
    //         label: location.state.preservedInputs.customerCode,
    //         value: location.state.preservedInputs.customerCode,
    //       });
    //     }
    //     if (location.state.preservedInputs.projectType) {
    //       setSelectedProjectType({
    //         label: location.state.preservedInputs.projectType,
    //         value: location.state.preservedInputs.projectType,
    //       });
    //     }
    //     if (location.state.preservedInputs.siteStatus) {
    //       setSelectedSiteStatus({
    //         label: location.state.preservedInputs.siteStatus,
    //         value: location.state.preservedInputs.siteStatus,
    //       });
    //     }
    //     if (location.state.preservedInputs.toleranceType) {
    //       setSelectedToleranceType({
    //         label: location.state.preservedInputs.toleranceType,
    //         value: location.state.preservedInputs.toleranceType,
    //       });
    //     }
    //     if (location.state.preservedInputs.warehouse) {
    //       setSelectedWarehouse({
    //         label: location.state.preservedInputs.warehouse,
    //         value: location.state.preservedInputs.warehouse,
    //       });
    //     }
    //     if (location.state.preservedInputs.status) {
    //       setSelectedStatus({
    //         label: location.state.preservedInputs.status,
    //         value: location.state.preservedInputs.status,
    //       });
    //     }
    //   }
    // }, [location.state]);

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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "Site ID",
            field: "site_id",
            cellClass: "ag-link-cell",
            cellRenderer: (params) => {
                const handleClick = () => {
                    handleNavigateWithRowData(params.data);
                };

                return (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={handleClick}
                    >
                        {params.value}
                    </span>
                );
            },
        },
        {
            headerName: "Site Name",
            field: "site_name",
            editable: true,
        },
        {
            headerName: "Site Location",
            field: "site_location",
            editable: true,
        },
        {
            headerName: "Customer Code",
            field: "client_code",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: customerCodeDropGrid,
            },
        },
        {
            headerName: "Project Type",
            field: "project_type",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: projectTypeDropGrid,
            },
        },
        {
            headerName: "Start Date",
            field: "start_date",
            editable: true,
        },
        {
            headerName: "End Date",
            field: "end_date",
            editable: true,
        },
        {
            headerName: "Site Status",
            field: "site_status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: siteStatusDropGrid,
            },
        },
        {
            headerName: "Total Budget",
            field: "total_budget",
            editable: true,
        },
        // {
        //     headerName: "Remarks / Notes",
        //     field: "Remarks/Notes",
        // },
        {
            headerName: "Tolerance Type",
            field: "Tolerance_Type",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: toleranceTypeDropGrid,
            },
        },
        {
            headerName: "Tolerance Values",
            field: "Tolerance_values",
            editable: true,
        },
        {
            headerName: "Warehouse",
            field: "Warehouses",
            editable: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: warehouseDropGrid,
            },
        },
        {
            headerName: "Status",
            field: "status",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDropGrid,
            },
        },
    ];

    const handleNavigate = () => {
        navigate("/AddSiteMaster", { state: { mode: "create" } });
    };

    const handleNavigateWithRowData = (selectedRow) => {
  navigate("/AddSiteMaster", {
    state: {
      mode: "update",
        keyfield: selectedRow.keyfield,

    //   preservedRowData: rowData,

      preservedInputs: {
        siteId,
        siteName,
        siteLocation,
        customerCode,
        projectType,
        startDate,
        endDate,
        siteStatus,
        totalBudget,
        toleranceType,
        toleranceValues,
        warehouse,
        status
      },
    },
  });
};

    const handleSearch = async (searchParams = null) => {
        setLoading(true);

        try {
            const response = await fetch(`${config.apiBaseUrl}/searchCriteriaSiteMaster`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    site_id: searchParams?.siteId ?? siteId,
                    site_name: searchParams?.siteName ?? siteName,
                    site_location:  searchParams?.siteLocation ?? siteLocation,
                    client_code:  searchParams?.clientCode ?? customerCode,
                    project_type:  searchParams?.projectType ?? projectType,
                    start_date:  searchParams?.startDate ?? startDate,
                    end_date: searchParams?.endDate ?? endDate,
                    site_status:  searchParams?.siteStatus ?? siteStatus,
                    total_budget: Number( searchParams?.totalBudget ?? totalBudget ?? 0) || 0,
                    status: searchParams?.status ?? status,
                    Warehouses:  searchParams?.warehouse ?? warehouse,
                    Tolerance_Type:  searchParams?.toleranceType ?? toleranceType,
                    Tolerance_values: Number( searchParams?.toleranceValues ?? toleranceValues ?? 0) || 0,
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

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onCellValueChanged = (params) => {

        const updatedRowData = [...rowData];

        updatedRowData[params.node.rowIndex] = {
            ...updatedRowData[params.node.rowIndex],
            [params.colDef.field]: params.newValue
        };

        setRowData(updatedRowData);

        setEditedData((prev) => [
            ...prev.filter(
                (row) => row.keyfield !== params.data.keyfield
            ),
            updatedRowData[params.node.rowIndex]
        ]);
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const reloadGridData = () => {
        window.location.reload();
    };

    const saveEditedData = async () => {
        const selectedRowsData = editedData
            .filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield))

        if (selectedRowsData.length === 0) {
            toast.warning("Please select and modify at least one row to update its data");
            return;
        }

        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
                try {
                    setLoading(true);
                    const modified_by = sessionStorage.getItem('selectedUserCode');
                    const company_code = sessionStorage.getItem('selectedCompanyCode');

                    const response = await fetch(`${config.apiBaseUrl}/SiteMasterLoopUpdate`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "modified-by": modified_by,
                            "company_code": company_code,
                        },
                        body: JSON.stringify({ SiteMasterData: selectedRowsData })
                    });
                    const result = await response.json();

                    if (response.ok) {
                        toast.success("Data Updated Successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        toast.warning(result.message || "Failed to update data");
                    }
                } catch (err) {
                    console.error("Error Updating data:", err);
                    toast.error("Error Updating Data: " + err.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Data updated cancelled.");
            }
        );
    };

    const deleteSelectedRows = async () => {
        const selectedRows = gridApi.getSelectedRows();

        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to delete");
            return;
        }

        showConfirmationToast(
            "Are you sure you want to delete the selected rows?",
            async () => {
                try {
                    setLoading(true);
                    const company_code = sessionStorage.getItem("selectedCompanyCode");
                    const response = await fetch(`${config.apiBaseUrl}/SiteMasterLoopDelete`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                company_code: company_code,
                            },
                            body: JSON.stringify({
                                SiteMasterData: selectedRows
                            }),
                        }
                    );

                    const result = await response.json();

                    if (response.ok) {
                        toast.success("Data deleted successfully", {
                            onClose: () => handleSearch(),
                        });
                    } else {
                        toast.warning(result.message || "Failed to delete data");
                    }

                } catch (err) {
                    console.error("Error deleting data:", err);
                    toast.error("Error deleting data: " + err.message);
                } finally {
                    setLoading(false);
                }
            },
            () => {
                toast.info("Delete cancelled");
            }
        );
    };

    const generateReport = () => {
        const selectedRows = gridApi.getSelectedRows();
        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to generate a report");
            return;
        }

        const reportData = selectedRows.map((row) => {
            const formatValue = (val) => (val !== undefined && val !== null ? val : '');

            return {
                "Site ID": formatValue(row.site_id),
                "Site Name": formatValue(row.site_name),
                "Site Location": formatValue(row.site_location),
                "Customer Code": formatValue(row.client_code),
                "Project Type": formatValue(row.project_type),
                "Start Date": formatValue(row.start_date),
                "End Date": formatValue(row.end_date),
                "Site Status": formatValue(row.site_status),
                "Total Budget": formatValue(row.total_budget),
                "Tolerance Type": formatValue(row.Tolerance_Type),
                "Tolerance Values": formatValue(row.Tolerance_values),
                "Warehouse": formatValue(row.Warehouses),
                "Status": formatValue(row.status)
            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>Site Master Report</title>");
        reportWindow.document.write("<style>");
        reportWindow.document.write(`
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
          }
          h1 {
              color: maroon;
              text-align: center;
              font-size: 24px;
              margin-bottom: 30px;
              text-decoration: underline;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
          }
          th, td {
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
              vertical-align: top;
          }
          th {
              background-color: maroon;
              color: white;
              font-weight: bold;
          }
          td {
              background-color: #fdd9b5;
          }
          tr:nth-child(even) td {
              background-color: #fff0e1;
          }
          .report-button {
              display: block;
              width: 150px;
              margin: 20px auto;
              padding: 10px;
              background-color: maroon;
              color: white;
              border: none;
              cursor: pointer;
              font-size: 16px;
              text-align: center;
              border-radius: 5px;
          }
          .report-button:hover {
              background-color: darkred;
          }
          @media print {
              .report-button {
                  display: none;
              }
              body {
                  margin: 0;
                  padding: 0;
              }
          }
        `);
        reportWindow.document.write("</style></head><body>");
        reportWindow.document.write("<h1><u>Site Master Information</u></h1>");

        // Create table with headers
        reportWindow.document.write("<table><thead><tr>");
        Object.keys(reportData[0]).forEach((key) => {
            reportWindow.document.write(`<th>${key}</th>`);
        });
        reportWindow.document.write("</tr></thead><tbody>");

        // Populate the rows with safe empty strings
        reportData.forEach((row) => {
            reportWindow.document.write("<tr>");
            Object.values(row).forEach((value) => {
                reportWindow.document.write(`<td>${value || ''}</td>`);
            });
            reportWindow.document.write("</tr>");
        });

        reportWindow.document.write("</tbody></table>");
        reportWindow.document.write(
            '<button class="report-button" title="Print" onclick="window.print()">Print</button>'
        );
        reportWindow.document.write("</body></html>");
        reportWindow.document.close();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    const handleRowClick = (rowData) => {
        setCreatedBy(rowData.created_by);
        setModifiedBy(rowData.modified_by);
        const formattedCreatedDate = formatDate(rowData.created_date);
        const formattedModifiedDate = formatDate(rowData.modified_date);
        setCreatedDate(formattedCreatedDate);
        setModifiedDate(formattedModifiedDate);
    };

    const onRowSelected = (event) => {
        if (event.node.isSelected()) {
            handleRowClick(event.data);
        }
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
                                    onClick={deleteSelectedRows}
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
                                    onClick={saveEditedData}
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
                                    onClick={generateReport}
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
                                                <icon class="icon" onClick={handleNavigate}>
                                                    <i class="fa-solid fa-user-plus"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center text-danger">
                                        {["delete", "all permission"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon" onClick={deleteSelectedRows}>
                                                    <i class="fa-solid fa-user-minus"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center text-primary ">
                                        {["update", "all permission"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon" onClick={saveEditedData}>
                                                    <i class="fa-solid fa-floppy-disk"></i>
                                                </icon>
                                            )}
                                    </li>
                                    <li class="iconbutton  d-flex justify-content-center ">
                                        {["all permission", "view"].some((permission) =>
                                            SiteMasterPermission.includes(permission),
                                        ) && (
                                                <icon class="icon" onClick={generateReport}>
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
                                title="Enter Site ID"
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
                                title="Enter Site Name"
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
                                title="Enter Site Location"
                                className="exp-input-field form-control"
                                value={siteLocation}
                                onChange={(e) => setSiteLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Select Customer Code">
                            <label class="exp-form-labels">
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Select Project Type">
                            <label class="exp-form-labels">
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label class="exp-form-labels">
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Select Site Status">
                            <label class="exp-form-labels">
                                Site Status
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Enter Total Budget">
                            <label class="exp-form-labels">
                                Total Budget
                            </label>
                            <input
                                className="form-control"
                                className="exp-input-field form-control"
                                value={totalBudget}
                                onChange={handleTotalBudgetChange}
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
                        <div class="exp-form-floating" title="Select Tolerance Type">
                            <label class="exp-form-labels">
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

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Enter Tolerance Values">
                            <label class="exp-form-labels">
                                Tolerance Values
                            </label>
                            <input
                                className="form-control"
                                className="exp-input-field form-control"
                                value={toleranceValues}
                                onChange={handleToleranceValueChange}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating" title="Select Warehouse">
                            <label class="exp-form-labels">
                                Warehouse
                            </label>
                            <Select
                                value={selectedWarehouse}
                                isClearable
                                options={filteredOptionWarehouse}
                                className="exp-input-field"
                                onChange={handleChangeSiteWarehouse}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating" title="Select Status">
                            <label class="exp-form-labels">
                                Status
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

                    <div className="col-md-3 form-group mt-4">
                        <div class="exp-form-floating">
                            <div class=" d-flex  justify-content-center">
                                <div class="">
                                    <icon
                                        className="popups-btn fs-6 p-3"
                                        required
                                        title="Search"
                                        onClick={handleSearch}
                                    >
                                        <i className="fas fa-search"></i>
                                    </icon>
                                </div>
                                <div>
                                    <icon
                                        className="popups-btn fs-6 p-3"
                                        required
                                        title="Refresh"
                                        onClick={clearInputFields}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-right" />
                                    </icon>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="ag-theme-alpine mb-2" style={{ height: 450, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={onGridReady}
                        onCellValueChanged={onCellValueChanged}
                        rowSelection="multiple"
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        onRowSelected={onRowSelected}
                        paginationAutoPageSize={true}
                    />
                </div>
            </div>

            <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
                <div className="row ms-2">
                    <div className="d-flex justify-content-start">
                        <p className="col-md-6">
                            {labels.createdBy}: {createdBy}
                        </p>
                        <p className="col-md-">
                            {labels.createdDate}: {createdDate}
                        </p>
                    </div>
                    <div className="d-flex justify-content-start">
                        <p className="col-md-6">
                            {labels.modifiedBy}: {modifiedBy}
                        </p>
                        <p className="col-md-6">
                            {labels.modifiedDate}: {modifiedDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSiteMasterScreen;
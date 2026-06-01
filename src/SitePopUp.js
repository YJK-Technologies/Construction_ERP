import { useState } from "react";
import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "./Loading";

const config = require("./Apiconfig");

const columnDefs = [
  {
    checkboxSelection: true,
    headerName: "Site ID",
    field: "site_id",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Site Name",
    field: "site_name",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Site Location",
    field: "site_location",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
  {
    headerName: "Site Status",
    field: "site_status",
    editable: false,
    cellStyle: { textAlign: "left" },
  },
];

const defaultColDef = {
  resizable: true,
  sortable: true,
  editable: false,
};

export default function SitePopup({
  open,
  handleClose,
  handleSiteCode,
}) {
  const [rowData, setRowData] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [siteStatus, setSiteStatus] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchSite = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/searchCriteriaSiteMaster`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_code:
              sessionStorage.getItem("selectedCompanyCode"),

            site_id: siteId,
            site_name: siteName,
            site_location: siteLocation,
            site_status: siteStatus,
          }),
        }
      );

      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
      } else if (response.status === 404) {
        toast.warning("Data not found!", {
          onClose: () => {
            setRowData([]);
            clearInputs();
          },
        });
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching Site Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearInputs = () => {
    setSiteId("");
    setSiteName("");
    setSiteLocation("");
    setSiteStatus("");
  };

  const handleReload = () => {
    clearInputs();
    setRowData([]);
  };

  const handleRowSelected = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleConfirm = () => {
    const selectedData = selectedRows.map((row) => ({
      SiteID: row.site_id,
      SiteName: row.site_name,
      SiteLocation: row.site_location,
      SiteStatus: row.site_status,
    }));

    handleSiteCode(selectedData);

    handleClose();

    clearInputs();
    setRowData([]);
    setSelectedRows([]);
  };

  return (
    <div>
      {open && (
        <fieldset>
          <div className="purbut">
            {loading && <LoadingScreen />}

            <div
              className="modal mt-5 Topnav-screen popup popupadj"
              tabIndex="-1"
              role="dialog"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="modal-dialog modal-xl ps-5 pe-5 p-1"
                role="document"
              >
                <div className="modal-content">
                  <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                      <div className="p-0 bg-body-tertiary">
                        <div className="purbut mb-0 d-flex justify-content-between">
                          <h1
                            align="left"
                            className="purbut"
                          >
                            Site Help
                          </h1>

                          <button
                            onClick={handleClose}
                            className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5"
                            title="Close"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="modal-body">
                      <div className="row ms-3 me-3">
                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site ID"
                            value={siteId}
                            onChange={(e) =>
                              setSiteId(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Name"
                            value={siteName}
                            onChange={(e) =>
                              setSiteName(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Location"
                            value={siteLocation}
                            onChange={(e) =>
                              setSiteLocation(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Status"
                            value={siteStatus}
                            onChange={(e) =>
                              setSiteStatus(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="mb-2 mt-2 d-flex justify-content-end">
                          <icon
                            className="icon popups-btn"
                            onClick={handleSearchSite}
                          >
                            <FontAwesomeIcon
                              icon={faMagnifyingGlass}
                            />
                          </icon>

                          <icon
                            className="icon popups-btn"
                            onClick={handleReload}
                          >
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                          </icon>

                          <icon
                            className="icon popups-btn"
                            onClick={handleConfirm}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-check" />
                          </icon>
                        </div>
                      </div>

                      <div
                        className="ag-theme-alpine"
                        style={{
                          height: "400px",
                          width: "100%",
                        }}
                      >
                        <AgGridReact
                          rowData={rowData}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          rowSelection="multiple"
                          pagination
                          onSelectionChanged={
                            handleRowSelected
                          }
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

                    <div className="mobileview">
                      <div className="modal mt-5  Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                          <div className="modal-content">
                            <div class="row justify-content-center">
                              <div class="col-md-12 text-center">
                                <div className="mb-0 d-flex justify-content-between">
                                  <div className="mb-0 d-flex justify-content-start me-4">
                                    <h1 className="h1">Site Help</h1>
                                  </div>
                                  <div className="mb-0 d-flex justify-content-end" >
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

                              <div className="modal-body">
                      <div className="row ms-3 me-3">
                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site ID"
                            value={siteId}
                            onChange={(e) =>
                              setSiteId(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Name"
                            value={siteName}
                            onChange={(e) =>
                              setSiteName(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Location"
                            value={siteLocation}
                            onChange={(e) =>
                              setSiteLocation(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-sm mb-2">
                          <input
                            type="text"
                            className="exp-input-field form-control"
                            placeholder="Site Status"
                            value={siteStatus}
                            onChange={(e) =>
                              setSiteStatus(e.target.value)
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSite()
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="mb-2 mt-2 d-flex justify-content-end">
                          <icon
                            className="icon popups-btn"
                            onClick={handleSearchSite}
                          >
                            <FontAwesomeIcon
                              icon={faMagnifyingGlass}
                            />
                          </icon>

                          <icon
                            className="icon popups-btn"
                            onClick={handleReload}
                          >
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                          </icon>

                          <icon
                            className="icon popups-btn"
                            onClick={handleConfirm}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-check" />
                          </icon>
                        </div>
                      </div>

                      <div
                        className="ag-theme-alpine"
                        style={{
                          height: "400px",
                          width: "100%",
                        }}
                      >
                        <AgGridReact
                          rowData={rowData}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          rowSelection="multiple"
                          pagination
                          onSelectionChanged={
                            handleRowSelected
                          }
                        />
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
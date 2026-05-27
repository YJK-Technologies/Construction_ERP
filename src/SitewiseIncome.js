import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./apps.css";
//import '../App.css'
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from "./Loading";



const config = require('./Apiconfig');

function SitewiseIncome() {
const [selectPeriod, setSelectPeriod] = useState("");
const [SiteId, setSiteId] = useState("");
const [NetProfitFrom, setNetProfitFrom] = useState("");
const [NetProfitTo, setNetProfitTo] = useState("");
const [loading, setLoading] = useState(false);   
 const [rowData, setRowData] = useState([]);
const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const SitePermissions = permissions
    .filter(permission => permission.screen_type === 'SitewiseIncome')
    .map(permission => permission.permission_type.toLowerCase());

    const columnDefs = [
    {
      headerName: "Site Id",
      field: "transaction_date",
    },
    {
      headerName: "Site Name",
      field: "Item_code",
    },
    {
      headerName: "Total Income",
      field: "item_variant"
    },
    {
      headerName: "Total Expenses",
      field: "Item_name"
    },
    {
      headerName: "Net Profit",
      field: "openingItemQty",
    }
]

    return(
           <div className="container-fluid Topnav-screen">
      <div>
        {loading && <LoadingScreen />}
        <ToastContainer position="top-right" className="toast-design" theme="colored" />
        <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
          <div className=" d-flex justify-content-between  ">
            <div class="d-flex justify-content-start">
              <h1 align="left" className="purbut"> Site Wise Income & Expenses Analysis Report
              </h1>
            </div>
            <div className="d-flex justify-content-end purbut me-3">
              <printbutton className="purbut btn btn-dark mt-3 mb-3 rounded-3" title='excel' 
              //onClick={handleExcelDownload}
              >
                <i class="fa-solid fa-file-excel"></i>
              </printbutton>
              {['all permission', 'view'].some(permission => SitePermissions.includes(permission)) && (
                <printbutton className="purbut btn btn-dark mt-3 mb-3 rounded-3" 
                //onClick={generateReport}
                 required title="Generate Report">
                  <i class="fa-solid fa-print"></i>
                </printbutton>
              )}
            </div>
          </div>
          <div class="mobileview">
            <div class="d-flex justify-content-between">
              <div className="d-flex justify-content-start ms-3">
                <h1 align="left" className="h1" >Site Wise Income & Expenses Analysis Report </h1>
              </div>
              <div class="dropdown mt-1" >
                <button class="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-list"></i>
                </button>
                <ul class="dropdown-menu">
                 
                  <li class="iconbutton  d-flex justify-content-center ">
                    {['all permission', 'view'].some(permission => SitePermissions.includes(permission)) && (
                      <icon
                        class="icon"
                        //onClick={generateReport}
                      >
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
                             <div className="shadow-lg p-1 bg-body-tertiary rounded  pb-4">
                <div class=" mt-4">
                    <div className="row ms-3 ">
                        <div className="col-md-2 form-group mb-2 ">
                            <label class="exp-form-labels">Select Period</label>
                            <div className="exp-form-floating">
                                <div class="d-flex justify-content-end">
                                    <Select
                                        name="transactionDate"
                                        id="date"
                                        className="exp-input-field"
                                        type="text"
                                        placeholder=""
                                        required
                                        autoComplete="off"
                                        value={selectPeriod}
                //                         onChange={handleChangeItem}
                // options={filteredOptionItem}
                                    />
                                   
                                </div>
                            </div>
                        </div>
                         <div className="col-md-2 form-group mb-2 ">
                            <label class="exp-form-labels">SiteId </label>
                            <div className="exp-form-floating">
                                <div class="d-flex justify-content-end">
                                    <input
                                        name="transactionDate"
                                        id="SiteId"
                                        className="exp-input-field form-control"
                                        type="text"
                                        placeholder=""
                                        required
                                        autoComplete="off"
                                        value={SiteId}
                                       // onKeyDown={(e) => e.key === "Enter" && fetchReceivedGoodsData()}
                                        onChange={(e) => setSiteId(e.target.value)}
                                    />
                                   
                                </div>
                            </div>
                        </div>
  <div class=" mt-4">
                    <div className="row ms-2 ">
                        <div className="col-md-2 form-group mb-2 ">
                            <label class="exp-form-labels">Net Profit From</label>
                            <div className="exp-form-floating">
                                <div class="d-flex justify-content-end">
                                    <input
                                        name="transactionDate"
                                        id="transactionNo"
                                        className="exp-input-field form-control"
                                        type="date"
                                        placeholder=""
                                        required
                                        autoComplete="off"
                                        value={NetProfitFrom}
                                        //onKeyDown={(e) => e.key === "Enter" && fetchReceivedGoodsData()}
                                        onChange={(e) => setNetProfitFrom(e.target.value)}
                                    />
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 form-group mb-2 ">
                            <label class="exp-form-labels">Net Profit To</label>
                            <div className="exp-form-floating">
                                <div class="d-flex justify-content-end">
                                    <input
                                        name="transactionDate"
                                        id="date"
                                        className="exp-input-field form-control"
                                        type="date"
                                        placeholder=""
                                        required
                                        autoComplete="off"
                                        value={NetProfitTo}
                                        //onKeyDown={(e) => e.key === "Enter" && fetchReceivedGoodsData()}
                                        onChange={(e) => setNetProfitTo(e.target.value)}
                                    />
                                   
                                </div>
                            </div>
                        </div>
                        </div>
                        </div>
                         <div class="ag-theme-alpine" style={{ height: 455, width: "100%" }}>
                                             <AgGridReact
                                                 columnDefs={columnDefs}
                                                 rowData={rowData}
                                                 defaultColDef={{ flex: true }}
                                                // onGridReady={onGridReady}
                                                 pagination={true}
                                                 paginationAutoPageSize={true}
                                             />
                                         </div>
                        </div>
                    </div>
                            </div>
                          </div>
                        
    )
}
export default SitewiseIncome;

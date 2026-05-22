 import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
//import Login from "./Login.js";
//import Register from "./registration.js";
import Home from './Home.js';
import Login from "./Login.js";
import Signup from "./signup.js";
import Dash from './Dashboard.js'
import App from "./Theapp.js";
import { useState,useEffect } from "react";
import Input from "./Input.js";
import Grid from "./Grid.js";
import Topbar from "./Topbar2.js";
import SideBar from "./SideBar.js";
import UserGrid from "./user_Grid.js";
import UserInput from "./UserInput.js";
import WarehouseGrid from "./WarehouseGrid.js";
import WareHouseInput from "./WareHouseInput.js";
import RoleInfoGrid from "./RoleInfoGrid.js";
import Role_input from "./RoleInfo_Input.js";
import Purchase from "./Purchase.js";
import AttriDetGrid from "./AttriDetGrid.js";
import AttriHdrInput from "./AttriHdrInput.js";
import AttriDetInput from "./AttriDetInput.js";
import IntermediaryGrid from "./IntermediaryHeaderGrid.js";
import IntermediaryHdrInput from "./IntermediaryHeaderInput.js";
import IntermediaryDetailInput from "./IntermediaryDetailrInput.js";
import TaxDetGrid from "./Taxdetgrid.js";
import TaxHdrInput from "./TaxHdrInput.js";
import TaxDetInput from "./TaxDetInput.js";
import ItemBrandGrid from "./itembrandgrid.js";
import ItemInput from "./ItemInput.js";
import VenDetGrid from "./VenDetGrid.js";
import VenHdrInput from "./VenHdrInput.js";
import VenDetInput from "./VenDetInput.js";
import CompanyMappingGrid from "./CompanyMappingGrid.js";
import UserComMap_input from "./CompanyMappingInput.js";
import UserRoleMapGrid from "./UserRoleMapGrid.js";
import UserRoleInput from "./UserRoleMapInput.js";
import LocInfoGrid from "./LocationInfoGrid.js";
import LocInfoInput from "./LocationInput.js";
import PurchaseAnalysis from "./PurchaseAnalysis.js";
import PurchaseReturn from './PurchaseReturn.js';
import Sales from "./Inventory.js";
import SalesReturn from "./SalesReturn.js";
import Template from "./Template.js";
import NumberSeriesGrid from "./NumberSeriesGrid.js";
import NumberSeriesInput from "./NumberSeriesInput.js";
import SaleTrans from './SalesAnalysis.js';
import SalesPrint from './SalesTemplate.js'
import VariantTab from './ItemDashboard/Variant.js';
import ProductTab from './ItemDashboard/Products.js';
import UnitTab from './ItemDashboard/Unit.js';
import Chart from './ItemDashboard/Charts/Charts.js';
import Settings from './Settings.js';
import UnitChart from './ItemDashboard/Charts/UnitChart.js';
import ProChart from './ItemDashboard/Charts/ProChart.js';
import VarChart from './ItemDashboard/Charts/VarChart.js';
import Purdash from './PurchaseDashboard/PurchaseAnalysis.js';
import PurchaseReturnPrint from "./PurchaseReturnTemplate.js";
import AccountInformation from "./AccountInformation.js";
import UserScreenMapGrid from "./userscreenmapgrid.js";
import UserScreenInput from "./userscreeninput.js"; 
import CustomerDetGrid from "./Customerdetgrid.js";
import CustomerHdrInput from "./Customerhdrinput.js"; 
import CustomerDetInput from "./customerdetinput.js";
import OpeningbalanceGrid from "./OpeningbalanceGrid.js";
import OpeningBalanceItem from "./OpeningBalanceItem.js";
import OpeningbalanceInput from "./Openingbalanceinput.js";
import AdjustmentGrid from "./Adjustmentgrid.js";
import AdjustmentInput from "./Adjustmentinput.js";
import StocktransferInput from "./stocktransferinput.js";
import SalesReturnPrint from "./SalesReturnTemplate.js";
import JournalGrid from "./journalgrid.js";
import JournalInput from "./journalinput.js";
import PurChart from './PurchaseDashboard/PurChart.js';
import NotFound from './NotFound.js'
import PurchaseDeleteDetails from "./PurchaseDeleteDetails.js";
import DeletedSales from "./DeletedSales.js";
import TStock from './TotalStockDashboard/TStockScreen.js'
import StockTransfer from "./StockTransfer.js";
import StockTransferTemplate from "./StockTransferTemplate.js";
import BaseAccount from "./BaseAccount.js";
import AddBaseAcc from "./AddBaseAccount.js";
import UserAccGrpGrid from "./UserAccGrpgrid.js";
import UserAccInput from "./UserAccGrpInput.js";
import StandardAcc from "./StandardAccount.js";
import StdAccInput from "./AddStandardAcc.js";
import AccNameGrid from "./AccountName.js"; 
import AccNameInput from "./AccountNameInput.js";
import DeliveryChallan from "./DeliveryChallan.js";
import Quotation from "./Quotation.js";
import BankAccInput from "./BankAccount.js";
import BankAccGrid from "./BankAccountGrid.js";
import Cstock from "./CurrentStockScreen.js";
import TaxInvoiceTemplate1 from "./PrintScreens/Template1/InvoicePrint.js";
import TaxInvoiceTemplate2 from "./PrintScreens/Template2/TaxInvoicePrint.js";
import QuotationTemplate1 from "./PrintScreens/Template1/QuotePrint.js";
import QuotationTemplate2 from "./PrintScreens/Template2/QuotationPrint.js";
import PurchaseOrder from "./PurchaseOrder.js";
import DeliveryChallanTemplate1 from "./PrintScreens/Template1/DeliveryChallanPrint.js";
import DeliveryChallanTemplate2 from "./PrintScreens/Template2/DcPrint.js";
import PurchaseOrderTemplate1 from "./PrintScreens/Template1/PurchaseOrderPrint.js";
import PurchaseOrderTemplate2 from "./PrintScreens/Template2/POPrint.js";
import TaxInvoice from "./TaxInvoice.js";
import Product from "./Products.js";
import ProductDetail from "./AddProductDetails.js";
import ProductHdr from "./AddProducthdr.js";
import PurchaseOrderAnalysis from "./PurchaseOrderanalysis.js";
import TaxInvoiceanalysis from "./TaxInvoiceAnalysis.js";
import DCanalysis from "./DeliveryChallanAnalysis.js";
import QOanalysis from "./QuotationAnalysis.js";
import UnplannedIssued from "./UnplannedIssued.js";
import UnplannedReturn from "./UnplannedReturn.js";
import UnplannedReceipt from "./UnplannedReceipt.js";
import InvReceiptPrint from "./InventoryPrintTemplates/InvReceiptPrint.js";
import InvReturnPrint from "./InventoryPrintTemplates/InvReturnPrint.js";
import InvIssuedPrint from "./InventoryPrintTemplates/InvIssuedPrint.js";
import Employee from "./Employeegrid.js";
import EmployeeInput from "./Employeeinput.js";
import BarcodeGenerator from "./Barcode/BarcodeGenerator.js";
import BarcodeScanner from "./Barcode/BarcodeScanner.js";
import DepartmentInput from "./DepartmentInput.js";
import Department from "./DepartmentGrid.js";
import Desgination from "./DesginationGrid.js";
import DesginationInput from "./DesginationInput.js";
import AdjustmnetPrint from "./InventoryPrintTemplates/AdjustmnetPrint.js";
import ObPrint from "./InventoryPrintTemplates/ObPrint.js";
import JournalPrint from "./InventoryPrintTemplates/JournalTemplate.js";
import GSTReport from './GSTReport/GSTReport.js';
import PerformaInvoiceTemplate1 from './PrintScreens/Template1/ProformaPrint.js';
import PerformaInvoiceTemplate2 from './PrintScreens/Template2/PerformaInvoicePrint.js';
import OpeningItemAnalysis from './OpeningItemAnalysis.js';
import DataWiseStock from './DataWiseItem/DataWiseItemStock.js';
import PendingCustomer from './PendingCustomer.js';
import Salessettings from "./SalesSettings.js";
import ReceivedGoods from "./ReceivedGoods/ReceivedGoods.js";
import ReceivedGoodsRt from "./ReceivedGoodsReport.js";
import PurchaseSetting from "./PurchaseSetting.js";
import POsettings from "./POsettings.js";
import InvoiceSettings from "./InvoiceSetting.js";
import Validation from "./ValidationScreen.js";
import ValidationGrid from "./ValidationGridScreen.js";
import PayslipReport from "./PayslipReport.js"
import FinancialYearAccess from "./financialYearAccess.js"
import AddFinancialYearAccess from './AddFInancialYearAccess.js'
import PayslipDash from './PayslipReports.js'
import { ToastContainer } from "react-toastify";
import PrintTemplate from "./PrintTemplate.js";
import WeekOff from "./WeekOff.js";
import ClientInfo from "./ClientInfo.js";
import ADDClientInfo from "./AddClientInfo.js";
import Payment from "./Payment.js";

function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [screenTypes, setScreenTypes] = useState(
    JSON.parse(sessionStorage.getItem("screenTypes")) || []
  );

  useEffect(() => {
    const loadPermissions = () => {
      const permissionsJSON = sessionStorage.getItem("permissions");
      if (permissionsJSON) {
        const permissions = JSON.parse(permissionsJSON);
        const screens = permissions.map((permission) =>
          permission.screen_type.replace(/\s+/g, "")
        );
        setScreenTypes(screens);
        sessionStorage.setItem("screenTypes", JSON.stringify(screens));
      }
    };

    loadPermissions();

    window.addEventListener("permissionsUpdated", loadPermissions);
    return () => window.removeEventListener("permissionsUpdated", loadPermissions);
  }, []);

// console.log('Screen Types:', screenTypes);
  
  // const screenTypes = Object.keys(permissions);

  // create by pavun on 7 may 2024 use: To block the view page source  brgin
  // useEffect(()=>{
  //   document.addEventListener("contextmenu",handlecontextmenu)
  //   return()=>{
  //     document.removeEventListener("contextmenu",handlecontextmenu)
  //   }
  // },[])

  // const handlecontextmenu=(e)=>{
  //   e.preventDefault()
  //   // alert("right click is disable")
  // }
  // create by pavun on 7 may 2024 use: To block the view page source  End

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const routes = [
    { path: "/Dashboard", component: <Dash /> },
    { path: "/", component: <Home /> },
    { path: "/Login", component: <Login /> },
    { path: "/signup", component: <Signup /> },
    { path: "/PurchasePrint", component: <Template /> },
    { path: "/SalesPrint", component: <SalesPrint /> },
    { path: "/PurchaseReturnPrint", component: <PurchaseReturnPrint /> },
    { path: "/SalesReturnPrint", component: <SalesReturnPrint /> },
    { path: "/PurchaseChart", component: <PurChart /> },
    { path: "/PurchaseAnalysis", component: <Purdash /> },
    { path: "/UnitDataChart", component: <UnitChart /> },
    { path: "/VarientDataChart", component: <VarChart /> },
    { path: "/ItemDataChart", component: <ProChart /> },
    { path: "/SalesChart", component: <Chart /> },
    { path: "/Settings", component: <Settings /> },
    { path: "/UnitData", component: <UnitTab /> },
    { path: "/VarientData", component: <VariantTab /> },
    { path: "/ItemData", component: <ProductTab /> },
    { path: "/AddCompany", component: <Input /> },
    { path: "/SalesAnalysis", component: <SaleTrans /> },
    { path: "/Company", component: <Grid /> },
    { path: "/AddUser", component: <UserInput /> },
    { path: "/User", component: <UserGrid /> },
    { path: "/Warehouse", component: <WarehouseGrid /> },
    { path: "/AddWarehouse", component: <WareHouseInput /> },
    { path: "/Role", component: <RoleInfoGrid /> },
    { path: "/AddRole", component: <Role_input /> },
    { path: "/Purchase", component: <Purchase /> },
    { path: "/PurchaseReturn", component: <PurchaseReturn /> },
    { path: "/Sales", component: <Sales /> },
    { path: "/Attribute", component: <AttriDetGrid /> },
    { path: "/AddAttributeHeader", component: <AttriHdrInput /> },
    { path: "/AddAttributeDetail", component: <AttriDetInput /> },
    { path: "/Intermediary", component: <IntermediaryGrid /> },
    { path: "/AddIntermedHeader", component: <IntermediaryHdrInput /> },
    { path: "/AddIntermedDetails", component: <IntermediaryDetailInput /> },
    { path: "/Tax", component: <TaxDetGrid /> },
    { path: "/AddTaxHeader", component: <TaxHdrInput /> },
    { path: "/AddTaxDetails", component: <TaxDetInput /> },
    { path: "/Item", component: <ItemBrandGrid /> },
    { path: "/AddItem", component: <ItemInput /> },
    { path: "/Vendor", component: <VenDetGrid /> },
    { path: "/AddVendorHeader", component: <VenHdrInput /> },
    { path: "/AddVendorDetails", component: <VenDetInput /> },
    { path: "/CompanyMapping", component: <CompanyMappingGrid /> },
    { path: "/AddCompanyMapping", component: <UserComMap_input /> },
    { path: "/UserRoleMapping", component: <UserRoleMapGrid /> },
    { path: "/AddUserRoleMapping", component: <UserRoleInput /> },
    { path: "/Location", component: <LocInfoGrid /> },
    { path: "/AddLocation", component: <LocInfoInput /> },
    { path: "/PurchaseAnalysis", component: <PurchaseAnalysis /> },
    { path: "/Sales", component: <Sales /> },
    { path: "/SalesReturn", component: <SalesReturn /> },
    { path: "/NumberSeries", component: <NumberSeriesGrid /> },
    { path: "/AddNumberSeries", component: <NumberSeriesInput /> },
    { path: "/UserRights", component: <UserScreenMapGrid /> },
    { path: "/AccountInformation", component: <AccountInformation /> },
    { path: "/AddUserRights", component: <UserScreenInput /> },
    { path: "/Customer", component: <CustomerDetGrid /> },
    { path: "/AddCustomerHeader", component: <CustomerHdrInput /> },
    { path: "/AddCustomerDetails", component: <CustomerDetInput /> },
    { path: "/OpeningBalance", component: <OpeningbalanceGrid /> },
    { path: "/OpeningItem", component: <OpeningBalanceItem /> },
    { path: "/AddOpeningBalance", component: <OpeningbalanceInput /> },
    { path: "/Adjustment", component: <AdjustmentGrid /> },
    { path: "/AddAdjustment", component: <AdjustmentInput /> },
    { path: "/Journal", component: <JournalGrid /> },
    { path: "/AddJournal", component: <JournalInput /> },
    { path: "/NotFound", component: <NotFound /> },
    { path: "/DeletePurchase", component: <PurchaseDeleteDetails /> },
    { path: "/DeletedSales", component: <DeletedSales /> },
    { path: "/TotalStock", component: <TStock /> },
    { path: "/Stocktransfer", component: <StockTransfer /> },
    { path: "/StockTransferTemplat", component: <StockTransferTemplate /> },
    { path: "/BaseAccount", component: <BaseAccount /> },
    { path: "/AddBaseAccount", component: <AddBaseAcc /> },
    { path: "/UserAccountGroup", component: <UserAccGrpGrid /> },
    { path: "/AddUserAccGrp", component: <UserAccInput /> },
    { path: "/StandardAccount", component: <StandardAcc /> },
    { path: "/AddStandardAccount", component: <StdAccInput /> },
    { path: "/AccountName", component: <AccNameGrid /> },    
    { path: "/AddAccountName", component: <AccNameInput /> },
    { path: "/DeliveryChallan", component: <DeliveryChallan /> },
    { path: "/Quotation", component: <Quotation /> },
    { path: "/AddBankAccount", component: <BankAccInput /> },
    { path: "/BankAccount", component: <BankAccGrid /> },
    { path: "/CurrentStock", component: <Cstock /> },
    { path: "/PurchaseOrder", component: <PurchaseOrder /> },
    { path: "/TaxInvoice", component: <TaxInvoice /> },
    { path: "/Product", component: <Product /> },
    { path: "/AddProductDetail", component: <ProductDetail /> },
    { path: "/AddProductHdr", component: <ProductHdr /> },
    { path: "/POanalysis", component: <PurchaseOrderAnalysis/>},
    { path: "/TIanalysis", component: <TaxInvoiceanalysis/>},
    { path: "/DCanalysis", component: <DCanalysis/>},
    { path: "/QOanalysis", component: <QOanalysis/>},
    { path: "/UnplannedIssued", component: <UnplannedIssued/>},
    { path: "/UnplannedReturn", component: <UnplannedReturn/>},
    { path: "/UnplannedReceipt", component: <UnplannedReceipt/>},
    { path: "/InvReceiptPrint", component: <InvReceiptPrint/>},
    { path: "/InvReturnPrint", component: <InvReturnPrint/>},
    { path: "/InvIssuedPrint", component: <InvIssuedPrint/>},
    { path: "/EmployeeInfo", component: <Employee/>},
    { path: "/EmployeeInputInfo", component: <EmployeeInput/>},
    { path: "/BarcodeGenerator", component: <BarcodeGenerator/>},
    { path: "/BarcodeScanner", component: <BarcodeScanner/>},
    { path: "/AddDepartment", component: <DepartmentInput/>},
    { path: "/Department", component: <Department/>},
    { path: "/DesgiantionInfo", component: <Desgination/>},
    { path: "/AddDesgination", component: <DesginationInput/>},
    { path: "/AdjustmnetPrint", component: <AdjustmnetPrint/>},
    { path: "/ObPrint", component: <ObPrint/>},
    { path: "/JournalPrint", component: <JournalPrint/>},
    { path: "/GSTReport", component: <GSTReport/>},
    { path: "/OIAnalysis", component: <OpeningItemAnalysis/>},
     { path: "/DataWiseStock", component: <DataWiseStock/>},
     { path: "/PendingCustomer", component: <PendingCustomer/>},
     { path: "/PendingCustomer", component: <PendingCustomer/>},
     { path: "/Salessettings", component: <Salessettings/>},
     { path: "/ReceivedGoods", component: <ReceivedGoods/>},
     { path: "/ReceivedGoodsRt", component: <ReceivedGoodsRt/>},
     { path: "/PurchaseSetting", component: <PurchaseSetting/>},
     { path: "/POsettings", component: <POsettings/>},
     { path: "/InvoiceSettings", component: <InvoiceSettings/>},
     { path: "/Validation", component: <Validation/>},
     { path: "/ValidationGrid", component: <ValidationGrid/>},
     { path: "/PayslipReport", component: <PayslipReport/>},
     { path: "/FinancialYearAccess", component: <FinancialYearAccess/>},
     { path: "/AddFYA", component: <AddFinancialYearAccess/>},
     { path: "/PayslipDash", component: <PayslipDash/>},
     { path: "/TemplateDesign", component: <PrintTemplate /> },
     { path: "/WeekOff", component: <WeekOff /> },
     { path: "/ClientInfo", component: <ClientInfo /> },
     { path: "/ADDClientInfo", component: <ADDClientInfo /> },
     { path: "/Payment", component: <Payment /> },
  ];
 
  return (
    <Router>
        <PathLogger />
        <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/TaxInvoiceTemplate1" element={<TaxInvoiceTemplate1 />} />
      <Route path="/TaxInvoiceTemplate2" element={<TaxInvoiceTemplate2 />} />
      <Route path="/ProformaInvoiceTemplate1" element={<PerformaInvoiceTemplate1 />} />
      <Route path="/ProformaInvoiceTemplate2" element={<PerformaInvoiceTemplate2 />} />
      <Route path="/QuotationTemplate1" element={<QuotationTemplate1 />} />
      <Route path="/QuotationTemplate2" element={<QuotationTemplate2 />} />
      <Route path="/PurchaseOrderTemplate1" element={<PurchaseOrderTemplate1 />} />
      <Route path="/PurchaseOrderTemplate2" element={<PurchaseOrderTemplate2 />} />
      <Route path="/DeliveryChallanTemplate1" element={<DeliveryChallanTemplate1 />} />
      <Route path="/DeliveryChallanTemplate2" element={<DeliveryChallanTemplate2 />} />

      <Route
        path="/AccountInformation"
        element={
          <div>
            <Topbar />
            <div className="layout-container ">
              <SideBar className="sidebar"/>
              <div className=" container-fluid ">
                <AccountInformation />
              </div>
            </div>
          </div>
        }
      />
      
      {routes.map(({ path, component }) =>
        screenTypes.includes(path.replace('/', '')) ? (
          path.includes('Print') ? (
            <Route
              key={path}
              path={path}
              element={
                <div className="px-4">{component}</div>
              }
            />
          ) : (
            <Route
              key={path}
              path={path}
              element={
                <div>
                  <Topbar />
                  <div className="layout-container">
                    <SideBar className="sidebar" />
                      <div className="container-fluid">{component}</div>
                  </div>
                </div>
              }
            />
          )
        ) : (
          <Route
            key={path}
            path={path}
            element={
              <div>
                <SideBar className="sidebar" />
                <Topbar />
                <div className="layout-container">
                  <div className="container-fluid ">
                    <NotFound />
                  </div>
                </div>
              </div>
            }
          />
        )
      )}
    </Routes>
  </Router>
  );
}

const PathLogger = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    sessionStorage.setItem('currentPath', currentPath);
  }, [location]); 

  return null; 
};

export default Main;

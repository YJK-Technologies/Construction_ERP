import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import AppContent from './App_content';
import ForgotPopup from "./Forgotpopup";
import Select from 'react-select';
import { Cursor } from 'react-bootstrap-icons';

const config = require('./Apiconfig');

const SettingsPage = () => {
    // Example state for settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('en');
    const [open, setOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [perioddrop, setPerioddrop] = useState([]);
    const [selectedPurchasePeriod, setSelectedPurchasePeriod] = useState('');
    const [purchasePeriod, setPurchasePeriod] = useState("");
    const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('');
    const [salesPeriod, setSalesPeriod] = useState("");
    const [salesCustomDateRange, setSalesCustomDateRange] = useState({ from: '', to: '' });
    const [selectedOption, setSelectedOption] = useState('')


    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDateRange`)
            .then((data) => data.json())
            .then((val) => {
                setPerioddrop(val);

                if (val.length > 0) {
                    const firstOption = {
                        value: val[0].Sno,
                        label: val[0].DateRangeDescription,
                    };
                    setSelectedPurchasePeriod(firstOption);
                    setSelectedSalesPeriod(firstOption);
                    setPurchasePeriod(firstOption.value);
                    setSalesPeriod(firstOption.value);
                }
            });
    }, []);

    const handleSalesCustomDateChange = (e) => {
        const { name, value } = e.target;
        setSalesCustomDateRange((prevRange) => ({
            ...prevRange,
            [name]: value
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const handleLanguage = (e) => {
        setLanguage(e.target.value);
    };

    const filteredOptionPeriod = perioddrop.map((option) => ({
        value: option.Sno,
        label: option.DateRangeDescription,
    }));

    return (
        <div className="container-fluid Topnav-screen">
            <div align="right">
                <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex justify-content-start">
                            <h1 className="purbut">Item Settings</h1>
                        </div>
                        <div className="d-flex justify-content-end me-5 purbut">
                            <button className="btn btn-success mt-2 mb-2  purbut" style={{ cursor: "pointer" }} title="Save settings">
                                Save
                            </button>
                        </div>
                    </div>


                    <div className="mobileview">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                                <h1 className="">Item Settings</h1>
                            </div>
                            <div className="d-flex justify-content-end ms-0">
                                <div className="dropdown mt-2 me-5 ms-3" style={{ paddingLeft: 0 }}>
                                    <button className="btn btn-primary dropdown-toggle p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa-solid fa-list"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <icon className="icon text-dark text-center fs-1" onClick={handleOpen} title="reset password">
                                            <i className="fa-solid fa-lock-open"></i>
                                        </icon>
                                        <icon className="icon text-success text-center fs-1" title="save">
                                            <i class="fa-solid fa-floppy-disk"></i>
                                        </icon>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shadow-lg p-1 bg-body-tertiary rounded mb-2 mt-2">
                <div className="row mt-4 p-2 ms-4">

                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="Iourbrand" class="exp-form-labels">
                                Our Brand
                            </label>
                            <div title="Select the Own Brand">
                                <Select
                                    id="ahsts"
                                    isClearable
                                    value={selectedCompany}
                                    onChange={handleCompanyChange}
                                    options={filteredOptionPeriod}
                                    className="exp-input-field"
                                    placeholder=""
                                    maxLength={30}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

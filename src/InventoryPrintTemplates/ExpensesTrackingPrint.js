import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExpensesTrackingPrint = () => {
  const componentRef = useRef();
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const reportData = sessionStorage.getItem(
      "ExpensesTrackingData"
    );

    if (reportData) {
      const parsedData = JSON.parse(reportData);

      setCompanyName(parsedData.companyName);
      setStartDate(parsedData.start_Date);
      setEndDate(parsedData.end_Date);
      setTotalAmount(parsedData.totalAmount);
      setData(parsedData.rows);
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Expenses Tracking Report",
  });

  const handleDownload = async () => {
    const input = componentRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save("ExpensesTrackingReport.pdf");
  };

  return (
    <>
      <div
        ref={componentRef}
        style={{
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Expenses Tracking Report
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <p>
            <strong>Company Name:</strong> {companyName}
          </p>

          <p>
            <strong>Date Range:</strong> {startDate} to {endDate}
          </p>
        </div>

        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >

          <thead>
            <tr>
              <th style={{ width: "50px" }}>S.No</th>
              <th style={{ width: "200px" }}>Expense Date</th>
              <th>Expense No</th>
              <th>Expense Type</th>
              <th>Reference Code</th>
              <th>Reference Name</th>
              <th>Payment Mode</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.expense_date}</td>
                <td>{row.expense_no}</td>
                <td>{row.expense_type}</td>
                <td>{row.reference_code}</td>
                <td>{row.reference_name}</td>
                <td>{row.payment_mode}</td>
                <td>{row.amount}</td>
              </tr>
            ))}

            <tr>
              <td colSpan="7" style={{ textAlign: "right", fontWeight: "bold" }}>
                Total
              </td>

              <td style={{ fontWeight: "bold" }}>
                {totalAmount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="d-flex justify-content-center mt-3"
      >
        <button
          onClick={handleDownload}
          className="PrintButton"
        >
          <FontAwesomeIcon
            icon="fa-solid fa-download"
          />
        </button>

        <button
          onClick={handlePrint}
          className="PrintButton ms-2"
        >
          <FontAwesomeIcon
            icon="fa-solid fa-print"
          />
        </button>
      </div>
    </>
  );
};

export default ExpensesTrackingPrint;
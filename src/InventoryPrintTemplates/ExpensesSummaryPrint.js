import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExpensesSummaryPrint = () => {
    const componentRef = useRef();

    const [companyName, setCompanyName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const reportData = sessionStorage.getItem(
            "ExpensesSummaryPDF"
        );

        if (reportData) {
            const parsedData = JSON.parse(reportData);

            setCompanyName(parsedData.companyName);
            setStartDate(parsedData.start_Date);
            setEndDate(parsedData.end_Date);

            setColumns(parsedData.columns || []);
            setRows(parsedData.rows || []);
        }
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Expense Summary Report",
    });

    const handleDownload = async () => {
        const input = componentRef.current;

        const canvas = await html2canvas(input, {
            scale: 2,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF(
            "l",
            "mm",
            "a4"
        );

        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            (canvas.height * pdfWidth) /
            canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

        pdf.save(
            "ExpenseSummaryReport.pdf"
        );
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
                    Expense Summary - Site Wise
                </h2>

                <div
                    style={{
                        marginBottom: "20px",
                    }}
                >
                    <p>
                        <strong>
                            Company Name :
                        </strong>{" "}
                        {companyName}
                    </p>

                    <p>
                        <strong>
                            Date Range :
                        </strong>{" "}
                        {startDate} to {endDate}
                    </p>
                </div>

                <table
                    border="1"
                    cellPadding="8"
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse",
                        fontSize: "12px",
                    }}
                >
                    <thead>
                        <tr>
                            {columns.map(
                                (
                                    col,
                                    index
                                ) => (
                                    <th
                                        key={
                                            index
                                        }
                                    >
                                        {
                                            col.headerName
                                        }
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map(
                            (
                                row,
                                rowIndex
                            ) => (
                                <tr
                                    key={
                                        rowIndex
                                    }
                                >
                                    {columns.map((col, colIndex) => (
    <td key={colIndex}>
        {col.headerName === "S.No"
            ? (row.site_name === "Total" ? "" : rowIndex + 1)
            : row[col.field]}
    </td>
))}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <button
                    onClick={
                        handleDownload
                    }
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

export default ExpensesSummaryPrint;
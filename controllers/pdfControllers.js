import TravelRecord from "../models/TravelModel.js";
import userModel from "../models/UserModel.js";
import PDFDocument from "pdfkit";
import moment from "moment-timezone";

export const pdfControllers = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      year,
      month,
      companyName,
      companyAddress,
      transport,
      customerVisited,
    } = req.params;

    const user = await userModel.findById(userId);

    const startDate = moment({ year, month });
    const endDate = startDate.clone().endOf("month");
    const travelRecords = await TravelRecord.find({
      userId,
      startDate: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    const doc = new PDFDocument({ size: "letter", layout: "landscape" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="travel_report_${year}_${month}.pdf`
    );

    doc.pipe(res);

    const tableHeaders = [
      "Date",
      "Time(min)",
      "From",
      "To",
      "Customers Visited",
      "Transport Used",
      "KM Reading",
      "Total KM",
      "Amount",
    ];
    const tableWidth = doc.page.width - 2 * 10;
    const tableX = (doc.page.width - tableWidth) / 2;
    const cellWidth = tableWidth / tableHeaders.length;
    const columnMargin = 0;
    let rowY = doc.y;

    const addNewPage = () => {
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(companyName, { align: "center" });
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(companyAddress, { align: "center" });
      doc.moveDown();

      const y = doc.y;
      doc.font("Helvetica-Bold").fontSize(12).text("Name of Employee:", 30, y);
      doc.font("Helvetica").text(user.name, 145, y);
      doc.font("Helvetica-Bold").text("Vehicle Number:", 30, y + 20);
      doc.font("Helvetica").text(user.vehicleNumber, 130, y + 20);
      doc.moveDown();

      const pageWidth = doc.page.width - 2 * 10;
      const statementCenterX = pageWidth / 2;

      const underlineText = (text, x, y, lineWidth) => {
        const textWidth = doc.widthOfString(text);
        doc.font("Helvetica-Bold").fontSize(13).text(text, x, y);
        doc.lineWidth(lineWidth);
        doc
          .moveTo(x, y + 15)
          .lineTo(x + textWidth + 20, y + 15)
          .stroke();
      };
      underlineText("Travelling Statement", statementCenterX - 30, doc.y, 1.5);

      doc.moveDown();
      rowY = doc.y;
      doc.font("Helvetica-Bold");
      tableHeaders.forEach((header, index) => {
        const xPosition = tableX + index * cellWidth + index * columnMargin;
        doc.text(header, xPosition, rowY, {
          width: cellWidth,
          align: "center",
        });
      });
      doc.moveDown();
    };

    const checkPageOverflow = (spaceRequired) => {
      if (rowY + spaceRequired > doc.page.height - doc.page.margins.top) {
        doc.addPage({ layout: "landscape", size: "letter" });
        addNewPage();
      }
    };

    addNewPage();

    travelRecords.forEach((record) => {
      doc.font("Helvetica");
      const rowData = [
        moment(record.startDate).format("MM/DD/YYYY"),
        `${record.travelTime}`,
        record.startLocationName,
        record.endLocationName,
        customerVisited,
        transport,
        `${record.otherData.openingReading} - ${record.otherData.closingReading}`,
        record.distance.toString(),
        record.Amount,
      ];

      rowY = doc.y + 10;

      rowData.forEach((data, index) => {
        const xPosition = tableX + index * cellWidth + index * columnMargin;
        doc.text(data, xPosition, rowY, { width: cellWidth, align: "center" });
      });

      checkPageOverflow(50);
      doc.moveDown();
    });

    doc.end();
    doc.on("finish", () => {
      res.status(200).send({ message: "PDF Created Successfully." });
    });
  } catch (error) {
    res.status(500).send({
      message: `An error occurred while generating the PDF. ${error}`,
    });
  }
};

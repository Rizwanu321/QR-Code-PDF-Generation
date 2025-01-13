import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "https://qr-code-pdf-generation-server.onrender.com/api/vouchers/list",
        {
          withCredentials: true,
        }
      );
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const generateVoucher = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://qr-code-pdf-generation-server.onrender.com/api/vouchers/generate",
        {},
        { withCredentials: true }
      );
      await fetchVouchers();
      setSuccessMessage("Voucher generated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error generating voucher:", error);
    }
    setLoading(false);
  };

  const downloadPDF = async (id) => {
    try {
      const response = await axios.get(
        `https://qr-code-pdf-generation-server.onrender.com/api/vouchers/pdf/${id}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `voucher-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Voucher Dashboard</h1>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      <button
        onClick={generateVoucher}
        disabled={loading}
        className="mb-8 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Generating...
          </>
        ) : (
          "Generate New Voucher"
        )}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="p-4 border rounded shadow bg-white">
            <div className="space-y-4">
              <div>
                <p className="font-bold">Number: {voucher.number}</p>
                <p className="text-sm">
                  Generated:{" "}
                  {new Date(voucher.generated_date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Expires: {new Date(voucher.expiry_date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      voucher.status === "ACTIVE"
                        ? "text-green-600"
                        : voucher.status === "EXPIRED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {voucher.status || "N/A"}
                  </span>
                </p>
              </div>

              {voucher.qr_code && (
                <div className="flex justify-center">
                  <img
                    src={voucher.qr_code}
                    alt={`QR Code for voucher ${voucher.number}`}
                    className="w-32 h-32 object-contain"
                  />
                </div>
              )}

              <button
                onClick={() => downloadPDF(voucher.id)}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

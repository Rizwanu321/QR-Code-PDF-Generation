import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [settings, setSettings] = useState({
    title: "",
    max_expiry_days: 30,
    voucher_width: 210,
    voucher_height: 297,
    title_font_size: 25,
    text_font_size: 12,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("https://qr-code-pdf-generation-server.onrender.com/api/settings", {
        withCredentials: true,
      });
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("https://qr-code-pdf-generation-server.onrender.com/api/settings", settings, {
        withCredentials: true,
      });
      setMessage("Settings updated successfully");
    } catch (error) {
      setMessage("Error updating settings");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Voucher Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Voucher Title
            </label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) =>
                setSettings({ ...settings, title: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Expiry Days
            </label>
            <input
              type="number"
              value={settings.max_expiry_days}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  max_expiry_days: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Width (mm)
              </label>
              <input
                type="number"
                value={settings.voucher_width}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    voucher_width: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Height (mm)
              </label>
              <input
                type="number"
                value={settings.voucher_height}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    voucher_height: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title Font Size
              </label>
              <input
                type="number"
                value={settings.title_font_size}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    title_font_size: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Text Font Size
              </label>
              <input
                type="number"
                value={settings.text_font_size}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    text_font_size: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {message && (
            <div
              className={`text-center p-2 rounded ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;

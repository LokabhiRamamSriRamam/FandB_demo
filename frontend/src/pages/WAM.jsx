import React, { useEffect, useState } from "react";
import axios from "axios";

const WAM = () => {
  const [config, setConfig] = useState({
    restaurant_name: "",
    phone_number: "",
    events: {
      orderPlaced: {
        enabled: false,
        messageType: "text",
        template: "",
        imageUrl: "",
      },
      orderConfirmed: {
        enabled: false,
        messageType: "text",
        template: "",
        imageUrl: "",
      },
      orderCompleted: {
        enabled: false,
        messageType: "text",
        template: "",
        imageUrl: "",
      },
      paymentReceived: {
        enabled: false,
        messageType: "text",
        template: "",
        imageUrl: "",
        documentUrl: "",
        fileName: "",
      },
    },
  });

  const [loading, setLoading] = useState(true);

  // Fetch config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/message-config");
        if (res.data) setConfig(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (field, value, eventKey) => {
    if (eventKey) {
      setConfig((prev) => {
        let updatedEvent = { ...prev.events[eventKey], [field]: value };

        // Clear fields when messageType changes
        if (field === "messageType") {
          if (value === "text") {
            updatedEvent = {
              ...updatedEvent,
              imageUrl: "",
              documentUrl: "",
              fileName: "",
            };
          } else if (value === "image") {
            updatedEvent = { ...updatedEvent, documentUrl: "", fileName: "" };
          } else if (value === "document") {
            updatedEvent = { ...updatedEvent, imageUrl: "" };
          }
        }

        return {
          ...prev,
          events: {
            ...prev.events,
            [eventKey]: updatedEvent,
          },
        };
      });
    } else {
      setConfig((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const cleanedConfig = {
        ...config,
        events: Object.fromEntries(
          Object.entries(config.events).map(([key, event]) => {
            let newEvent = { ...event };
            if (event.messageType === "text") {
              newEvent.imageUrl = "";
              newEvent.documentUrl = "";
              newEvent.fileName = "";
            } else if (event.messageType === "image") {
              newEvent.documentUrl = "";
              newEvent.fileName = "";
            } else if (event.messageType === "document") {
              newEvent.imageUrl = "";
            }
            return [key, newEvent];
          })
        ),
      };

      if (cleanedConfig._id) {
        await axios.put(
          `http://localhost:5000/api/message-config/${cleanedConfig._id}`,
          cleanedConfig
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/message-config",
          cleanedConfig
        );
      }
      alert("Configuration saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving config.");
    }
  };

  const renderPreview = (eventKey) => {
    const event = config.events[eventKey];
    const text = event.template
      .replace("{{customer_name}}", "John Doe")
      .replace("{{order_id}}", "O1005");

    if (event.messageType === "image")
      return (
        <div>
          <img
            src={event.imageUrl || "https://via.placeholder.com/150"}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mb-2"
          />
          <p>{text}</p>
        </div>
      );

    if (event.messageType === "document")
      return (
        <div className="text-sm">
          📄 <b>Document:</b> {event.fileName || "file.pdf"}
          <br />
          <p>{text}</p>
        </div>
      );

    return <p>{text}</p>;
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Message Configuration</h2>

      <div className="flex flex-col gap-4">
        <input
          className="border p-2 rounded-md"
          value={config.restaurant_name}
          onChange={(e) => handleChange("restaurant_name", e.target.value)}
          placeholder="Restaurant Name"
        />

        <input
          className="border p-2 rounded-md"
          value={config.phone_number}
          onChange={(e) => handleChange("phone_number", e.target.value)}
          placeholder="WhatsApp Number"
        />
      </div>

      {/* Events */}
      {Object.keys(config.events).map((key) => {
        const event = config.events[key];

        return (
          <div key={key} className="border p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={event.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked, key)}
              />
              <h3 className="font-semibold text-lg">{key}</h3>
            </div>

            {/* Message Type Selector */}
            <select
              className="border p-2 rounded mt-2"
              value={event.messageType}
              onChange={(e) => handleChange("messageType", e.target.value, key)}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              {key === "paymentReceived" && (
                <option value="document">Document</option>
              )}
            </select>

            {/* Template */}
            <textarea
              className="border p-2 rounded w-full mt-2"
              rows={3}
              value={event.template}
              onChange={(e) => handleChange("template", e.target.value, key)}
            />

            {/* Image URL field */}
            {event.messageType === "image" && (
              <input
                className="border p-2 rounded w-full mt-2"
                placeholder="Image URL"
                value={event.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value, key)}
              />
            )}

            {/* Document fields (only for paymentReceived) */}
            {event.messageType === "document" && key === "paymentReceived" && (
              <>
                <input
                  className="border p-2 rounded w-full mt-2"
                  placeholder="Document URL"
                  value={event.documentUrl}
                  onChange={(e) =>
                    handleChange("documentUrl", e.target.value, key)
                  }
                />
                <input
                  className="border p-2 rounded w-full mt-2"
                  placeholder="File Name (e.g., receipt.pdf)"
                  value={event.fileName}
                  onChange={(e) =>
                    handleChange("fileName", e.target.value, key)
                  }
                />
              </>
            )}

            {/* WhatsApp Preview */}
            <div className="mt-4 bg-gray-100 p-3 rounded border">
              <div className="text-gray-500 text-sm mb-1">Preview:</div>
              {renderPreview(key)}
            </div>
          </div>
        );
      })}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded-md"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default WAM;

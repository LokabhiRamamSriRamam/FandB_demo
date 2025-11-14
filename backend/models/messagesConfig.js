import mongoose from "mongoose";

const messageConfigSchema = new mongoose.Schema({
  restaurant_name: { type: String, required: true },
  phone_number: { type: String, required: true },

  events: {
    orderPlaced: {
      enabled: { type: Boolean, default: false },
      messageType: { type: String, default: "text" }, // text/image
      template: { type: String, default: "Hi {{customer_name}}, your order {{order_id}} has been placed successfully!" },
      imageUrl: { type: String, default: "" }
    },
    orderConfirmed: {
      enabled: { type: Boolean, default: false },
      messageType: { type: String, default: "text" },
      template: { type: String, default: "Hi {{customer_name}}, your order {{order_id}} is confirmed!" },
      imageUrl: { type: String, default: "" }
    },
    orderCompleted: {
      enabled: { type: Boolean, default: false },
      messageType: { type: String, default: "text" },
      template: { type: String, default: "Hi {{customer_name}}, your order {{order_id}} is ready!" },
      imageUrl: { type: String, default: "" }
    },
    paymentReceived: {
      enabled: { type: Boolean, default: false },
      messageType: { type: String, default: "text" }, // text/image/document
      template: { type: String, default: "Payment received for order {{order_id}}. Thank you!" },
      imageUrl: { type: String, default: "" },
      documentUrl: { type: String, default: "" },
      fileName: { type: String, default: "" }
    },
  },
}, { timestamps: true });


export default mongoose.model("MessageConfig", messageConfigSchema);


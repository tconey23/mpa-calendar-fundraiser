import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

const PaypalDonate = ({ donateAmount, setTransactionStatus }) => {
      //AfaEZx7-0WTz8f6bMUU2_JL9G6qernoKCZkyri7JK6ZWvPCqMxVL5IwPPAegMM0N8aSc5G0Mc4KUcszo

      const [clientID] = useState('test')

    return (
        <PayPalScriptProvider options={{ 
            "client-id": clientID,
            "disable-funding": "paylater,venmo",
            }}>
            <PayPalButtons
  style={{ shape: "rect", layout: "vertical", label: "donate" }}
  createOrder={async () => {
    const response = await fetch("http://localhost:3002/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donationAmount: donateAmount, // Example amount
        donorName: "John Doe",
        donorMessage: "Supporting the cause!",
      }),
    });
    const orderData = await response.json();
    return orderData.id;
  }}
  onApprove={async (data) => {
    const response = await fetch(`http://localhost:3002/api/donate/${data.orderID}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const captureData = await response.json();
    if (captureData.status === "COMPLETED") {
      console.log("Donation successful!", captureData);
    }
  }}
/>
        </PayPalScriptProvider>
    );
};

export default PaypalDonate;

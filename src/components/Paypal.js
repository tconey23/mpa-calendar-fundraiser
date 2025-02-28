import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { Stack } from "@mui/material";

function Message({ content }) {
    return <p>{content}</p>;
  }

const Paypal = ({donateAmount, setTransactionStatus}) => {
    const initialOptions = {
        "client-id": "test",
        "enable-funding": "card",
        "disable-funding": "paylater,venmo",
        "data-sdk-integration-source": "integrationbuilder_sc",
      };
    
      const [message, setMessage] = useState("");
      const [YOUR_PRODUCT_ID] = useState(12345)
      const [YOUR_PRODUCT_QUANTITY] = useState(1)

      const [isDev, setIsDev] = useState(false);
      const [endpoint, setEndpoint] = useState("https://mpa-fundraiser-be-ebd9ad3480fa.herokuapp.com/api");
      
      useEffect(() => {
        setEndpoint(isDev ? "http://localhost:8888/api" : "https://mpa-fundraiser-be-ebd9ad3480fa.herokuapp.com/api");
      }, [isDev]);

      useEffect(() => {
        console.clear()
        console.log(typeof donateAmount, donateAmount)
      }, [donateAmount])
      

      return (
        <div className="App">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{
                shape: "rect",
                layout: "vertical",
              }}
              createOrder={async () => {
                try {
                  const response = await fetch(`${endpoint}/orders`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart: [
                            {
                              id: YOUR_PRODUCT_ID,
                              quantity: YOUR_PRODUCT_QUANTITY,
                              unit_amount: {
                                currency_code: "USD",
                                value: donateAmount,
                              },
                            },
                          ],
                    }),
                  });
    
                  const orderData = await response.json();
                  console.log(orderData)
                  if (orderData.id) {
                    return orderData.id;
                  } else {
                    const errorDetail = orderData?.details?.[0];
                    const errorMessage = errorDetail
                      ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                      : JSON.stringify(orderData);
    
                    throw new Error(errorMessage);
                  }
                } catch (error) {
                  console.error(error);
                  setMessage(`Could not initiate PayPal Checkout...${error}`);
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  const response = await fetch(
                    `${endpoint}/orders/${data.orderID}/capture`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    },
                  );
    
                  const orderData = await response.json();
                  // Three cases to handle:
                  //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  //   (2) Other non-recoverable errors -> Show a failure message
                  //   (3) Successful transaction -> Show confirmation or thank you message
    
                  const errorDetail = orderData?.details?.[0];
    
                  if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                    // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                    return actions.restart();
                  } else if (errorDetail) {
                    // (2) Other non-recoverable errors -> Show a failure message
                    throw new Error(
                      `${errorDetail.description} (${orderData.debug_id})`,
                    );
                  } else {
                    // (3) Successful transaction -> Show confirmation or thank you message
                    // Or go to another URL:  actions.redirect('thank_you.html');
                    const transaction =
                      orderData.purchase_units[0].payments.captures[0];
                    setTransactionStatus(transaction.status)
                    console.log(transaction)
                  }
                } catch (error) {
                  console.error(error);
                  setTransactionStatus(error)
                }
              }}
            />
          </PayPalScriptProvider>
          <Message content={message} />
        </div>
      );
};

export default Paypal;

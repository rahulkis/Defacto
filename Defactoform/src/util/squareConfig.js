const config = {
  // Initialize the payment form elements

  //TODO: Replace with your sandbox application ID
  applicationId: "sandbox-sq0idb-U6JMPsj3ZhUG11rDvFGMkg",
  inputClass: "sq-input",
  autoBuild: false,
  // Customize the CSS for SqPaymentForm iframe elements
  inputStyles: [
    {
     fontSize: "16px",
    fontFamily: "sans-serif",
    fontWeight: "300",
    backgroundColor: "#FFF",
    padding: "9px 0",
    color: "#4d7cea",
    },
  ],
  // Initialize the credit card placeholders
  cardNumber: {
    elementId: "sq-card-number",
    // placeholder: "Card Number",
  },
  cvv: {
    elementId: "sq-cvv",
    // placeholder: "CVV",
  },
  expirationDate: {
    elementId: "sq-expiration-date",
    placeholder: "MM/YY",
  },
  postalCode: {
    elementId: "sq-postal-code",
    // placeholder: "Postal",
  },
  // SqPaymentForm callback functions
  callbacks: {
    /*
     * callback function: cardNonceResponseReceived
     * Triggered when: SqPaymentForm completes a card nonce request
     */
    cardNonceResponseReceived: function(errors, nonce, cardData) {
      if (errors) {
        // Log errors from nonce generation to the browser developer console.
        console.error("Encountered errors:");
        // errors.forEach(function(error) {
        //   console.error("  " + error.message);
        // });
        let errorString = "Encountered errors," + '\n';
        errors.forEach(function(error) {
            errorString +=  "" + error.message + '\n'; // concate errors list
            console.error("  " + error.message);
        });
        alert(errorString) 
        // alert(
        //   "Encountered errors, check browser developer console for more details"
        // );
        return 'sdfsdf';
      } else {
          console.log(nonce)
          return nonce;
      }
      
    },
  },
};

export default config;

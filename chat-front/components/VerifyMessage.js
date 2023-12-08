import React, { forwardRef, useImperativeHandle } from 'react';

const VerifyMessage = forwardRef(function SuggestedMessages(props, ref) {
  useImperativeHandle(ref, () => {
    let isMessagesVerify = document.getElementById("isVerifyMessages").checked
    return {
      messageVerified: function(prompt) {
        return new Promise((resolve, reject) => {
          if (isMessagesVerify) {
            let body = {
              "temperature": 0.1,
              "prompt":
                "Réponds juste vrai ou faux : " + prompt
            };
      
            fetch("http://localhost:5001/api/v1/generate", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }).then((res) => res.json()).then(data => {
              resolve(data.results[0].text.toLowerCase().substring(0, 4))
            })
          } else {
            resolve("none")
          }
        })
      }
    }
  })

  return (
    <div className="justify-center flex gap-x-2">
        <label htmlFor="verify">Verifier les informations</label>
        <input type="checkbox" name="isVerifyMessages" id="isVerifyMessages" />
    </div>
  );
})

export default VerifyMessage;
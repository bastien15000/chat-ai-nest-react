import React, { forwardRef, useImperativeHandle } from 'react';

const LanguageForm = forwardRef(function LanguageForm(props, ref) {
  useImperativeHandle(ref, () => {
    return  {
      traduceMessage: function(language, message) {
        let body = {
          "temperature": 0,
          "prompt":
            "Traduce all after the line break in " + language + ":\n" + message
        }
    
        fetch("http://localhost:5001/api/v1/generate", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then((res) => res.json()).then(data => {
          var content = data.results[0].text
          props.messageToServer(content)
        })
      }
    }
  })
  return (
    <form id="choice-langue" className="flex gap-x-3 justify-center">
      <label>Traduction : </label>
      <select name="language" id="language-select">
        <option value="none" selected>None</option>
        <option value="english">English</option>
        <option value="french">French</option>
      </select>
    </form>
  );
})

export default LanguageForm;
import React, { forwardRef, useImperativeHandle } from 'react';

const SuggestedMessages = forwardRef(function SuggestedMessages(props, ref) {
    useImperativeHandle(ref, () => {
        const nodeSuggestedMessages = document.getElementById("suggestedMessages")
      return {
        getSuggestions(messages) {
            let messagesContentArray = messages.map(message => {
                return message.content
            })
            
            let messagesContentString = messagesContentArray.join("\n")
            let body = {
                temperature: 0.1,
                "prompt":
                    "Donne moi 3 suggestions de réponse allant de 1 à 3 mots par rapport à cette discussion : " + messagesContentString
            }
            fetch("http://localhost:5001/api/v1/generate", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((res) => res.json()).then(data => {
                let suggestionsMessage = data.results[0].text.split("\n").shift()
                suggestionsMessage.forEach((suggest, index) => {
                    nodeSuggestedMessages.querySelector("button:nth-child(" + (index + 1) + ")").textContent = suggest
                });
            })
        }
      };
    }, []);


  const handleSuggestMessage = (e) => {
    props.getSuggestedMessage(e.target.textContent)
  }

  return (
    <div id="suggestedMessages" className='flex w-50 justify-center flex-col gap-y-4 mt-4'>
        <button onClick={handleSuggestMessage} className="w-33 bg-black px-4 py-2 rounded-lg">TEST</button>
        <button onClick={handleSuggestMessage} className="w-33 bg-black px-4 py-2 rounded-lg">PIZZA</button>
        <button onClick={handleSuggestMessage} className="w-33 bg-black px-4 py-2 rounded-lg">POULET</button>
    </div>
  );
})

export default SuggestedMessages;
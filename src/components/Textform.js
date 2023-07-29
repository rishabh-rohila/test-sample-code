import React, { useState, useEffect,} from "react";
import { debounce } from 'lodash';
import { evaluate } from 'mathjs';



export default function Textform(props) {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
 
 
  
  
  // Clear Text Box 
  const handleClearText = () => {
    setText("");
    // console.log("Clear Text clicked")
  };

  // Copy Text from Text Box 
  const handleCopyText = (event) => {
    navigator.clipboard.writeText(text);
    const message = "Your Message has Copied";
    alert(message);
    // console.log("Copy Text clicked")
  };

   // UPPERCASE Conversion text in Text Box 
  const handleUpperClick = () => {
    let newText = text.toUpperCase();
    setText(newText);
    // console.log("UPPERCASE clicked")
  };
  
  // lowercase Conversion text in Text Box 
  const handleLowerClick = () => {
    let newText = text.toLowerCase();
    setText(newText);
    // console.log("lowercase clicked")
  };
  
  // Sentance case Conversion text in Text Box 
  const handleSentenceClick = () => {
    let sentenceCase =
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    let newCase = sentenceCase.replace(
      /([.!?]+\s*)(\w)/g,
      (match, punctuation, nextChar) => {
        return punctuation + nextChar.toUpperCase();
      }
    );
    setText(newCase);
    // console.log("Sentence case clicked")
  };
  
  // Bold Text and normal text name Conversion in button
  const [isBold, setIsBold] = useState(false);
  const handleBoldClick = () => {
    setIsBold(!isBold);
  };
   
  // Italic Text and normal text name Conversion in button 
  const [isItalic, setIsItalic] = useState(false);
  const handleItalicClick = () => {
    setIsItalic(!isItalic);
  };

  // Underline Text and normal text name Conversion in button 
  const [isUnderline, setIsUnderline] = useState(false);
  const handleUnderlineClick = () => {
    setIsUnderline(!isUnderline);
  };

  const [isStrike, setIsStrike] = useState(false);
  const handleStrikeClick = () => {
    setIsStrike(!isStrike);
};
  
  // Bold Text Conversion in Text Box
  // Italic Text Conversion in Text Box
  // Underline Text Conversion in Text Box
  // Strike Text Conversion in Text Box
  const textStyle = {
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: `${isUnderline ? 'underline ' : ''}${isStrike ? 'line-through' : ''}`,
    backgroundColor: "#d7e4fa"
  };
  

  // Speak Whole Text in Text Box 
  const handleSpeakClick = () => {
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
    setIsSpeaking(true);
  
  // when Speaking start speak button disabled and pause and resume button show up (child)
  const button = document.getElementById("speaknow");
    button.disabled = true;
  // when Speaking ended speak button enable 
    speech.onend = () => {
      setIsSpeaking(false);
      button.disabled = false;
    };
  };

  // pause clicked - resume enable and pause disabled 
  const handlePauseClick = debounce(() => {
    speechSynthesis.pause();
    const button1 = document.getElementById("pause");
    button1.disabled = true;
    const button2 = document.getElementById("resume");
    button2.disabled = false;
  }, 0.5);
  
  // resume clicked - resume disabled and pause enable 
  const handleResumeClick = debounce(() => {
    speechSynthesis.resume();
    const button1 = document.getElementById("pause");
    button1.disabled = false;
    const button2 = document.getElementById("resume");
    button2.disabled = true;
  }, 0.5);

  // when text box become empty speaking cancelled
  const handleTextChange = () => {
    let text = document.getElementById('my_box').value;
    if (text === '') {
      speechSynthesis.cancel();
      const button = document.getElementById("speaknow");
      setIsSpeaking(false);
      button.disabled = false;
    };
  }

 // when page reload speaking cancelled
  useEffect(() => {
    const handleUnload = () => {
      speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Text Reversing 
  const handleReverseClick = () => {
    const reversedText = text.split('').reverse().join('');
    setText(reversedText);
  };

 // Remove Extra Spaces 
  const handleReformatClick = () => {
    const formattedText = text.replace(/\s+/g, ' ').trim();
    setText(formattedText);
  };


 //  Calculate the extracted value
  const handleCalculateClick = () => {
    const extractedValues = extractValues(text);
    const calculationResult = evaluateExpression(extractedValues);
    const extractedValuesText = `Extracted Values: ${extractedValues.join(' ')}`;
    const calculationResultText = `Result: ${calculationResult}`;
    setText(`${extractedValuesText}\n${calculationResultText}`);
  };

  // evaluating the give expressing and providing correct result
const evaluateExpression = (values) => {
  try {
    // value joining without any ,
    let expression = values.join('');

    // Remove parentheses that contain an operator without an operand
    expression = expression.replace(/\([^()]*[+*/-][^()]*\)/g, '');

    // Remove empty parentheses
    expression = expression.replace(/\(\)/g, '');
    
    // Remove extra spaces between values
    expression = expression.replace(/\s+/g, '');

    // Replace vector (^) with Math.pow() for exponentiation
    expression = expression.replace(/\^/g, '**');

    // Remove parentheses at the end of the expression
    expression = expression.replace(/\(\)$/g, '');

    // Handle the case of division with a positive number following a single slash
    expression = expression.replace(/\/(?!\d)/g, '/(');
    expression = expression.replace(/\/\+/g, '/(');

    // Evaluate the expression using math.evaluate() from math.js
    const result = evaluate(expression);

    // Round the result to 2 decimal places if it's a decimal number
    if (Number.isFinite(result) && !Number.isInteger(result)) {
      return result.toFixed(2);
    }

    return result.toString();
  } catch (error) {
    return 'Invalid expression';
  }
};

 // Extract Numbers or expression

 const handleExtractClick = () => {
  const extractedValues = extractValues(text);
  setText(`Extracted Values: ${extractedValues}`);
 };

 const extractValues = (text) => {
  const regex = /[+\-*/%=^()]|\d+(\.\d+)?/g;
  return text.match(regex) || [];
 };

 // Binary code conversion
 const handleBinaryClick = () => {
  let binaryString = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const binaryValue = charCode.toString(2);
    binaryString += binaryValue.padStart(8, '0'); // Pad with zeros to ensure each binary value is 8 bits
  }
  setText(`${binaryString}`)
 };

// Morse code conversion
  const morseCodeMap = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
    0: '-----',
  };
  const handleMorseCode = () => {
    let converted = '';
    const upperCaseText = text.toUpperCase();
    for (let i = 0; i < upperCaseText.length; i++) {
      const char = upperCaseText[i];
      if (char === ' ') {
        converted += ' / ';
      } else if (morseCodeMap.hasOwnProperty(char)) {
        converted += morseCodeMap[char] + ' ';
      }
    }
    setText(`${converted}`)
  };

 // Duplicate line removal
 const handleRemoveDuplicate = () => {
  const lines = text.split('\n');
  const uniqueLines = [...new Set(lines)];
  const uniqueValue = uniqueLines.join('\n');
  setText(uniqueValue);
 };


 // text box text changing enabled
  const handleOnChange = (event) => {
    setText(event.target.value);
    handleTextChange()
    };
    // console.log("handleOnChange clicked")

  // seleting option for all or selected text only
  const [Options, setOptions] = useState("All");
  const handleOptionsChange = (event) => {
    setOptions(event.target.value);
  };

  // for button acivation


  return (
    <>
 {/* fetching prop heading value from app.js */}
      <hr style={{marginTop:"0px"}}/>
      <h4>{props.heading}</h4>
      <div>
        <textarea
          className="form-control"
          id="my_box"
          rows="10"
          style={textStyle}
          value={text}
          placeholder= "Start Writing Here..🙂"
          onChange={handleOnChange}
        ></textarea>
        <div >
          <div style={{marginLeft:"1rem", marginBottom: "1rem", marginTop: "1rem",}}>
      <label style={{ marginRight: "1rem", cursor: text.trim() === "" ? "default" : "pointer" , userSelect:"none"}}>
        <input
          type="radio"
          name="Options"
          value="All"
          checked={Options === "All"}
          onChange={handleOptionsChange}
          style={{ marginRight: "0.2rem"}}
          disabled={text.trim() === ""}
        />
        All
      </label>
      <label style={{ marginRight: "1rem", cursor: text.trim() === "" ? "default" : "pointer" , userSelect:"none"}}>
        <input
          type="radio"
          name="Options"
          value="Only Selected Text"
          checked={Options === "Only Selected Text"}
          onChange={handleOptionsChange}
          style={{ marginRight: "0.2rem"}}
          disabled={text.trim() === ""}
          
        />
        Only Selected Text
      </label>
      <div className="circle-container">
      {isBold ? (
           <button disabled={text.trim() === ""} className="btn btn-secondary1 active" onClick={handleBoldClick}><strong>B</strong></button>
          ) : (
           <button disabled={text.trim() === ""} className="btn btn-secondary1" onClick={handleBoldClick}><strong>B</strong></button>
          )}
      {isItalic ? (
           <button disabled={text.trim() === ""} className="btn btn-secondary1 active" onClick={handleItalicClick}><em>I</em></button>
          ) : (
           <button disabled={text.trim() === ""} className="btn btn-secondary1" onClick={handleItalicClick}><em>I</em></button>
          )}
      {isUnderline ? (
           <button disabled={text.trim() === ""} className="btn btn-secondary1 active" onClick={handleUnderlineClick}><u>U</u></button>
          ) : (
           <button disabled={text.trim() === ""} className="btn btn-secondary1" onClick={handleUnderlineClick}><u>U</u></button>
          )}
      {isStrike ? (
          <button disabled={text.trim() === ""} className="btn btn-secondary1 active" onClick={handleStrikeClick}><s>S</s></button>
          ) : (
          <button disabled={text.trim() === ""} className="btn btn-secondary1" onClick={handleStrikeClick}><s>S</s></button>
          )}
      </div>
    </div>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleClearText}>Erase</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleCopyText}>Copy</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleUpperClick}>UPPERCASE</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleLowerClick}>lowercase</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleSentenceClick}>Sentence case</button>

          <div className="btn-group" role="group" aria-label="Basic example">
          <button disabled={text.trim() === ""}type="button" className="btn btn-secondary" id="speaknow" onClick={handleSpeakClick}>Speak Now</button>
          
          {isSpeaking && (
            <>
          <button type="button" className="btn btn-secondary" id="pause" onClick={handlePauseClick} >Pause</button>
          <button type="button" className="btn btn-secondary" id="resume" onClick={handleResumeClick}>Resume</button>
          </>
          )}
          
          </div>

          <button disabled={text.trim() === ""} className="btn btn-secondary"  onClick={handleBinaryClick}>Binary Code</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleMorseCode}>Morse Code</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleRemoveDuplicate}>Remove Duplicate Lines</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleReverseClick}>Text Revers</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleReformatClick}>Remove Extra Spaces</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleCalculateClick}>Calculate Number</button>
          <button disabled={text.trim() === ""} className="btn btn-secondary" onClick={handleExtractClick}>extracted Values</button>
        </div>
        <hr />
        <div>
          <p>
            {/* Total words couting */}
            Total words -{" "}
            <strong>
              {text.split(" ").filter((word) => word !== "").length}
            </strong>{" "}

            {/* Total character couting */}
            Total character - <strong>{text.length}</strong>{" "}
            
            {/* Total time to read couting */}
            Total time to read
            - <strong>{0.008 * text.trim().split(" ").length}</strong>
          </p>
        </div>
          <footer>
            <hr />
          <p className="copyright">Copyright © 2023 Text Utility. All rights Reserved</p>
          </footer>
        </div>
           </>
  );
}

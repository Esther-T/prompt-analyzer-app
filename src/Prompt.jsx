import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';


function Prompt() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("N/A")
  const [disable, setDisable] = useState(false)

  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

   const handleSubmit = async (event) => {
    setDisable(true);
    event.preventDefault(); 

    try {
      const res = await fetch('https://prompt-analyzer-app.onrender.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_input: prompt })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.text(); 

      if (data.includes("Error"))
      {
        setResult("Free limit exceeded")
      }
      else
      {
        const words = data.trim().split(/\s+/); 
        const lastWord = words[words.length - 1];

        console.log('Last word:', lastWord);
        setResult(lastWord);

      }
      
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setResult("Free limit exceeded")
    }
    finally {
    setDisable(false); 
  }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Form onSubmit={handleSubmit}> 
            <Form.Group className="mb-3">
            <Form.Label>Enter your prompt here</Form.Label>
            <Form.Control as="textarea" rows={4} value={prompt} onChange={handleChange} style={{ width: '600px' }}/>
            <br/>
            <Button type="submit" className="mt-2" disabled={disable}>
                Submit
            </Button>
            <br/>
            <br/>
            <Alert key="primary" variant="primary">
                Your prompt is <b><u>{result}</u></b>
            </Alert>
        </Form.Group>
        </Form>
        
      </div>
    
    </>
  )
}

export default Prompt

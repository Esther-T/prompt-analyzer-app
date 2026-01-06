import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';



function Prompt() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("N/A")
  const [disable, setDisable] = useState(false)
  const [serverStatus, setServerStatus] = useState(false)

  const handleChange = (event) => {
    setPrompt(event.target.value);
  }

   const checkServerStatus = async (event) => {
    const checkServerStatus = async () => {
    try {
      const res = await fetch("https://prompt-analyzer-app.onrender.com/"); 
      if (res.ok) {
        setServerStatus(true);
      } else {
        setServerStatus(false);
      }
    } catch (error) {
      setServerStatus(false);
    }
  };

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

   useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      
      <div className="left-panel">
        <Alert key="info" variant="info">
            {
                serverStatus ? 
                <>Server is currently <b><u>running</u></b></>
                :
                <>Server is currently <b><u>asleep</u><Spinner animation="border" variant="dark" /></b></>
            }
        </Alert>
        <Alert key="info" variant="info">
            <Alert.Heading>How to use this tool?</Alert.Heading>
            <p>This is how to use the tool.......</p>
        </Alert>
      </div>
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
                {result.includes("exceeded")? 
                    <b>Sorry! The app is temporarily unavailable as the free limit has been reached.</b>
                    :
                    <>
                        Your prompt is <b><u>{result}</u></b>
                    </>
                }
                
            </Alert>
        </Form.Group>
        </Form>
        
      </div>

    </>
  )
}

export default Prompt

import React, {useEffect, useState} from 'react';
import QRCode from 'qrcode.react';
import './RegisterScreen.css'
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const App: React.FC = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null)
    useEffect(() =>{
        const fetchData = async () => {
            const response = await axios.post('https://integration.gxfs.dev/api/workshop/connection/v1/invitation-url?alias=trust');
            if (response.status == 201){
                console.log("Successfully getting QR code")

                setQrCodeUrl(response.data.data.invitationUrl)
            }else{
                console.log("Error getting QR code")
            }
        }
        fetchData();
    }, []);
  const navigate = useNavigate()

  const handleNavigationLogin = () => {
      navigate('/login')
  }
  return (
    <div className="container">
      <div className="left">
        <div className="centered">
          <h1>Welcome to</h1>
          <p>Drinks Inc.</p>
          <p>Register 1</p>
          <p></p>
        </div>
      </div>
      <div className="right">
      <div className="right">
                {qrCodeUrl ?
                 <QRCode value={qrCodeUrl} size={500} />
             : <p>No QR code</p>}
      </div>
    </div>
    </div>
  );
};

export default App;
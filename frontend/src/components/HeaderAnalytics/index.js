import React from 'react';
import {useState,useRef} from 'react';
import Analytics from '../Analytics';

const HeaderAnalytics = () => {
    const [url,setUrl] = useState('');
    const ref = useRef('');

    const handleButton = () => {
        ref.current = url;
        setUrl('');
    }

    console.log(ref.current)

  return (
    <div>
        <div className="sub-con">
            <input type="input" placeholder="ENTER SHORT CODE" 
            value={url} onChange={(e) => setUrl(e.target.value)}/>
            <button  className="cpy-btn" onClick ={handleButton}>GET</button>
        </div>
      {!ref.current && <Analytics shortCode={ref.current} />}
    </div>
  );
};

export default HeaderAnalytics;

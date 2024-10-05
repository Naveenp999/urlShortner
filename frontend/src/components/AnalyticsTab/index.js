import { useState } from 'react';
import { Circles } from 'react-loader-spinner';
import Analytics from '../Analytics';
import './index.css'

const AnalyticsTab = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [data, setData] = useState({});
  const [err, setError] = useState('');

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${code}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const obj = await response.json();
      setData(obj);
      setCode('');
      setError('');
      setLoading(false);
    } catch (error) {
      setData({});
      setCode('');
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="tab-container">
      <h1 className='heading'>Analytics</h1>
      <div className="form">
        <input
          type="text"
          value={code}
          className="input"
          placeholder="Enter Short Code"
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="form-btn" onClick={handleClick}>
          Analytics
        </button>
      </div>
      <div className="data-container">
        {loading && (
          <Circles height="80" width="80" color="#4fa94d" ariaLabel="loading-indicator" />
        )}
        {data && Object.keys(data).length > 0 && <Analytics details={data} />}
        {err && <p className="err-text">{err}</p>}
      </div>
    </div>
  );
};

export default AnalyticsTab;

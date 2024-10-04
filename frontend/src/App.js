import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Registering the necessary components in ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

const App = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [err, setErr] = useState('');
  const ref = useRef('');
  const [option, setOption] = useState('shortener');
  
  const [shortCode, setShortCode] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardErr, setDashboardErr] = useState('');

  // Handle URL shortening
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: url }),
    });
    if (response.ok) {
      const data = await response.json();
      setShortUrl(data.short_url);
      ref.current = url;
      setUrl('');
      setErr('');
    } else {
      const { error } = await response.json();
      setShortUrl('');
      setErr(error);
    }
  };

  // Copy URL function
  const copyUrl = async (link) => {
    try {
      await window.navigator.clipboard.writeText(link);
      alert('link copied');
    } catch (error) {
      alert('link Not Copied');
    }
  };

  // Fetch analytics for short code
  const fetchAnalytics = async () => {
    setLoading(true);
    setDashboardErr('');
    setAnalyticsData(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/${shortCode}`);
      setAnalyticsData(response.data);
    } catch (error) {
      setDashboardErr('Error fetching analytics. Make sure the short code is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare Pie chart data
  const preparePieChartData = () => {
    if (!analyticsData || !analyticsData.deviseTypeVisits) return;

    const labels = analyticsData.deviseTypeVisits.map(item => item.device_type);
    const data = analyticsData.deviseTypeVisits.map(item => item['COUNT(*)']);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Device Type Visits',
          data: data,
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        },
      ],
    };
  };

  const pieChartData = preparePieChartData();

  return (
    <div className="App">
      <h1>URL Shortener & Dashboard</h1>
      
      {/* Option Switcher */}
      <div>
        <button onClick={() => setOption('shortener')}>URL Shortener</button>
        <button onClick={() => setOption('dashboard')}>Analytics Dashboard</button>
      </div>

      {/* URL Shortener Section */}
      {option === 'shortener' && (
        <div>
          <h2>Shorten a URL</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit">Shorten URL</button>
          </form>

          {shortUrl && (
            <>
              <p>Shortened URL:</p>
              <div className='urlContainer'>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                <button className="cpyBtn" onClick={() => copyUrl(shortUrl)}>Copy</button>
              </div>

              <p>Original URL:</p>
              <div className='urlContainer'>
                <a href={ref.current} target="_blank" rel="noopener noreferrer">{ref.current}</a>
                <button className="cpyBtn" onClick={() => copyUrl(ref.current)}>Copy</button>
              </div>
            </>
          )}

          {err && <p className="errorText">{err}</p>}
        </div>
      )}

      {/* Analytics Dashboard Section */}
      {option === 'dashboard' && (
        <div>
          <h2>Enter Short Code for Analytics</h2>
          <input
            type="text"
            placeholder="Enter Short Code"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />
          <button onClick={fetchAnalytics}>Fetch Analytics</button>

          {loading && <p>Loading analytics...</p>}

          {dashboardErr && <p className="errorText">{dashboardErr}</p>}

          {analyticsData && (
            <div>
              <h3>Original URL: {analyticsData.originalUrl}</h3>
              <h3>Total Visitors: {analyticsData.visitersCount}</h3>
              <h3>Unique Visitors: {analyticsData.uniqueVisiters}</h3>
              <h3>Average Visits per Day: {analyticsData.avgVisitsPerDay}</h3>
              <h3>Average Visits per Hour: {analyticsData.avgVisitsPerHour}</h3>

              <h4>Device Type Visits Breakdown:</h4>
              {pieChartData && (
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

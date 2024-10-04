import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const Analytics = ({ shortCode }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`http://localhost:YOUR_PORT/${shortCode}`);
        setAnalyticsData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  // Prepare data for the bar chart
  const prepareChartData = () => {
    if (!analyticsData || !analyticsData.deviseTypeVisits) return;

    const labels = analyticsData.deviseTypeVisits.map(item => item.device_type);
    const data = analyticsData.deviseTypeVisits.map(item => item['COUNT(*)']);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Device Type Visits',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
        },
      ],
    };
  };

  const chartData = prepareChartData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      <h2>Short URL Analytics for {shortCode}</h2>
      <div>
        <h3>Original URL: {analyticsData.originalUrl}</h3>
        <h3>Total Visitors: {analyticsData.visitersCount}</h3>
        <h3>Unique Visitors: {analyticsData.uniqueVisiters}</h3>
        <h3>Average Visits per Day: {analyticsData.avgVisitsPerDay}</h3>
        <h3>Average Visits per Hour: {analyticsData.avgVisitsPerHour}</h3>
      </div>
      
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
      
      <div>
        <h4>Device Type Visits Breakdown:</h4>
        <ul>
          {analyticsData.deviseTypeVisits.map((item, index) => (
            <li key={index}>
              {item.device_type}: {item['COUNT(*)']}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;

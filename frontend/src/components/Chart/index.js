import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';

export default function BasicPie({ arr }) {
  const devices = [
    { name: 'mobile', value: 0 },
    { name: 'desktop', value: 0 },
    { name: 'tablet', value: 0 },
  
  ];

  for (let val of arr) {
    const sub = val.deviceTypes;
    const index = devices.findIndex(device => device.name === sub);
    if (index !== -1) {
      devices[index].value = val.count;
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={devices}
          dataKey="value"
          nameKey="name"
          startAngle={0}
          endAngle={360}
          innerRadius={0}
          outerRadius={80}
        >
          <Cell name="mobile" fill="#FF5733" />
          <Cell name="desktop" fill="#87CEEB" />
          <Cell name="tablet" fill="#32CD32" />
        </Pie>
        <Legend type="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

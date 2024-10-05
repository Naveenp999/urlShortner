import Chart from '../Chart'
const Analytics = ({ details }) => {
    const { deviseTypeVisits, ...q } = { ...details };
  
    const items = () => {
      let arr = [];
      for (let key in q) {
        arr.push(<li className="item" key={key}>{key}: {q[key]}</li>);
      }
      return arr;
    };
  
    return (
      <div className="dashboard-container">
        <ul className="text-details">
          {items()}
        </ul>
       {deviseTypeVisits.length > 0 && <Chart arr={deviseTypeVisits} />}
      </div>
    );
  };
  
  export default Analytics;
  
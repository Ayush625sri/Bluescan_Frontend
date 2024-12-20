import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ type }) => {
  const getChartData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    if (type === 'pollution-levels') {
      return {
        labels,
        datasets: [
          {
            label: 'Microplastics',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'Chemical Pollutants',
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
          }
        ]
      };
    }

    return {
      labels,
      datasets: [{
        label: 'Pollution Trend',
        data: [30, 45, 35, 60, 42, 38],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: type === 'pollution-levels' ? 'Pollution Levels by Type' : 'Overall Pollution Trend'
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {type === 'pollution-levels' ? (
        <Bar data={getChartData()} options={options} />
      ) : (
        <Line data={getChartData()} options={options} />
      )}
    </div>
  );
};

export default ChartComponent;
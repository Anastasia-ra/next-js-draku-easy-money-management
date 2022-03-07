import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
);
ChartJS.register(ChartDataLabels);

const categories = [
  'Food',
  'Travel',
  'Utilities',
  'Clothes',
  'Cakes',
  'Health',
];

const categoriesData = [0.2, 0.3, 0.1, 0.25, 0.5, 0.1];

const budgetLabels = ['Expenses', 'Budget left'];
const budgetPercentage = 0.8;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const expensesMonth = [
  1300, 1250, 1809, 890, 1502, 1400, 1950, 1700, 1600, 1600, 1200, 1150,
];

export const dataDoughnutCategories = {
  labels: categories,
  datasets: [
    {
      label: 'Expenses per category',
      data: categoriesData,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const optionsDoughnutCategories = {
  cutout: '60%',
  // radius: 800,
  // spacing: '5%',
  maintainAspectRatio: false,
  elements: {
    arc: {
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255,0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      hoverOffset: 3,
    },
  },
  layout: {
    padding: 50,
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      // position: 'left',
      // align: 'end',
      display: false,
    },
    datalabels: {
      color: '#36A2EB',
      formatter: function (value, context) {
        return (
          categories[context.dataIndex] + '\n' + Math.round(value * 100) + '%'
        );
      },
      align: 'end',
      offset: 20,
      textAlign: 'center',
    },
  },
};

export const dataProgressCircle = {
  labels: budgetLabels,
  datasets: [
    {
      label: 'Budget',
      data: [1 - budgetPercentage, budgetPercentage],
      backgroundColor: ['white', 'grey'],
      borderColor: ['grey', 'grey'],
      borderWidth: 1,
    },
  ],
};

export const optionsProgressCircle = {
  cutout: '85%',
  rotation: 0,
  maintainAspectRatio: false,
  elements: {
    // arc: {
    //   hoverBackgroundColor: [
    //     'rgba(255, 99, 132, 0.7)',
    //     'rgba(54, 162, 235, 0.7)',
    //   ],
    // },
  },
  layout: {
    padding: 50,
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
    legend: {
      display: false,
    },
    datalabels: {
      color: '#36A2EB',
      formatter: function (value) {
        return Math.round(value * 100) + '%';
      },
      display: [false, true],
      align: 'start',
      offset: 70,
      textAlign: 'center',
    },
  },
};

export const dataLine = {
  labels: months,
  datasets: [
    {
      label: 'Months',
      data: expensesMonth,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

export const optionsLine = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.3,
    },
  },
  scales: {
    xAxis: {
      grid: {
        display: false,
      },
    },
    yAxis: {
      grid: {
        display: false,
      },
    },
  },
  // layout: {
  //   padding: 30,
  // },
};

export const datasProgressBar = {
  labels: ['Food'],
  datasets: [
    {
      label: 'Food',
      data: [90],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
export const optionsProgressBar = {
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    // xAxis: {
    //   grid: {
    //     max: false,
    //   },
    // },
    xAxis: {
      max: 100,
      grid: {
        display: false,
      },
    },
  },
};

export function DoughnutCategories() {
  return (
    <Doughnut
      data={dataDoughnutCategories}
      options={optionsDoughnutCategories}
      // width={'300px'}
      // height={'400px'}
    />
  );
}

export function DoughnutProgress() {
  return (
    <Doughnut
      data={dataProgressCircle}
      options={optionsProgressCircle}
      // width={'300px'}
      // height={'400px'}
    />
  );
}

export function LineChart() {
  return <Line options={optionsLine} data={dataLine} />;
}

export function ProgressBar() {
  return <Bar options={optionsProgressBar} data={datasProgressBar} />;
}

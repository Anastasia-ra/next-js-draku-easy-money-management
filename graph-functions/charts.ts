import { Category, Expense } from '../util/database';
import {
  getSharePerCategory,
  getSumExpensesCategory,
} from './sum-per-category';
import { Context } from 'chartjs-plugin-datalabels';
import { getTotalBudgetProgress } from './budgetProgress';

export const colors = [
  'rgba(255, 99, 164, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(86, 255, 86, 0.8)',
  'rgba(68, 7, 97, 0.8)',
  'rgba(224, 240, 10, 0.8)',
  'rgba(44, 46, 46, 0.8)',
];

export function getDoughnutCategoriesData(
  categoriesArray: Category[],
  expensesArray: Expense[],
) {
  const categoriesWithSum = getSumExpensesCategory(
    categoriesArray,
    expensesArray,
  );
  const categoriesWithShares = getSharePerCategory(categoriesWithSum);
  const categoriesWithSharesFiltered = categoriesWithShares.filter(
    (e) => e.shareOfExpenses !== 0,
  );

  const categories = categoriesWithSharesFiltered.map((e) => e.name);

  const categoriesData = categoriesWithSharesFiltered.map(
    (e) => e.shareOfExpenses,
  );

  const dataDoughnutCategories = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses per category',
        data: categoriesData,
        backgroundColor: colors,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          ' rgba(86, 255, 86, 1)',
          'rgba(68, 7, 97, 1)',
          'rgba(224, 240, 10, 1)',
          'rgba(44, 46, 46, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsDoughnutCategories = {
    cutout: '60%',
    radius: 60,
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
        color: '#26325b',
        formatter: function (value: number, context: Context) {
          return (
            categories[context.dataIndex] + '\n' + Math.round(value * 100) + '%'
          );
        },
        align: 'end' as 'end',
        offset: 8,
        textAlign: 'center' as 'center',
      },
    },
  };
  return { data: dataDoughnutCategories, options: optionsDoughnutCategories };
}

export function getProgressChartData(
  categoriesArray: Category[],
  expensesArray: Expense[],
) {
  const budgetProgress = getTotalBudgetProgress(
    categoriesArray,
    expensesArray,
  ).progress;

  let bgColorProgress = '#07b335';
  if (0.7 < budgetProgress && budgetProgress < 0.9) {
    bgColorProgress = '#eb8305';
  }
  if (budgetProgress >= 0.9) {
    bgColorProgress = '#a81b0c';
  }

  const dataProgressCircle = {
    labels: ['Expenses', 'Budget left'],
    datasets: [
      {
        label: 'Budget',
        data: [1 - budgetProgress, budgetProgress],
        backgroundColor: ['white', bgColorProgress],
        borderColor: [bgColorProgress, bgColorProgress],
        borderWidth: 1,
      },
    ],
  };

  const optionsProgressCircle = {
    cutout: '85%',
    radius: 60,
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
        formatter: function (value: number) {
          return Math.round(value * 100) + '%';
        },
        display: [false, false],
        align: 'start' as 'start',
        offset: 70,
        textAlign: 'center' as 'center',
      },
    },
  };

  return { data: dataProgressCircle, options: optionsProgressCircle };
}

export function getLineData(
  monthsWithExpenses: Array<{
    totalExpenses: number;
    monthExpenses: Array<number>;
    monthId: number;
    month: string;
    year: string;
  }>,
) {
  const dataLine = {
    labels: monthsWithExpenses
      .map((month) => `${month.month} ${month.year}`)
      .reverse(),
    datasets: [
      {
        label: 'Months',
        data: monthsWithExpenses
          .map((month) => month.totalExpenses / 100)
          .reverse(),
        borderColor: '#01aca3',
        backgroundColor: '#01aca3',
      },
    ],
  };

  const optionsLine = {
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
        ticks: {
          color: '#26325b',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      yAxis: {
        ticks: {
          color: '#26325b',
          font: {
            size: 12,
          },
          callback: (value: number | string) => {
            return value + ' €';
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };
  return { data: dataLine, options: optionsLine };
}

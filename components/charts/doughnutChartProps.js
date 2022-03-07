// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// // import {
// //   getAllCategoriesbyUserId,
// //   getAllExpensesByUserId,
// //   getUserByValidSessionToken,
// // } from '../../util/database';
// import {
//   getSharePerCategory,
//   getSumExpensesCategory,
// } from '../../graph-functions/sum-per-category';

// ChartJS.register(ArcElement, Tooltip, Legend);
// ChartJS.register(ChartDataLabels);

// export function DoughnutCategories(props) {
//   const categories = props.categories.name;
//   const categoriesWithSum = getSumExpensesCategory(
//     props.categories,
//     props.expenses,
//   );
//   const categoriesWithPercentage = getSharePerCategory(categoriesWithSum);

//   const categoriesData = categoriesWithPercentage.map(
//     (category) => category.shareOfExpenses,
//   );
//   // const categoriesData = [0.2, 0.3, 0.1, 0.25, 0.5, 0.1];

//   const dataDoughnutCategories = {
//     labels: categories,
//     datasets: [
//       {
//         label: 'Expenses per category',
//         data: categoriesData,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const optionsDoughnutCategories = {
//     cutout: '60%',
//     // radius: 800,
//     // spacing: '5%',
//     maintainAspectRatio: false,
//     elements: {
//       arc: {
//         hoverBackgroundColor: [
//           'rgba(255, 99, 132, 0.7)',
//           'rgba(54, 162, 235, 0.7)',
//           'rgba(255, 206, 86, 0.7)',
//           'rgba(75, 192, 192, 0.7)',
//           'rgba(153, 102, 255,0.7)',
//           'rgba(255, 159, 64, 0.7)',
//         ],
//         hoverOffset: 3,
//       },
//     },
//     layout: {
//       padding: 50,
//     },
//     plugins: {
//       tooltip: {
//         enabled: false,
//       },
//       legend: {
//         // position: 'left',
//         // align: 'end',
//         display: false,
//       },
//       datalabels: {
//         color: '#36A2EB',
//         formatter: function (value, context) {
//           return (
//             categories[context.dataIndex] + '\n' + Math.round(value * 100) + '%'
//           );
//         },
//         align: 'end',
//         offset: 20,
//         textAlign: 'center',
//       },
//     },
//   };

//   return (
//     <Doughnut
//       data={dataDoughnutCategories}
//       options={optionsDoughnutCategories}
//       // width={'300px'}
//       // height={'400px'}
//     />
//   );
// }

// // export async function getServerSideProps(context) {
// //   const sessionToken = context.req.cookies.sessionToken;
// //   const user = await getUserByValidSessionToken(sessionToken);

// //   if (!user) {
// //     return {
// //       props: {
// //         error: 'An error has occured',
// //       },
// //     };
// //   }

// //   const categories = await getAllCategoriesbyUserId(user.id);

// //   const expenses = await getAllExpensesByUserId(user.id);

// //   return {
// //     props: { user: user, categories: categories, expenses: expenses },
// //   };
// // }

import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCategoriesList } from '../../graph-functions/fetchApi';
import {
  getUserByValidSessionToken,
  Category,
  Expense,
  getAllCategoriesbyUserId,
  getExpensesByMonthByUser,
} from '../../util/database';
import { getDoughnutCategoriesData } from '../../graph-functions/charts';
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
import { Doughnut } from 'react-chartjs-2';
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
  ChartDataLabels,
);

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
  expensesCurrentMonth: Expense[];
  categories: Category[];
};

type Errors = { message: string }[];

type Categories = Category[];

const formStyle = css`
  background: #01aca3;
  color: white;
  width: 250px;
  height: 190px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 15%;
  text-align: center;
  /* h1 {
    text-align: center;
  } */
  p {
    text-align: center;
  }
  a {
    color: white;
  }
  input {
    margin: 10px;
    width: 100px;
  }
`;

const addButtonStyle = css`
  width: 180px;
  height: 28px;
  margin: 25px auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const singleCategoryStyle = css`
  display: flex;
  flex-wrap: nowrap;
`;

const deleteButtonStyle = css`
  width: 80px;
  height: 15px;
  font-size: 12px;
  margin-left: 20px;
  background: #eb584476;
  border: solid #e4361f76;
  color: white;
  /* border-radius: 10px; */
  border-style: none;
  :disabled {
    background: #aca9a9;
  }
`;

const chartDoughnutCategoriesStyle = css`
  width: 180px;
  height: 200px;
  margin: auto;
`;

const categoryBlockStyle = css``;

const budgetBlockStyle = css``;

const formBlocksStyle = css`
  display: flex;
`;

export default function CategoriesManagement(props: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [categories, setCategories] = useState<Categories>([]);
  const [maxCategory, setMaxCategory] = useState(false);
  const [categoriesWithExpense, setCategoriesWithExpense] = useState<number[]>(
    [],
  );
  const [addNewCategory, setAddNewCategory] = useState(false);

  // Display all categories on first render or when userId changes
  useEffect(() => {
    const fetchCategories = async () => await getAllCategories(props.user.id);
    fetchCategories().catch(console.error);
  }, [props.user.id]);

  useEffect(() => {
    setMaxCategory(categories.length > 9);
  }, [categories.length]);

  useEffect(() => {
    const fetchCategoriesWithExpense = async () =>
      await getCategoriesWithExpensesList();
    fetchCategoriesWithExpense().catch(console.error);
  }, []);

  async function getAllCategories(userId: number) {
    const categoriesListResponseBody = await getCategoriesList(userId);
    setCategories(categoriesListResponseBody.categoriesList);
  }

  // Add category to database
  async function addCategory(userId: number, category: string, budget: string) {
    const categoryResponse = await fetch(`/api/categories/addCategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          userId: userId,
          name: category[0].toUpperCase() + category.slice(1).toLowerCase(),
          monthlyBudget: Number(budget) * 100,
        },
      }),
    });
    console.log(categoryResponse);

    const categoryResponseBody = await categoryResponse.json();

    if ('errors' in categoryResponseBody) {
      setErrors(categoryResponseBody.errors);
      setNewCategory('');
      setMonthlyBudget('');
      return;
    }

    console.log(categoryResponseBody);
    setErrors([]);
    await getAllCategories(userId);

    console.log('categories', categories.length, categories);
    setNewCategory('');
    setMonthlyBudget('');
  }

  // Check if there is an expense in this category

  async function checkIfExpenseInCategory(categoryId: Number) {
    const categoryResponse = await fetch(`/api/categories/checkCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          categoryId: categoryId,
        },
      }),
    });

    const categoryResponseBody = await categoryResponse.json();
    if ('errors' in categoryResponseBody) {
      setErrors(categoryResponseBody.errors);
      return;
    }

    setErrors([]);
    console.log('categoryResponseBody.category', categoryResponseBody.category);
    return categoryResponseBody.category;
  }

  // Delete category

  async function deleteCategory(categoryId: number, userId: number) {
    const deleteResponse = await fetch(`/api/categories/deleteCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          categoryId: categoryId,
        },
      }),
    });

    const deleteResponseBody = await deleteResponse.json();

    if ('errors' in deleteResponseBody) {
      setErrors(deleteResponseBody.errors);
      return;
    }
    setErrors([]);
    await getAllCategories(userId);
  }

  async function getCategoriesWithExpensesList() {
    const response = await fetch(`/api/categories/checkAllCategories`);
    const data = await response.json();
    console.log('data', data);
    const categoryList = data.expensesPerCategories.map(
      (expense: { categoryId: number }) => expense.categoryId,
    );
    console.log('categoryList', categoryList);
    setCategoriesWithExpense(categoryList);
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your categories</title>
        <meta name="description" content="categories management" />
      </Head>
      <h1>Manage your categories</h1>

      <div css={chartDoughnutCategoriesStyle}>
        <Doughnut
          // width="150"
          // height="150"
          data={
            getDoughnutCategoriesData(
              props.categories,
              props.expensesCurrentMonth,
            ).data
          }
          options={
            getDoughnutCategoriesData(
              props.categories,
              props.expensesCurrentMonth,
            ).options
          }
        />
      </div>

      {/* <button> Add a new category </button> */}

      <div css={formStyle}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await addCategory(props.user.id, newCategory, monthlyBudget);
          }}
        >
          <div css={formBlocksStyle}>
            <div css={categoryBlockStyle}>
              <label>
                Category
                <br />
                <input
                  value={newCategory}
                  onChange={(event) =>
                    setNewCategory(event.currentTarget.value)
                  }
                />
              </label>
            </div>
            <div css={budgetBlockStyle}>
              <label>
                Monthly budget
                <br />
                <input
                  value={monthlyBudget}
                  onChange={(event) =>
                    setMonthlyBudget(event.currentTarget.value)
                  }
                />
              </label>
            </div>
          </div>
          <br />
          <button css={addButtonStyle} disabled={maxCategory}>
            Add a new category
          </button>
        </form>
      </div>
      {maxCategory ? (
        <div>You've reached the maximum number of categories.</div>
      ) : null}
      <div>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
      <div>
        {categories.map((category) => {
          const hasExpense = categoriesWithExpense.includes(category.id);
          console.log('Category with expense', categoriesWithExpense);
          return (
            <div css={singleCategoryStyle} key={`category-${category.name}`}>
              <div>
                {category.name} {category.monthlyBudget / 100}€
              </div>
              <button
                css={deleteButtonStyle}
                disabled={hasExpense}
                onClick={async () => {
                  const categoryWithExpense = await checkIfExpenseInCategory(
                    category.id,
                  );
                  await getCategoriesWithExpensesList();
                  if (!categoryWithExpense) {
                    await deleteCategory(category.id, props.user.id);
                    setMaxCategory(false);
                    return;
                  }
                }}
              >
                {' '}
                Delete category{' '}
              </button>
              {hasExpense ? (
                <p>You can only delete categories without expenses</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const sessionToken = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(sessionToken);

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/users/categoriesManagement',
        permanent: false,
      },
    };
  }

  const categories = await getAllCategoriesbyUserId(user.id);

  const currentMonth = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
  }).format(new Date());

  const currentYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  }).format(new Date());

  const expensesCurrentMonth = await getExpensesByMonthByUser(
    Number(currentMonth),
    Number(currentYear),
    user.id,
  );

  const expensesCurrentMonthDateToString = expensesCurrentMonth.map(
    (expense) => {
      expense.date = expense.date.toISOString();
      return expense;
    },
  );

  return {
    props: {
      user: user,
      categories: categories,
      expensesCurrentMonth: expensesCurrentMonthDateToString,
    },
  };
}

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
import {
  getDoughnutCategoriesData,
  colors,
} from '../../graph-functions/charts';
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

const mainStyle = css`
  color: #26325b;
  h1 {
    font-size: 26px;
  }
`;

const formStyle = css`
  background: #01aca3;
  color: white;
  width: 250px;
  height: 95px;
  margin: auto;
  padding: 10px 15px;
  border-radius: 15px;
  text-align: center;

  /* p {
    text-align: center;
  }
  a {
    color: white;
  } */
  input {
    margin: 10px 10px 0 10px;
    width: 100px;
    border-radius: 8px;
    border-style: none;
  }
`;

const addButtonStyle = css`
  width: 180px;
  height: 21px;
  margin: auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const deleteButtonStyle = css`
  width: 55px;
  height: 15px;
  font-size: 12px;
  margin-left: 15px;
  background: #e77b8e;
  /* border: solid #e4361f76; */
  color: white;
  border-radius: 50px;
  border-style: none;
  :disabled {
    background: #e2b3bc;
  }
`;

const editButtonStyle = css`
  width: 55px;
  height: 15px;
  font-size: 12px;
  margin-left: 5px;
  background: #9c858a;
  border: solid #e4361f76;
  color: white;
  border-radius: 50px;
  border-style: none;
`;

const chartDoughnutCategoriesStyle = css`
  width: 250px;
  height: 200px;
  margin: auto;
`;

const categoryBlockStyle = css``;

const budgetBlockStyle = css``;

const formBlocksStyle = css`
  display: flex;
`;

const singleCategoryStyle = css`
  display: flex;
  flex-direction: column;
`;

const singleLineStyle = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const categoriesListStyle = css`
  width: 280px;
  margin: 20px auto;
`;

function getColorDot(index: number) {
  const colorDotStyle = css`
    border-radius: 50%;
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    background: ${colors[index]};
  `;
  return colorDotStyle;
}

const categoryNameStyle = css`
  padding: 0 20px;
  width: 100px;
`;

const categoryBudgetStyle = css`
  width: 40px;
`;

const changeFormStyle = css`
  background: #2cada7;
  color: white;
  width: 250px;
  height: 80px;
  margin: auto;
  padding: 5px 5px;
  border-radius: 15px;
  text-align: center;
  font-size: 14px;

  input {
    margin: 5px 5px 0 5px;
    width: 80px;
    border-radius: 8px;
    border-style: none;
  }
`;

const newInfos = css`
  display: flex;
`;

const changeButtonStyle = css`
  width: 90px;
  height: 21px;
  margin: 0 auto;
  font-size: 14px;
  background: #f4ac40;
  color: white;
  border-radius: 10px;
  border-style: none;
`;

const newNameInputStyle = css``;

const newBudgetInputStyle = css``;

export default function CategoriesManagement(props: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [categories, setCategories] = useState<Categories>([]);
  const [maxCategory, setMaxCategory] = useState(false);
  const [categoriesWithExpense, setCategoriesWithExpense] = useState<number[]>(
    [],
  );
  const [updateCategoryId, setUpdateCategoryId] = useState('');
  const [updateCategoryName, setUpdateCategoryName] = useState('');
  const [updateCategoryBudget, setUpdateCategoryBudget] = useState('');
  const [editIsClicked, setEditIsClicked] = useState(0);

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

    const sortedCategoriesList = categoriesListResponseBody.categoriesList.sort(
      (a: Category, b: Category) => a.id - b.id,
    );

    setCategories(sortedCategoriesList);
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

  // Update categories

  async function updateCategoryNameBudget(
    categoryId: number,
    categoryName: string,
    categoryBudget: number,
  ) {
    const updatedResponse = await fetch(`/api/categories/updateCategories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: {
          userId: props.user.id,
          categoryId: categoryId,
          newCategoryName: categoryName,
          newCategoryBudget: categoryBudget,
        },
      }),
    });

    const updatedResponseBody = await updatedResponse.json();

    console.log('updatedResponseBody', updatedResponseBody);
  }

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Your categories</title>
        <meta name="description" content="categories management" />
      </Head>
      <div css={mainStyle}>
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
                    type="number"
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
        <div css={categoriesListStyle}>
          {categories.map((category, index) => {
            const hasExpense = categoriesWithExpense.includes(category.id);
            console.log('Category with expense', categoriesWithExpense);
            return (
              <div css={singleCategoryStyle} key={`category-${category.name}`}>
                <div css={singleLineStyle}>
                  <div css={getColorDot(index)} />
                  <div css={categoryNameStyle}>{category.name}</div>
                  <div css={categoryBudgetStyle}>
                    {category.monthlyBudget / 100}€
                  </div>
                  <button
                    css={deleteButtonStyle}
                    disabled={hasExpense}
                    onClick={async () => {
                      const categoryWithExpense =
                        await checkIfExpenseInCategory(category.id);
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
                  {editIsClicked === 0 && (
                    <button
                      css={editButtonStyle}
                      onClick={() => setEditIsClicked(category.id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editIsClicked === category.id && (
                  <form
                    css={changeFormStyle}
                    onSubmit={async (event) => {
                      event.preventDefault();
                      await updateCategoryNameBudget(
                        category.id,
                        updateCategoryName,
                        Number(updateCategoryBudget) * 100,
                      );
                      await getAllCategories(props.user.id);
                      setUpdateCategoryName('');
                      setUpdateCategoryBudget('');
                      setEditIsClicked(0);
                    }}
                  >
                    <div css={newInfos}>
                      <label>
                        New name
                        <input
                          css={newNameInputStyle}
                          value={updateCategoryName}
                          onChange={(event) =>
                            setUpdateCategoryName(event.currentTarget.value)
                          }
                        />
                      </label>
                      <label>
                        New budget
                        <input
                          css={newBudgetInputStyle}
                          type="number"
                          value={updateCategoryBudget}
                          onChange={(event) =>
                            setUpdateCategoryBudget(event.currentTarget.value)
                          }
                        />
                      </label>
                    </div>
                    <br />
                    <button css={changeButtonStyle}>Change</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
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

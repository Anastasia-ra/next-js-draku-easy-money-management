import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getCategoriesList } from '../../graph-functions/fetchApi';
import {
  getUserByValidSessionToken,
  Category,
  // Expense,
  getAllCategoriesbyUserId,
  // getExpensesByMonthByUser,
} from '../../util/database';
import {
  // getDoughnutCategoriesData,
  colors,
  getDoughnutCategoriesBudgetData,
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
  // expensesCurrentMonth: Expense[];
  // categories: Category[];
};

type Errors = { message: string }[];

type UpdateErrors = { message: string; categoryId: number }[];

type Categories = Category[];

const breakPointsWidth = [480, 800];
const mediaQueryWidth = breakPointsWidth.map(
  (bp) => `@media (max-width: ${bp}px)`,
);

const breakPointsHeight = [900];
const mediaQueryHeight = breakPointsHeight.map(
  (bp) => `@media (max-height: ${bp}px)`,
);

const mainStyle = css`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 8px #cccccc;
  color: #26325b;
  max-width: 480px;
  padding-bottom: 10px;
  margin: 2vh auto;
  h1 {
    font-size: 26px;
    text-align: left;
    padding: 15px 0 0px 35px;
  }
  ${mediaQueryWidth[1]} {
    box-shadow: 0 0 0 #cccccc;
    border-radius: 0;
    min-height: 85vh;
  }
`;

const formStyle = css`
  background: #01aca3;
  color: white;
  width: 280px;
  height: 90px;
  margin: 10px auto 20px auto;
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
    border-radius: 5px;
    border-style: none;
  }
`;

const errorMaxStyle = css`
  width: 280px;
  margin: auto;
  color: #26325b;
  font-size: 16px;
`;

const addButtonStyle = css`
  width: 180px;
  height: 21px;
  margin: 4px auto 5px auto;
  font-size: 16px;
  background: #f4ac40;
  color: white;
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
  border-radius: 10px;
  border-style: none;

  :disabled {
    background: #8b8889;
  }
`;

const errorsStyle = css`
  margin: 3px 0;
  font-size: 14px;
`;

const deleteButtonStyle = css`
  width: 25px;
  height: 20px;
  font-size: 12px;
  /* margin-left: 15px; */
  background: #e0415e;
  /* border: solid #e4361f76; */
  color: white;
  border-radius: 10%;
  border-style: none;
  transition: all 0.3s ease-in 0s;
  :hover {
    background: #e48596;
  }
  :disabled {
    background: #8b8889;
    /* display: none; */
  }
  :disabled:hover {
    background: #cac5c7;
  }
`;

// const deleteImageStyle = css`
//   width: 25px;
//   height: 25px;
// `;

const editButtonStyle = css`
  width: 25px;
  height: 20px;
  font-size: 12px;
  margin-left: 5px;
  background: #977279;
  transition: all 0.3s ease-in 0s;
  :hover {
    background: #c59fa6;
  }
  border: solid #e4361f76;
  color: white;
  border-radius: 10%;
  border-style: none;
`;

const chartDoughnutCategoriesStyle = css`
  width: 250px;
  height: 180px;
  margin: auto;
`;

const categoryBlockStyle = css``;

const budgetBlockStyle = css``;

const formBlocksStyle = css`
  display: flex;
  justify-content: space-around;
`;

const singleCategoryStyle = css`
  display: flex;
  margin: 8px 0;
  flex-direction: column;
`;

const singleLineStyle = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const categoriesListStyle = css`
  width: 280px;
  margin: 0 auto 20px auto;
`;

function getColorDot(index: number) {
  const colorDotStyle = css`
    border-radius: 50%;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    background: ${colors[index]};
  `;
  return colorDotStyle;
}

const categoryNameStyle = css`
  padding: 0 20px;
  width: 120px;
`;

const categoryBudgetStyle = css`
  width: 60px;
`;

const changeFormStyle = css`
  background: #2cada6;
  color: white;
  width: 250px;
  height: 85px;
  margin: 10px auto;
  padding: 5px 5px;
  border-radius: 15px;
  text-align: center;
  font-size: 14px;

  input {
    margin: 5px 5px 0 5px;
    width: 80px;
    border-radius: 5px;
    border-style: none;
  }
`;

const newInfos = css`
  display: flex;
  position: relative;
  top: -20px;
`;

const changeButtonStyle = css`
  position: relative;
  top: -20px;
  width: 90px;
  height: 21px;
  margin: 4px auto 5px auto;
  font-size: 14px;
  background: #f4ac40;
  color: white;
  transition: color 0.3s ease-in 0s;
  :hover {
    color: #04403d;
  }
  border-radius: 10px;
  border-style: none;
`;

const closeChangeFormStyle = css`
  background: none;
  border-style: none;
  position: relative;
  right: -115px;
  top: -2px;
  z-index: 2;
`;

const newNameInputStyle = css``;

const newBudgetInputStyle = css``;

const updateErrorMessageStyle = css`
  margin: 3px 0;
  position: relative;
  top: -20px;
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
  const [updateCategoryName, setUpdateCategoryName] = useState('');
  const [updateCategoryBudget, setUpdateCategoryBudget] = useState('');
  const [editIsClicked, setEditIsClicked] = useState(0);
  const [updateErrors, setUpdateErrors] = useState<UpdateErrors>([]);

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

  if (categories.length === 0) {
    return (
      <Layout userObject={props.userObject}>
        <Head>
          <title>Categories</title>
          <meta name="description" content="Your categories " />
        </Head>
        <div css={mainStyle}>
          <h1>Add your first category</h1>
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
                    Category name
                    <br />
                    <input
                      disabled={maxCategory}
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
                      disabled={maxCategory}
                      type="number"
                      value={monthlyBudget}
                      onChange={(event) =>
                        setMonthlyBudget(event.currentTarget.value)
                      }
                    />
                  </label>
                </div>
              </div>
              <div css={errorsStyle}>
                {errors.map((error) => {
                  return (
                    <div key={`error-${error.message}`}>{error.message}</div>
                  );
                })}
              </div>
              <button css={addButtonStyle} disabled={maxCategory}>
                Add a new category
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
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
          name:
            category &&
            category[0].toUpperCase() + category.slice(1).toLowerCase(),
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
    const categoryList = data.expensesPerCategories.map(
      (expense: { categoryId: number }) => expense.categoryId,
    );
    setCategoriesWithExpense(categoryList);
  }

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
          newCategoryName:
            categoryName &&
            categoryName[0].toUpperCase() + categoryName.slice(1).toLowerCase(),
          newCategoryBudget: categoryBudget,
        },
      }),
    });

    const updatedResponseBody = await updatedResponse.json();

    if ('errors' in updatedResponseBody) {
      setUpdateErrors(updatedResponseBody.errors);
      return updatedResponseBody.errors;
    }
    setUpdateErrors([]);
    setEditIsClicked(0);
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
            data={getDoughnutCategoriesBudgetData(categories).data}
            options={getDoughnutCategoriesBudgetData(categories).options}
          />
        </div>
        <div css={categoriesListStyle}>
          {categories.map((category, index) => {
            const hasExpense = categoriesWithExpense.includes(category.id);
            return (
              <div css={singleCategoryStyle} key={`category-${category.name}`}>
                <div css={singleLineStyle}>
                  <div css={getColorDot(index)} />
                  <div css={categoryNameStyle}>{category.name}</div>
                  <div css={categoryBudgetStyle}>
                    {category.monthlyBudget / 100}€
                  </div>
                  <button
                    aria-label="delete category"
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
                    <Image
                      // css={deleteImageStyle}
                      src="/delete.png"
                      width="20px"
                      height="20px"
                      alt="garbage can"
                    />
                  </button>

                  <button
                    aria-label="edit category"
                    css={editButtonStyle}
                    onClick={() => setEditIsClicked(category.id)}
                  >
                    <Image
                      src="/editer.png"
                      width="20px"
                      height="20px"
                      alt="pen"
                    />
                  </button>
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
                    }}
                  >
                    {' '}
                    <button
                      css={closeChangeFormStyle}
                      aria-label="close form"
                      onClick={() => setEditIsClicked(0)}
                    >
                      <Image
                        // title="Delete"
                        src="/close3.png"
                        width="15px"
                        height="15px"
                        alt="pen"
                      />{' '}
                    </button>
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
                    <div css={updateErrorMessageStyle}>
                      {updateErrors.map((error) => {
                        if (error.categoryId === category.id) {
                          return (
                            <div key={`error-${error.message}`}>
                              {error.message}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <button css={changeButtonStyle}>Change</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
        {maxCategory && (
          <div css={errorMaxStyle}>
            You have reached the maximum number of categories.
          </div>
        )}
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
                  Category name
                  <br />
                  <input
                    disabled={maxCategory}
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
                    disabled={maxCategory}
                    type="number"
                    value={monthlyBudget}
                    onChange={(event) =>
                      setMonthlyBudget(event.currentTarget.value)
                    }
                  />
                </label>
              </div>
            </div>
            <div css={errorsStyle}>
              {errors.map((error) => {
                return (
                  <div key={`error-${error.message}`}>{error.message}</div>
                );
              })}
            </div>
            <button css={addButtonStyle} disabled={maxCategory}>
              Add a new category
            </button>
          </form>
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

  // const currentMonth = new Intl.DateTimeFormat('en-US', {
  //   month: 'numeric',
  // }).format(new Date());

  // const currentYear = new Intl.DateTimeFormat('en-US', {
  //   year: 'numeric',
  // }).format(new Date());

  // const expensesCurrentMonth = await getExpensesByMonthByUser(
  //   Number(currentMonth),
  //   Number(currentYear),
  //   user.id,
  // );

  // const expensesCurrentMonthDateToString = expensesCurrentMonth.map(
  //   (expense) => {
  //     expense.date = expense.date.toISOString();
  //     return expense;
  //   },
  // );

  return {
    props: {
      user: user,
      categories: categories,
      // expensesCurrentMonth: expensesCurrentMonthDateToString,
    },
  };
}

import AddExpense from '../components/AddExpense';

export default function Expenses() {
  const date = new Date();
  const optionsDate = { month: 'long', year: 'numeric' };
  const currentMonth = new Intl.DateTimeFormat('en-US', optionsDate).format(
    date,
  );
  console.log(currentMonth);

  return (
    <>
      <h1>Add an expense</h1>
      <h2>{currentMonth}</h2>
      <AddExpense />
    </>
  );
}

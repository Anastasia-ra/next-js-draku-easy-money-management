export default function AddExpense() {
  // Taken from get server side props --> list of all the categories in the database
  // const categories = [];

  // Send values of input to database
  return (
    <>
      <label>
        Date
        <input type="date"></input>
      </label>
      <label>
        Price
        <input type="number"></input>
      </label>
      <label>
        Name
        <input></input>
      </label>
      <label>
        Category
        <select>
          <option value="">Please choose a category</option>
          <option value="Food">Food</option>
          {/* {categories.map((category) => {
            return <option key={category.id}>{category.name}</option>;
          })} */}
        </select>
      </label>
      <button>Add</button>
    </>
  );
}

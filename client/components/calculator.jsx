import React from 'react';
import AppContext from '../lib/app-context'
import toDollar from '../lib/toDollar';

export default class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      month: null,
      income: 0,
      staticEx: 0,
      savings: 0,
      expenses: {
        food: 0,
        travel: 0,
        entertainment: 0,
        healthcare: 0,
        personal: 0,
        education: 0
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.remainingBudget = this.remainingBudget.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    const userId = window.localStorage.getItem('userId');
    fetch('/api/budgetbuddy/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    })
    .then(response => response.json())
    .then(data => {
      const { income, savings, static: staticEx } = data
      this.setState({income, savings, staticEx})
    })
    .catch(err => console.log('ERROR'))
    fetch('/api/budgetbuddy/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId })
    })
    .then(response => response.json())
    .then(data => {
      const { education, entertainment, food, healthcare, personal, travel } = data
      this.setState({ expenses: {education, entertainment, food, healthcare, personal, travel}})
    })
    .catch(err => console.log('ERROR'))
  }
  handleChange(event) {
    if(event.target.type === 'range') {
      const targetId = event.target.id;
      const copyExpenses = { ...this.state.expenses };
      copyExpenses[targetId] = event.target.value;
      this.setState({ expenses: copyExpenses })
    }
    if(event.target.type === 'month') {
      this.setState({month: event.target.value})
    }
    if (event.target.type === 'number') {
      const targetId = event.target.id;
      this.setState({[targetId]: event.target.value})
    }
  }
  handleSubmit() {
    event.preventDefault()
    fetch('/api/budgetbuddy/create_budget',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        budgetId: this.context.userId,
        userId: this.context.userId,
        income: this.state.income,
        savings: this.state.savings,
        staticEx: this.state.staticEx,
      })
    })
    .catch(err => console.log('ERROR'))
    fetch('/api/budgetbuddy/budget_category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: this.context.userId,
        userId: this.context.userId,
        food: this.state.expenses.food,
        travel: this.state.expenses.travel,
        entertainment: this.state.expenses.entertainment,
        healthcare: this.state.expenses.healthcare,
        personal: this.state.expenses.personal,
        education: this.state.expenses.education
      })
    })
    .then(() => {
      window.location.reload(true)
    })
    .catch(err => console.log('ERROR'))
  }
  remainingBudget() {
    let remains = 100;
    const expenses = {...this.state.expenses}
    for (let x in expenses){
      remains -= expenses[x]
    }
    return remains
  }
  render() {
    const remainingBudget = this.remainingBudget();
    const budget = this.state.income - this.state.staticEx - this.state.savings;
    return(
      <>
        <div className="container">
          <div className="form-group mt-4">
            <label htmlFor="start">Display Budget For: </label>
            <input className="form-control d-inline" type="month" id="start" name="start" onChange={this.handleChange}/>
          </div>
          <div className="d-flex justify-content-around text-center">
            <div>
              <h6>Available to budget:</h6>
              <h3>{toDollar(budget * (remainingBudget / 100))}</h3>
            </div>
            <div>
              <h6>Remaining spendings:</h6>
              <h3>$0</h3>
            </div>
         </div>
        </div>
        <div className="mt-2">
          <table className="table table-striped text-center table-responsive-sm">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Budgeted</th>
                <th scope="col">Spent</th>
                <th scope="col">Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Food &amp; Drink</td>
                <td>{toDollar(budget * (this.state.expenses.food / 100))}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Travel</td>
                <td>{toDollar(budget * (this.state.expenses.travel / 100))}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Entertainment</td>
                <td>{toDollar(budget * (this.state.expenses.entertainment / 100))}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Healthcare</td>
                <td>{toDollar(budget * (this.state.expenses.healthcare / 100))}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Personal</td>
                <td>{toDollar(budget * (this.state.expenses.personal / 100))}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Education</td>
                  <td>{toDollar(budget * (this.state.expenses.education / 100))}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center mb-2">
          <button className="btn btn-success" data-toggle="modal" data-target="#budgetForm">Edit Budget Information</button>
        </div>
        <div className="modal fade" id="budgetForm" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="budgetFormLabel">Monthly Budget</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body container">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label className="mb-0" htmlFor="income">Monthly net income</label>
                    <small className="text-muted d-block mb-2">
                      Income after taxes
                    </small>
                    <input type="number" id="income" className="form-control" onChange={this.handleChange} value={this.state.income} />
                  </div>
                  <div className="form-group">
                    <label className="mb-0" htmlFor="staticEx">Monthly static costs</label>
                    <small className="text-muted d-block mb-2">
                      Rent, mortgage, insurance, subscriptions, etc.
                    </small>
                    <input type="number" id="staticEx" className="form-control" onChange={this.handleChange} value={this.state.staticEx} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="income">Desired monthly savings?</label>
                    <input type="number" id="savings" className="form-control" onChange={this.handleChange} value={this.state.savings} />
                  </div>
                  <div className="text-center">
                    <h5>Allocate your spendings</h5>
                    <h6>Remaining: {`${remainingBudget}%`}</h6>
                  </div>
                  <div className="form-group">
                    <label htmlFor="food">Food &amp; Drink</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="food" className="form-control" min="0" max="100"  value={this.state.expenses.food}/>
                      <p className="ml-2 mb-0">{`${this.state.expenses.food}%`}</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="entertainment">Entertainment</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="entertainment" className="form-control" min="0" max="100" value={this.state.expenses.entertainment}/>
                      <p className="ml-2 mb-0">{`${this.state.expenses.entertainment}%`}</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="travel">Travel</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="travel" className="form-control" min="0" max="100" value={this.state.expenses.travel}/>
                      <p className="ml-2 mb-0">{`${this.state.expenses.travel}%`}</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="healthcare">Healthcare</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="healthcare" className="form-control" min="0" max="100" value={this.state.expenses.healthcare} />
                      <p className="ml-2 mb-0">{`${this.state.expenses.healthcare}%`}</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="personal">Personal</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="personal" className="form-control" min="0" max="100" value={this.state.expenses.personal} />
                      <p className="ml-2 mb-0">{`${this.state.expenses.personal}%`}</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="education" className="form-control" min="0" max="100" value={this.state.expenses.education} />
                      <p className="ml-2 mb-0">{`${this.state.expenses.education}%`}</p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-success">Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

Calculator.contextType = AppContext;

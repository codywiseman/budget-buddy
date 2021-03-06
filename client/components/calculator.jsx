import React from 'react';
import AppContext from '../lib/app-context'
import toDollar from '../lib/to-dollar';
import { parseMonth, parseYear, currentDate } from '../lib/parse-date';

const styles = {
  table: {
    width: '25%'
  },
  budgetOver: {
    color: 'red'
  }
}

export default class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      month: parseMonth(currentDate()),
      year: parseYear(currentDate()),
      date: currentDate(),
      income: 0,
      staticEx: 0,
      savings: 0,
      expenses: {
        food: 0,
        travel: 0,
        entertainment: 0,
        healthcare: 0,
        personal: 0,
        education: 0,
        services: 0,
        misc: 0
      },
      spent: {
        food: 0,
        travel: 0,
        entertainment: 0,
        healthcare: 0,
        personal: 0,
        education: 0,
        services: 0,
        misc: 0
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.remainingBudget = this.remainingBudget.bind(this)
    this.totalspent = this.totalSpent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addTotalSpent = this.addTotalSpent.bind(this)
    this.editBudget = this.editBudget.bind(this)
    this.getIncome = this.getIncome.bind(this)
    this.getExpenses = this.getExpenses.bind(this)
  }
  componentDidMount() {
    this.getIncome()
    this.getExpenses()
    this.addTotalSpent()
  }
  handleSubmit() {
    event.preventDefault()
    this.editBudget();
  }
  handleChange(event) {
    if(event.target.type === 'range') {
      const targetId = event.target.id;
      const copyExpenses = { ...this.state.expenses };
      if (this.remainingBudget() < 1 && copyExpenses[targetId] < event.target.value) {
        return;
      } else {
        copyExpenses[targetId] = event.target.value;
        this.setState({ expenses: copyExpenses })
      }
    }
    if(event.target.type === 'month') {
      const month = parseMonth(event.target.value)
      const year = parseYear(event.target.value)
      this.setState({month, year})
      this.addTotalSpent();
    }
    if (event.target.type === 'number' && event.target.className === 'form-control') {
      const targetId = event.target.id;
      this.setState({[targetId]: event.target.value})
    }
    if (event.target.type === 'number' && event.target.className === 'sliders ml-2 mb-0') {
      console.log(event.target.value);
      const targetName = event.target.name;
      const copyExpenses = { ...this.state.expenses };
      copyExpenses[targetName] = event.target.value;
      this.setState({expenses: copyExpenses})
    }
  }
  getIncome() {
    fetch('/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: this.context.userId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          return
        } else {
          const { income, savings, static: staticEx } = data
          this.setState({ income, savings, staticEx })
        }
      })
      .catch(err => console.log('ERROR'))
  }
  getExpenses() {
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: this.context.userId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          return
        } else {
          const {
            education,
            entertainment,
            food,
            healthcare,
            personal,
            travel,
            services,
            misc } = data;
          this.setState({
            expenses: {
              education,
              entertainment,
              food,
              healthcare,
              personal,
              travel,
              services,
              misc
            }
          });
        }
      })
      .catch(err => console.log('ERROR'))
  }
  editBudget() {
    fetch('/api/create-budget', {
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
    fetch('/api/budget-category', {
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
        education: this.state.expenses.education,
        services: this.state.expenses.services,
        misc: this.state.expenses.misc
      })
    })
      .then(response => {
        window.location.reload(true)
      })
      .catch(err => console.log('ERROR'))
  }
  addTotalSpent() {
    fetch('api/export-transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: this.context.userId })
    })
      .then(response => response.json())
      .then(transactionData => {
        const spent = {
          food: 0,
          travel: 0,
          entertainment: 0,
          healthcare: 0,
          personal: 0,
          education: 0,
          services: 0,
          misc: 0
        }
        transactionData.map(item => {
          if(item.category === 'notIncl' || item.category === null) {
            return
          } else if(this.state.month === item.month && this.state.year === item.year) {
            spent[item.category] = spent[item.category] + item.amount
          }
        })
        this.setState({spent})
      })
      .catch(err => console.log('ERROR'))
  }
  remainingBudget() {
    let remains = 100;
    const expenses = {...this.state.expenses}
    for (let x in expenses) {
      remains -= expenses[x]
    }
    return remains
  }
  totalSpent() {
    let spent = 0;
    const spendings = { ...this.state.spent }
    for (let x in spendings) {
      spent += spendings[x]
    }
    return spent
  }
  render() {
    const copyExpenses = {...this.state.expenses}
    const remainingBudget = this.remainingBudget();
    const totalSpent = this.totalSpent();
    const budget = this.state.income - this.state.staticEx - this.state.savings;
    return(
      <>
        <div className="container">
          <div className="form-group mt-4">
            <label>Display Budget For: </label>
            <input className="form-control d-inline" type="month" defaultValue={this.state.date} onChange={this.handleChange}/>
          </div>
          <div className="d-flex justify-content-around text-left-md text-center">
            <div>
              <h6>Available to budget:</h6>
              <h3>{toDollar(budget * (remainingBudget / 100))}</h3>
            </div>
            <div>
              <h6>Remaining spendings:</h6>
              <h3>{toDollar(budget - totalSpent)}</h3>
            </div>
         </div>
        </div>
        <div className="mt-2 container">
          <table className="table table-striped table-responsive-sm">
            <thead>
              <tr>
                <th className="text-center" scope="col" style={styles.table}>Category</th>
                <th className="text-center" scope="col" style={styles.table}>Budgeted</th>
                <th className="text-center" scope="col" style={styles.table}>Spent</th>
                <th className="text-center" scope="col" style={styles.table}>Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Food &amp; Drink</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.food / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.food)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.food / 100) - this.state.spent.food)}</td>
              </tr>
              <tr>
                <td>Travel</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.travel / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.travel)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.travel / 100) - this.state.spent.travel)}</td>
              </tr>
              <tr>
                <td>Entertainment</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.entertainment / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.entertainment)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.entertainment / 100) - this.state.spent.entertainment)}</td>
              </tr>
              <tr>
                <td>Healthcare</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.healthcare / 100))}</td>
                <td className="text-right"> {toDollar(this.state.spent.healthcare)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.healthcare / 100) - this.state.spent.healthcare)}</td>
              </tr>
              <tr>
                <td>Personal</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.personal / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.personal)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.personal / 100) - this.state.spent.personal)}</td>
              </tr>
              <tr>
                <td>Education</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.education / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.education)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.education / 100) - this.state.spent.education)}</td>
              </tr>
              <tr>
                <td>Services</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.services / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.services)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.services / 100) - this.state.spent.services)}</td>
              </tr>
              <tr>
                <td>Misc</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.misc / 100))}</td>
                <td className="text-right">{toDollar(this.state.spent.misc)}</td>
                <td className="text-right">{toDollar(budget * (this.state.expenses.misc / 100) - this.state.spent.misc)}</td>
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
                    <h6 style={remainingBudget < 0 ? styles.budgetOver : null }>Remaining: {`${remainingBudget}%`}</h6>
                  </div>
                  <div className="form-group">
                    <label htmlFor="food">Food &amp; Drink ({toDollar(budget * (this.state.expenses.food/100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="food" className="form-control" min="0" max="100"  value={this.state.expenses.food}/>
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="food" value={copyExpenses.food} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="entertainment">Entertainment ({toDollar(budget * (this.state.expenses.entertainment / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="entertainment" className="form-control" min="0" max="100" value={this.state.expenses.entertainment}/>
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="entertainment" value={copyExpenses.entertainment} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="travel">Travel ({toDollar(budget * (this.state.expenses.travel / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="travel" className="form-control" min="0" max="100" value={this.state.expenses.travel}/>
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="travel" value={copyExpenses.travel} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="healthcare">Healthcare ({toDollar(budget * (this.state.expenses.healthcare / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="healthcare" className="form-control" min="0" max="100" value={this.state.expenses.healthcare} />
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="healthcare" value={copyExpenses.healthcare} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="personal">Personal ({toDollar(budget * (this.state.expenses.personal / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="personal" className="form-control" min="0" max="100" value={this.state.expenses.personal} />
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="personal" value={copyExpenses.personal} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education ({toDollar(budget * (this.state.expenses.education / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="education" className="form-control" min="0" max="100" value={this.state.expenses.education} />
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="education" value={copyExpenses.education} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="services">Services ({toDollar(budget * (this.state.expenses.services / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="services" className="form-control" min="0" max="100" value={this.state.expenses.services} />
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="services" value={copyExpenses.services} onChange={this.handleChange} /><span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="misc">Misc. ({toDollar(budget * (this.state.expenses.misc / 100))})</label>
                    <div className="d-flex align-items-center">
                      <input onChange={this.handleChange} type="range" id="misc" className="form-control" min="0" max="100" value={this.state.expenses.misc} />
                      <input type="number" min="0" max="100" className="sliders ml-2 mb-0" name="misc" value={copyExpenses.misc} onChange={this.handleChange} /><span>%</span>
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

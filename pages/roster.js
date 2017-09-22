// Module imports
import React from 'react'
import ReactTable from 'react-table'





// Component imports
import Page from '../components/Page'





// Component imports
const title = 'Roster'





class Roster extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    console.log(`Let's get some users!`)
    this.setState({ loading: false })
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true,
    }
  }

  render () {
    let {
      loading,
    } = this.state

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h2>{title}</h2>
        </header>

        <div className="page-content">
          <ReactTable
            columns={this.columns}
            data={[]}
            loading={loading}
            manual
            showPagination={false} />
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: datum => datum.attributes['user.displayRat.name'] || datum.attributes.rats[0],
        className: 'name',
        Header: 'Name',
        headerClassName: 'name',
        id: 'name',
        resizable: true,
        sortable: true,
      },
      // rat drilled status
      // dispatch drilled status
      // overseer status
      // join date
    ]
  }
}





export default Page(Roster, title)

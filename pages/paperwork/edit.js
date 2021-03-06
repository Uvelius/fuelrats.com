// Component imports
import Component from '../../components/Component'
import Page from '../../components/Page'
import FirstLimpetInput from '../../components/FirstLimpetInput'
import RatTagsInput from '../../components/RatTagsInput'
import SystemTagsInput from '../../components/SystemTagsInput'





// Component constants
const title = 'Paperwork'





class Paperwork extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    const { id } = this.props.query

    if (id) {
      this.props.retrievePaperwork(id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.rescue !== nextProps.rescue) {
      this.setState({
        firstLimpetId: nextProps.firstLimpetId,
        rats: nextProps.rats,
        system: { value: nextProps.rescue.attributes.system },
        rescue: nextProps.rescue,
      })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'onSubmit',
      'handleChange',
      'handleFirstLimpetChange',
      'handleRatsChange',
      'handleSystemChange',
    ])

    this.state = {
      firstLimpetId: null,
      rats: null,
      rescue: null,
      system: null,
    }
  }

  handleChange (event) {
    const newState = Object.assign({}, this.state)
    const {
      checked,
      name,
      type,
    } = event.target
    const attribute = name
    let { value } = event.target

    value = type === 'checkbox' ? checked : value

    if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    newState.rescue.attributes[attribute] = value

    if (attribute === 'platform') {
      newState.firstLimpetId = null
      newState.rats = []
      newState.rescue.attributes.firstLimpetId = null
    }

    this.dirtyFields.add(attribute)

    this.setState(newState)
  }


  handleFirstLimpetChange(value) {
    const {
      rescue,
    } = this.state
    const newState = { ...this.state }

    if (value.length && (value[0].id !== rescue.attributes.firstLimpetId)) {
      [newState.firstLimpetId] = value
      newState.rescue.attributes.firstLimpetId = value[0].id
    } else if (!value.length && rescue.attributes.firstLimpetId) {
      newState.firstLimpetId = null
      newState.rescue.attributes.firstLimpetId = null
    }

    this.setState(newState)
    this.dirtyFields.add('firstLimpetId')
  }

  handleSystemChange(value) {
    const {
      rescue,
    } = this.state
    const newState = { ...this.state }

    if (value.length && (value[0].value !== rescue.attributes.system)) {
      [newState.system] = value
      newState.rescue.attributes.system = value[0].value
    } else if (!value.length && rescue.attributes.system) {
      newState.system = null
      newState.rescue.attributes.system = null
    }

    this.setState(newState)
    this.dirtyFields.add('system')
  }

  handleRatsChange (value) {
    const newRatIds = value.map(rat => rat.id)
    const oldRatIds = this.props.rats.map(rat => rat.id)

    if (newRatIds.join(',') !== oldRatIds.join(',')) {
      const newState = Object.assign({}, this.state)

      newState.rats = value

      if (!value.find(rat => newState.rescue.attributes.firstLimpetId === rat.id)) {
        newState.firstLimpetId = null
        newState.rescue.attributes.firstLimpetId = null
      }

      this.setState(newState)
      this.dirtyFields.add('rats')
    }
  }

  async onSubmit (event) {
    event.preventDefault()

    const {
      rats,
      rescue,
    } = this.state
    const rescueUpdates = {}
    let ratUpdates = null

    for (const field of this.dirtyFields) {
      if (field !== 'rats') {
        rescueUpdates[field] = rescue.attributes[field]
      }
    }

    if (!rescue.attributes.outcome) {
      rescueUpdates.outcome = 'success'
    }

    if (this.dirtyFields.has('rats')) {
      const oldRats = rescue.relationships.rats.data

      ratUpdates = {
        added: rats.filter(rat => !oldRats.find(oldRat => rat.id === oldRat.id)),
        removed: oldRats.filter(oldRat => !rats.find(rat => oldRat.id === rat.id)),
      }
    }

    await this.props.submitPaperwork(rescue.id, rescueUpdates, ratUpdates)

    this.dirtyFields.clear()

    /* eslint-disable no-global-assign, no-restricted-globals */
    location = `/paperwork/${rescue.id}`
    /* eslint-enable */
  }

  render () {
    const {
      retrieving,
      submitting,
    } = this.props
    const {
      firstLimpetId,
      system,
      rats,
      rescue,
    } = this.state

    const classes = ['page-content']

    if (submitting) {
      classes.push('loading', 'force')
    }

    const ratNameTemplate = rat => `${rat.attributes.name} [${rat.attributes.platform.toUpperCase()}]`

    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {retrieving && (
          <div className="loading page-content" />
        )}

        {(!retrieving && !rescue) && (
          <div className="loading page-content">
            <p>Sorry, we couldn't find the paperwork you requested.</p>
          </div>
        )}

        {(!retrieving && rescue) && (
          <form
            className={classes.join(' ')}
            onSubmit={this.onSubmit}>
            <fieldset>
              <label htmlFor="platform-pc">What platform was the rescue on?</label>

              <div className="option-group">
                <input
                  checked={rescue.attributes.platform === 'pc'}
                  disabled={submitting || retrieving}
                  id="platform-pc"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="pc" /> <label htmlFor="platform-pc">PC</label>

                <input
                  checked={rescue.attributes.platform === 'xb'}
                  disabled={submitting || retrieving}
                  id="platform-xb"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

                <input
                  checked={rescue.attributes.platform === 'ps'}
                  disabled={submitting || retrieving}
                  id="platform-ps"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="ps" /> <label htmlFor="platform-ps">Playstation 4</label>
              </div>
            </fieldset>

            <fieldset>
              <label htmlFor="outcome-success">Was the rescue successful?</label>

              <div className="option-group">
                <input
                  checked={!rescue.attributes.outcome || (rescue.attributes.outcome === 'success')}
                  disabled={submitting || retrieving}
                  id="outcome-success"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="success" /> <label htmlFor="outcome-success">Yes</label>

                <input
                  checked={rescue.attributes.outcome === 'failure'}
                  disabled={submitting || retrieving}
                  id="outcome-failure"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="failure" /> <label htmlFor="outcome-failure">No</label>

                <input
                  checked={rescue.attributes.outcome === 'other'}
                  disabled={submitting || retrieving}
                  id="outcome-other"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="other" /> <label htmlFor="outcome-other">Other</label>

                <input
                  checked={rescue.attributes.outcome === 'invalid'}
                  disabled={submitting || retrieving}
                  id="outcome-invalid"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="invalid" /> <label htmlFor="outcome-invalid">Invalid</label>
              </div>
            </fieldset>

            <fieldset>
              <label htmlFor="codeRed-yes">Was it a code red?</label>

              <div className="option-group">
                <input
                  checked={rescue.attributes.codeRed}
                  disabled={submitting || retrieving}
                  id="codeRed-yes"
                  name="codeRed"
                  onChange={this.handleChange}
                  type="radio"
                  value /> <label htmlFor="codeRed-yes">Yes</label>

                <input
                  checked={!rescue.attributes.codeRed}
                  disabled={submitting || retrieving}
                  id="codeRed-no"
                  name="codeRed"
                  onChange={this.handleChange}
                  type="radio"
                  value="false" /> <label htmlFor="codeRed-no">No</label>
              </div>
            </fieldset>

            <fieldset>
              <label htmlFor="rats">Who arrived for the rescue?</label>

              <RatTagsInput
                data-platform={rescue.attributes.platform}
                disabled={submitting || retrieving}
                name="rats"
                onChange={this.handleRatsChange}
                value={rats}
                valueProp={ratNameTemplate} />
            </fieldset>

            <fieldset>
              <label htmlFor="firstLimpetId">Who fired the first limpet?</label>

              <FirstLimpetInput
                data-single
                disabled={submitting || retrieving}
                name="firstLimpetId"
                onChange={this.handleFirstLimpetChange}
                options={rats}
                value={firstLimpetId}
                valueProp={ratNameTemplate} />
            </fieldset>

            <fieldset>
              <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put "n/a" if not applicable)</small></label>

              <SystemTagsInput
                data-allownew
                disabled={submitting || retrieving}
                name="system"
                onChange={this.handleSystemChange}
                data-single
                value={system} />
            </fieldset>

            <fieldset>
              <label htmlFor="notes">Notes</label>

              <textarea
                disabled={submitting || retrieving}
                id="notes"
                name="notes"
                onChange={this.handleChange}
                value={rescue.attributes.notes} />
            </fieldset>

            <menu type="toolbar">
              <div className="primary">
                <button
                  disabled={submitting || retrieving || !this.validate()}
                  type="submit">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              <div className="secondary" />
            </menu>
          </form>
        )}
      </div>
    )
  }

  validate () {
    const { rescue } = this.state

    switch (rescue.attributes.outcome) {
      case 'other':
      case 'invalid':
        return this.validateCaseWithInvalidOutcome()
      case 'success':
      case 'failure':
      default:
        return this.validateCaseWithValidOutcome()
    }
  }

  validateCaseWithValidOutcome() {
    const {
      rats,
      rescue,
    } = this.state

    if ((!rescue.attributes.outcome || rescue.attributes.outcome === 'success') && !rescue.attributes.firstLimpetId) {
      return false
    }

    if (!rats || !rats.length) {
      return false
    }

    if (!rescue.attributes.system || !rescue.attributes.platform) {
      return false
    }

    return true
  }

  validateCaseWithInvalidOutcome() {
    const { rescue } = this.state

    return Boolean(rescue.attributes.notes.replace(/\s/g, ''))
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get dirtyFields () {
    return this._dirtyFields || (this._dirtyFields = new Set)
  }
}





const mapDispatchToProps = ['submitPaperwork', 'retrievePaperwork']

const mapStateToProps = state => {
  const { paperwork } = state
  const { rescueId } = paperwork
  let firstLimpetId = []
  let rats = []
  let rescue = null

  if (rescueId) {
    rescue = state.rescues.rescues.find(item => item.id === rescueId)
  }

  if (rescue) {
    if (rescue.relationships.firstLimpet.data) {
      firstLimpetId = state.rats.rats.filter(rat => rescue.relationships.firstLimpet.data.id === rat.id)
    }

    rats = state.rats.rats
      .filter(rat => rescue.relationships.rats.data.find(({ id }) => rat.id === id))
      .map(rat => ({
        id: rat.id,
        value: rat.attributes.name,
        ...rat,
      }))
  }

  return Object.assign({
    firstLimpetId,
    rats,
    rescue,
  }, paperwork)
}





export default Page(Paperwork, title, {
  mapStateToProps,
  mapDispatchToProps,
})

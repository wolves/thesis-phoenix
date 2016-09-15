import renderer from 'react-test-renderer'
import ThesisEditor from '../web/static/js/thesis-editor.js'

jest.mock('react/lib/ReactDefaultInjection')

it('renders correctly', () => {
  const external = {}
  const tree = renderer.create(
    <ThesisEditor external={external} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

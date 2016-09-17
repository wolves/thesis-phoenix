import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import ThesisEditor from '../web/static/js/components/thesis-editor.js'

// jest.mock('react/lib/ReactDefaultInjection')
jest.mock('react-dom')

const mockExternal = () => {
  let title = "Doc title"
  let description = "Description"
  let redirectURL = null
  return {
    ospryPublicKey: null,
    pageRedirectURL: null,
    template: null,
    templates: [],
    dynamicPage: false,
    path: "/test",
    getTitle: () => title,
    setTitle: (t) => title = t,
    getDescription: () => description,
    setDescription: (desc) => description = desc,
    getRedirectURL: () => redirectURL,
    setRedirectURL: (url) => redirectURL = url,
    save: (page, contents, callback) => callback(),
    delete: (path, callback) => callback()
  }
}

it('renders correctly', () => {
  const tree = renderer.create(
    <ThesisEditor external={mockExternal()} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

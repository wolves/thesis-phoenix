import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import ThesisEditor from '../assets/js/components/thesis-editor.js'

jest.mock('react-dom')

const mockExternal = (overrides={}) => {
  let title = "Doc title"
  let description = "Description"
  let redirectURL = null
  return Object.assign({
    ospryPublicKey: null,
    pageRedirectURL: null,
    template: null,
    templates: [],
    isDynamicPage: false,
    path: "/test",
    getTitle: () => title,
    setTitle: (t) => title = t,
    getDescription: () => description,
    setDescription: (desc) => description = desc,
    getRedirectURL: () => redirectURL,
    setRedirectURL: (url) => redirectURL = url,
    save: (page, contents, callback) => callback(),
    delete: (path, callback) => callback()
  }, overrides)
}

it('renders ThesisEditor', () => {
  const tree = renderer.create(<ThesisEditor external={mockExternal({})} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders ThesisEditor with an add button', () => {
  const external = mockExternal({
    templates: ['dynamic', 'other']
  })
  const tree = renderer.create(<ThesisEditor external={external} />).toJSON()
  expect(tree).toMatchSnapshot()
})

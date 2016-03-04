import React, { PropTypes } from 'react'
import {Editor, EditorState, ContentState, RichUtils} from 'draft-js'
import EditorToolbar from './editor_toolbar'

// Currently the only way to expose `DraftPasteProcessor#processHTML`
// but keep an eye on this issue:
// https://github.com/facebook/draft-js/issues/55
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor'

class PageContentEditor extends React.Component {
  constructor (props) {
    super(props)
    console.log(props.defaultContent)
    this.state = {editorState: (this.stateWithContent(props.defaultContent))}

    // Rebind function contexts
    this.onChange = this.onChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
  }

  stateWithContent (text) {
    const blocksArray = DraftPasteProcessor.processHTML(text)
    const contentState = ContentState.createFromBlockArray(blocksArray)
    return EditorState.createWithContent(contentState)
  }

  onChange (editorState) {
    this.setState({editorState})
  }

  handleKeyCommand (command) {
    const {editorState} = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  toggleBlockType (blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  toggleInlineStyle (inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }

  render () {
    const {editorState} = this.state
    return (
      <div className="RichEditor-root">
        <EditorToolbar
          editorState={editorState}
          onToggleBlockType={this.toggleBlockType}
          onToggleInlineStyle={this.toggleInlineStyle}
        />
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
        />
      </div>
    )
  }
}

PageContentEditor.propTypes = {
  defaultContent: PropTypes.string.isRequired
}

export default PageContentEditor


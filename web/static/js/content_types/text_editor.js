class TextEditor {
  constructor (opts) {
    this.editors = document.querySelectorAll('.thesis-content-text')
    this.enabled = false

    this.changed = this.changed.bind(this)
    this.onChange = opts.onChange
  }

  enable () {
    if (this.enabled) return
    for (let i = 0; i < this.editors.length; i++) {
      const ed = this.editors[i]
      ed.contentEditable = true
      ed.addEventListener('input', this.changed, false)
      ed.addEventListener('keydown', this.changed, false)
    }
    this.enabled = true
  }

  disable () {
    if (!this.enabled) return
    for (let i = 0; i < this.editors.length; i++) {
      const ed = this.editors[i]
      ed.contentEditable = false
      ed.removeEventListener('input', this.changed, false)
      ed.removeEventListener('keydown', this.changed, false)
    }
    this.enabled = false
  }

  content (ed) {
    return ed.textContent
  }

  set (name, data) {
    const ed = document.querySelector(`[data-thesis-content-id='${name}']`)
    if (!ed) return
    ed.innerHTML = data.content
    ed.classList.add('modified')
  }

  changed (e) {
    e.currentTarget.classList.add('modified')
    if (e.keyCode === 13) e.preventDefault()

    this.onChange()
  }
}

export default TextEditor

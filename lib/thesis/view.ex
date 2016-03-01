defmodule Thesis.View do
  import Phoenix.HTML, only: [raw: 1, safe_to_string: 1]
  import Phoenix.HTML.Tag
  import Thesis.Config
  alias Thesis.Page

  @styles File.read!("priv/static/thesis.css")
  @external_resource "priv/static/thesis.css"

  def content(conn, name, type, do: default_content) do
    page = current_page(conn)
    opts = [default: default_content]
    content = store.find_or_create_page_content(page.id, name, type, opts)
    render_editable(content)
  end

  def current_page(conn) do
    store.find_or_create_page(conn.request_path)
  end

  def thesis_editor(conn) do
    if editable?(conn) do
      editor = content_tag(:div, "", id: "thesis-editor")
      safe_concat([thesis_style, editor])
    end
  end

  def thesis_style do
    content_tag :style, @styles
  end

  defp editable?(conn) do
    Application.get_env(:thesis, :authentication).page_is_editable?(conn)
  end

  defp safe_concat(list) do
    list
    |> Enum.map(&safe_to_string/1)
    |> Enum.join
    |> raw
  end

  defp render_editable(%{content_type: "html"} = page_content) do
    raw("""
      <div class='thesis-content thesis-content-html' data-thesis-content-id='#{page_content.id}'>
        #{page_content.content}
      </div>
    """)
  end

  defp render_editable(%{content_type: "text"} = page_content) do
    raw("""
      <div class='thesis-content thesis-content-text' data-thesis-content-id='#{page_content.id}'>
        #{page_content.content}
      </div>
    """)
  end

  defp render_editable(%{content_type: "image"} = page_content) do
    raw("""
      <div class='thesis-content thesis-content-image' data-thesis-content-id='#{page_content.id}'>
        <img src='#{page_content.content}' />
      </div>
    """)
  end
end

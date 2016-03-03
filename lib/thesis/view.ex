defmodule Thesis.View do
  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]
  import Phoenix.HTML.Tag
  import Thesis.Config

  @styles File.read!(Path.join(__DIR__, "../../priv/static/thesis.css"))
  @external_resource Path.join(__DIR__, "../../priv/static/thesis.css")

  def content(conn, name, type, do: {:safe, _} = default_content) do
    all_content = conn.assigns[:thesis_content]
    if all_content do
      page = current_page(conn)
      content = all_content[name] || make_content(page, name, type, default_content)
      render_editable(content)
    else
      raise controller_missing_text
    end
  end

  def content(conn, name, type, do: default_content) do
    content(conn, name, type, html_escape(default_content))
  end

  def current_page(conn) do
    store.page(conn.request_path)
  end

  def make_content(page, name, type, content) do
    %Thesis.PageContent{page_id: page.id, name: name,
      content_type: Atom.to_string(type),
      content: safe_to_string(content) }
  end

  def thesis_editor(conn) do
    if editable?(conn) do
      editor = content_tag(:div, "", id: "thesis-editor-container")
      safe_concat([thesis_style, editor])
    end
  end

  def thesis_style do
    content_tag :style, @styles
  end

  defp editable?(conn) do
    Application.get_env(:thesis, :authorization).page_is_editable?(conn)
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

  defmacro __using__(_) do
    # Reserved for future use
    quote do
      import unquote(__MODULE__)
    end
  end
end

defmodule Thesis.View do
  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]
  import Phoenix.HTML.Tag
  import Thesis.Config
  import HtmlSanitizeEx

  @styles File.read!(Path.join(__DIR__, "../../priv/static/thesis.css"))
  @external_resource Path.join(__DIR__, "../../priv/static/thesis.css")

  def content(conn, name, type, do: {:safe, _} = default_content) do
    content(conn, name, type, do: safe_to_string(default_content))
  end

  def content(conn, name, type, do: default_content) when is_binary(default_content) do
    all_content = conn.assigns[:thesis_content]
    if all_content do
      page = current_page(conn)
      content = all_content[name] || make_content(page, name, type, default_content)
      render_editable(content)
    else
      raise controller_missing_text
    end
  end

  def current_page(conn) do
    # TODO: Move the current page retrieval into the controller
    store.page(conn.request_path) || make_page(conn.request_path)
  end

  def make_page(request_path) do
    %Thesis.Page{slug: request_path}
  end

  def make_content(page, name, type, content) do
    %Thesis.PageContent{page_id: page.id, name: name,
      content_type: Atom.to_string(type), content: content }
  end

  def thesis_editor(conn) do
    if editable?(conn) do
      editor = content_tag(:div, "", id: "thesis-editor-container")
      safe_concat([thesis_style, editor, thesis_js])
    end
  end

  def thesis_style do
    content_tag :style, @styles
  end

  def thesis_js do
    raw """
    <script>
      ;(function () {
        var loadThesis = function () {
          var script = document.createElement('script')
          script.src = '/thesis/thesis-editor.js'

          document.head.appendChild(script)
        }

        document.addEventListener('DOMContentLoaded', function (event) {
          if (document.querySelector('#thesis-editor-container')) {
            loadThesis()
          }
        })
      })()
    </script>
    """
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

  defp render_wrapper_attributes(%{content_type: content_type} = page_content) do
    classes = "class=\"thesis-content thesis-content-#{content_type}\""
    data_content_type = "data-thesis-content-type=\"#{content_type}\""
    data_content_id = "data-thesis-content-id=\"#{page_content.name}\""
    "#{classes} #{data_content_type} #{data_content_id}"
  end

  defp render_editable(%{content_type: "html"} = page_content) do
    raw("""
      <div #{render_wrapper_attributes(page_content)}>
        #{basic_html(page_content.content)}
      </div>
    """)
  end

  defp render_editable(%{content_type: "text"} = page_content) do
    raw("""
      <div #{render_wrapper_attributes(page_content)}>
        #{safe_to_string(html_escape(page_content.content))}
      </div>
    """)
  end

  defp render_editable(%{content_type: "image"} = page_content) do
    raw("""
      <div #{render_wrapper_attributes(page_content)}>
        <img src='#{safe_to_string(html_escape(page_content.content))}' />
      </div>
    """)
  end

  defp render_editable(%{content_type: nil} = page_content) do
    render_editable(Map.put(page_content, :content_type, "text"))
  end

  defmacro __using__(_) do
    # Reserved for future use
    quote do
      import unquote(__MODULE__)
    end
  end
end

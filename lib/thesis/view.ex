defmodule Thesis.View do
  @moduledoc """
  Provides several view helper functions, including the primary `content/4`
  function. Look at individual function documentation to learn more about them.

  Typically, you'll add this to your `web/web.ex` file, under the `view`
  function:

      def view do
        quote do
          use Thesis.View
          # ...
        end
      end

  If you'd prefer, you can remove it from `web/web.ex` and add it to your views
  yourself:

      defmodule MyApp.MyView do
        use Thesis.View
        # ...
  """

  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]
  import Phoenix.HTML.Tag
  import Thesis.Config
  import HtmlSanitizeEx

  # @styles File.read!(Path.join(__DIR__, "../../priv/static/thesis.css"))
  # @external_resource Path.join(__DIR__, "../../priv/static/thesis.css")

  @doc """
  Creates an editable content area in an eex template. Returns HTML-safe
  string if type is `:html` or just a string if `:text`.

  ## Examples

      <%= content(@conn, "Title", :text, do: "Default Title") %>
      <%= content(@conn, "Description", :html) do %>
        <p>Default description</p>
        <p>Another paragraph</p>
      <% end %>
  """
  @spec content(Plug.Conn.t, String.t, String.t, list) :: String.t | {:safe, String.t}
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

  @doc """
  Returns the current page as a Thesis.Page{} struct.

      iex> Thesis.View.current_page(%Plug.Conn{request_path: "/test"})
      %Thesis.Page{slug: "/test"}
  """
  @spec current_page(Plug.Conn.t) :: Thesis.Page.t
  def current_page(conn) do
    conn.assigns[:thesis_page] || make_page(conn.request_path)
  end

  @doc """
  Checks with the host app to see if the current page is editable by the
  current user, and then renders the editor, style tag, and bootstrap js.

  If not editable, simply returns an empty string.

  Doctests:

      iex> {:safe, editor} = Thesis.View.thesis_editor(%Plug.Conn{assigns: %{editable: true}})
      iex> String.contains?(editor, "/thesis/thesis.css")
      true
      iex> String.contains?(editor, "thesis-container")
      true
      iex> String.contains?(editor, "<script>")
      true

      iex> Thesis.View.thesis_editor(%Plug.Conn{assigns: %{editable: false}})
      {:safe, ""}
  """
  @spec thesis_editor(Plug.Conn.t) :: {:safe, String.t}
  def thesis_editor(conn) do
    if editable?(conn) do
      editor = content_tag(:div, "", id: "thesis-container")
      safe_concat([thesis_style, editor, thesis_js])
    else
      raw ""
    end
  end

  @doc """
  Outputs the page title or a provided default.

  Doctests:

      iex> page = %Thesis.Page{title: "Test Title"}
      iex> conn = %Plug.Conn{assigns: %{thesis_page: page}}
      iex> Thesis.View.page_title(conn, "Default Title")
      "Test Title"
      iex> page = %Thesis.Page{}
      iex> conn = %Plug.Conn{assigns: %{thesis_page: page}}
      iex> Thesis.View.page_title(conn, "Default Title")
      "Default Title"
  """
  def page_title(%Plug.Conn{assigns: %{thesis_page: page}}, default) do
    page.title || default
  end
  def page_title(_conn, default), do: default

  @doc """
  Outputs the page title or a provided default.

  Doctests:

      iex> page = %Thesis.Page{description: "Test Description"}
      iex> conn = %Plug.Conn{assigns: %{thesis_page: page}}
      iex> Thesis.View.page_description(conn, "Default Description")
      "Test Description"
      iex> page = %Thesis.Page{}
      iex> conn = %Plug.Conn{assigns: %{thesis_page: page}}
      iex> Thesis.View.page_description(conn, "Default Description")
      "Default Description"
  """
  def page_description(%Plug.Conn{assigns: %{thesis_page: page}}, default) do
    page.description || default
  end
  def page_description(_conn, default), do: default

  defp make_page(request_path) do
    %Thesis.Page{slug: request_path}
  end

  defp make_content(page, name, type, content) do
    %Thesis.PageContent{
      page_id: page.id,
      name: name,
      content_type: Atom.to_string(type),
      content: content
    }
  end

  defp thesis_style do
    raw """
    <link href='/thesis/thesis.css' rel='stylesheet' />
    """
  end

  defp thesis_js do
    raw """
    <script>
      ;(function () {
        var loadThesis = function () {
          var script = document.createElement('script')
          script.src = '/thesis/thesis-editor.js'

          document.head.appendChild(script)
        }

        document.addEventListener('DOMContentLoaded', function (event) {
          if (document.querySelector('#thesis-container')) {
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

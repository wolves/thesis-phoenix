defmodule Thesis.Render do
  @moduledoc """
  Renders editable page content, based on the content_type.

  Available content types:

  * html:  WYSIWYG editor, standard HTML output (sanitized)
  * text:  Raw text, all HTML is escaped, basic contenteditable
  * image: Displays an image, can replace with URL
  """

  import HtmlSanitizeEx, only: [basic_html: 1]
  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]

  @doc false
  def render_editable(%{content_type: "html"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        #{basic_html(page_content.content)}
      </div>
    """)
  end

  def render_editable(%{content_type: "text"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        #{escape_entities(page_content.content)}
      </div>
    """)
  end

  def render_editable(%{content_type: "image"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        <img src="#{escape_entities(page_content.content)}" #{image_attributes(page_content)}>
      </div>
    """)
  end

  def render_editable(%{content_type: nil} = page_content) do
    render_editable(Map.put(page_content, :content_type, "text"))
  end

  defp wrapper_attributes(%{content_type: content_type} = page_content) do
    classes = "class=\"thesis-content thesis-content-#{content_type}\""
    data_content_type = "data-thesis-content-type=\"#{content_type}\""
    data_content_id = "data-thesis-content-id=\"#{page_content.name}\""
    "#{classes} #{data_content_type} #{data_content_id}"
  end

  defp image_attributes(page_content) do
    page_content
    |> Thesis.PageContent.meta_attributes
    |> Enum.map(fn ({k, v}) -> "#{k}=\"#{escape_entities(v)}\"" end)
    |> Enum.join(" ")
  end

  defp escape_entities(unsafe) do
    unsafe
    |> html_escape
    |> safe_to_string
  end

end

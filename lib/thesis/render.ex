defmodule Thesis.Render do
  @moduledoc """
  Renders editable page content, based on the content_type.

  Available content types:

  * html: WYSIWYG editor, standard HTML output (sanitized)
  * raw_html: Edit the HTML directly, *not* sanitized -- use carefully
  * text: Raw text, all HTML is escaped, basic contenteditable
  * image: Displays an image, can edit the URL and alt tag
  * background_image: Displays an image as a background image on a div, can edit the URL
  """

  import HtmlSanitizeEx, only: [basic_html: 1]
  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]

  @doc false
  def render_editable(%{content_type: "html"} = page_content, opts) do
    raw("""
      <div #{wrapper_attributes(page_content, opts)}>
        #{basic_html(page_content.content)}
      </div>
    """)
  end

  def render_editable(%{content_type: "text"} = page_content, opts) do
    raw("""
      <div #{wrapper_attributes(page_content, opts)}>
        #{escape_entities(page_content.content)}
      </div>
    """)
  end

  def render_editable(%{content_type: "image"} = page_content, opts) do
    raw("""
      <div #{wrapper_attributes(page_content, opts)}>
        <img src="#{escape_entities(page_content.content)}" #{image_attributes(page_content)}>
      </div>
    """)
  end

  def render_editable(%{content_type: "raw_html"} = page_content, opts) do
    raw("""
      <div #{wrapper_attributes(page_content, opts)}>
        #{page_content.content}
      </div>
    """)
  end

  def render_editable(%{content_type: "background_image"} = page_content, opts) do
    raw("""
      <div #{wrapper_attributes(page_content, Keyword.put(opts, :styles, background_image_string(page_content.content)))}></div>
    """)
  end

  def render_editable(%{content_type: nil} = page_content, opts) do
    render_editable(Map.put(page_content, :content_type, "text"), opts)
  end

  defp wrapper_attributes(%{content_type: content_type} = page_content, opts) do
    classes = "class=\"thesis-content thesis-content-#{content_type} #{opts[:classes]}\""
    id = "id=\"#{opts[:id] || parameterize("thesis-content-" <> page_content.name)}\""
    data_content_type = "data-thesis-content-type=\"#{content_type}\""
    data_content_id = "data-thesis-content-id=\"#{escape_entities(page_content.name)}\""
    data_content_meta = "data-thesis-content-meta=\"#{escape_entities(page_content.meta)}\""
    data_global = (page_content.page_id == nil) && "data-thesis-content-global=\"true\"" || ""
    styles = "style=\"#{opts[:styles]}\"" # add the following when required: box-shadow: none; outline: none;
    "#{id} #{classes} #{data_content_type} #{data_content_id} #{data_global} #{data_content_meta} #{styles}"
  end

  defp image_attributes(page_content) do
    page_content
    |> Thesis.PageContent.meta_attributes
    |> Enum.map(fn ({k, v}) -> "#{k}=\"#{escape_entities(v)}\"" end)
    |> Enum.join(" ")
  end

  defp background_image_string(content) do
    "background-image: url(#{escape_entities(content)})"
  end

  defp escape_entities(unsafe) do
    unsafe
    |> html_escape
    |> safe_to_string
  end

  defp parameterize(str) do
    Regex.split(~r/\%20|\s/, str)
    |> Enum.join("-")
    |> String.downcase
  end

end

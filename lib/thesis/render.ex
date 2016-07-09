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
    id = opts[:id] && "id=\"#{opts[:id]}\"" || ""
    data_content_type = "data-thesis-content-type=\"#{content_type}\""
    data_content_id = "data-thesis-content-id=\"#{escape_entities(page_content.name)}\""
    data_content_meta = "data-thesis-content-meta=\"#{escape_entities(page_content.meta)}\""
    data_global = (page_content.page_id == nil) && "data-thesis-content-global=\"true\"" || ""
    tab_index = "tabindex=\"9999\"" # not used until required
    styles = "style=\"#{opts[:styles]}\"" # add the following when required: box-shadow: none; outline: none;
    tab_index = "tabindex=\"9999\""
    "#{id} #{classes} #{data_content_type} #{data_content_id} #{data_global} #{styles} #{data_content_meta}"
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

end

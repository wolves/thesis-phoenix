defmodule Thesis.Render do
  import HtmlSanitizeEx, only: [basic_html: 1]
  import Phoenix.HTML, only: [raw: 1, html_escape: 1, safe_to_string: 1]

  def render_editable(page_content) do
    do_render_editable(page_content)
  end

  defp do_render_editable(%{content_type: "html"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        #{basic_html(page_content.content)}
      </div>
    """)
  end

  defp do_render_editable(%{content_type: "text"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        #{escape_entities(page_content.content)}
      </div>
    """)
  end

  defp do_render_editable(%{content_type: "image"} = page_content) do
    raw("""
      <div #{wrapper_attributes(page_content)}>
        <img src="#{escape_entities(page_content.content)}" #{image_attributes(page_content)}>
      </div>
    """)
  end

  defp do_render_editable(%{content_type: nil} = page_content) do
    render_editable(Map.put(page_content, :content_type, "text"))
  end

  defp wrapper_attributes(%{content_type: content_type} = page_content) do
    classes = "class=\"thesis-content thesis-content-#{content_type}\""
    data_content_type = "data-thesis-content-type=\"#{content_type}\""
    data_content_id = "data-thesis-content-id=\"#{page_content.name}\""
    "#{classes} #{data_content_type} #{data_content_id}"
  end

  defp image_attributes(page_content) do
    escape_entities("")
  end

  defp escape_entities(unsafe) do
    unsafe
    |> html_escape
    |> safe_to_string
  end

end

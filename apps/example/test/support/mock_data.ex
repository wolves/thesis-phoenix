defmodule Example.MockData do

  def valid_static_page(slug \\ "static-page") do
    %{
      "slug" => "/" <> slug
    }
  end

  def valid_text_page_content do
    %{
      "name" => "Text Page Content",
      "content_type" => "text",
      "content" => "This is placeholder text page content."
    }
  end

  def valid_html_page_content do
    %{
      "name" => "Html Page Content",
      "content_type" => "html",
      "content" => "<p><strong>This is placeholder html page content.</strong></p>"
    }
  end

  def valid_global_content do
    %{
      "name" => "Global Content",
      "content_type" => "raw_html",
      "content" => "This is placeholder global content.",
      "global" => "true"
    }
  end

  def invalid_text_page_content do
    %{
      "name" => "Text Page Content",
      "content" => "This is placeholder text page content."
    }
  end

end
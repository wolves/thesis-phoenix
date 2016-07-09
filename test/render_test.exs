defmodule RenderTest do
  use ExUnit.Case

  alias Thesis.Render
  alias Thesis.PageContent

  doctest Render

  test "Render html content" do
    pc = %PageContent{name: "T", content_type: "html", content: "<h1>Nonsensical.</h1>"}

    assert Render.render_editable(pc) == {:safe,
      "  <div class=\"thesis-content thesis-content-html\" data-thesis-content-type=\"html\" data-thesis-content-id=\"T\" data-thesis-content-global=\"true\" tabindex=\"9999\" style=\"box-shadow: none; outline: none;\">\n    <h1>Nonsensical.</h1>\n  </div>\n"
    }
  end

  test "Render text content" do
    pc = %PageContent{name: "P", content_type: "text", content: "Plain text <p>Whoops</p>"}

    assert Render.render_editable(pc) == {:safe,
      "  <div class=\"thesis-content thesis-content-text\" data-thesis-content-type=\"text\" data-thesis-content-id=\"P\" data-thesis-content-global=\"true\" tabindex=\"9999\" style=\"box-shadow: none; outline: none;\">\n    Plain text &lt;p&gt;Whoops&lt;/p&gt;\n  </div>\n"
    }
  end

  test "Render image content" do
    pc = %PageContent{name: "Img", content_type: "image", content: "http://placekitten.com/200/300"}

    assert Render.render_editable(pc) == {:safe,
      "  <div class=\"thesis-content thesis-content-image\" data-thesis-content-type=\"image\" data-thesis-content-id=\"Img\" data-thesis-content-global=\"true\" tabindex=\"9999\" style=\"box-shadow: none; outline: none;\">\n    <img src=\"http://placekitten.com/200/300\" >\n  </div>\n"
    }
  end

  test "Render image content with alt text" do
    pc = %PageContent{name: "Img", content_type: "image", content: "http://placekitten.com/200/300", meta: "{\"alt\": \"My alt text\"}"}

    assert Render.render_editable(pc) == {:safe,
      "  <div class=\"thesis-content thesis-content-image\" data-thesis-content-type=\"image\" data-thesis-content-id=\"Img\" data-thesis-content-global=\"true\" tabindex=\"9999\" style=\"box-shadow: none; outline: none;\">\n    <img src=\"http://placekitten.com/200/300\" alt=\"My alt text\">\n  </div>\n"
    }
  end

end

